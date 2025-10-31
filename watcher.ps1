# 실행: samboh-dev.cmd에서 자동 호출됨. 단독 실행도 가능.
param(
  [string]$PathToWatch = "$PSScriptRoot",
  [int]$DebounceSec = 8,
  [string]$Branch = "main"
)

Write-Host "=== SAMBOH Git Auto-Backup Watcher ==="
Write-Host "Watching: $PathToWatch (debounce ${DebounceSec}s) on branch: $Branch"
Write-Host "Stop: Ctrl + C"
Write-Host "--------------------------------------"

$fsw = New-Object System.IO.FileSystemWatcher
$fsw.Path = $PathToWatch
$fsw.IncludeSubdirectories = $true
$fsw.EnableRaisingEvents = $true
$fsw.Filter = "*.*"

$pending = $false
$timer = New-Object Timers.Timer
$timer.Interval = $DebounceSec * 1000
$timer.AutoReset = $false
$timer.add_Elapsed({
  try {
    Set-Location -Path $PathToWatch
    git add -A | Out-Null
    $stamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $hostName = $env:COMPUTERNAME
    git commit -m "auto: backup from %HOST%:$hostName at $stamp" | Out-Null
    git push origin $Branch
    Write-Host "[PUSHED] $stamp"
  } catch {
    Write-Warning "Auto-push error: $($_.Exception.Message)"
  } finally {
    $pending = $false
  }
})

$onChange = {
  if (-not $pending) {
    $pending = $true
    $timer.Stop()
    $timer.Start()
  } else {
    $timer.Stop()
    $timer.Start()
  }
}

# 이벤트 구독 (생성/변경/삭제/이름변경)
$created = Register-ObjectEvent $fsw Created -Action $onChange
$changed = Register-ObjectEvent $fsw Changed -Action $onChange
$deleted = Register-ObjectEvent $fsw Deleted -Action $onChange
$renamed = Register-ObjectEvent $fsw Renamed -Action $onChange

try {
  while ($true) { Start-Sleep -Seconds 1 }
} finally {
  Unregister-Event -SourceIdentifier $created.Name
  Unregister-Event -SourceIdentifier $changed.Name
  Unregister-Event -SourceIdentifier $deleted.Name
  Unregister-Event -SourceIdentifier $renamed.Name
  $fsw.Dispose()
  $timer.Dispose()
}
