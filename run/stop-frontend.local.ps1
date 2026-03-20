$listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1

if (-not $listener) {
    Write-Host "No frontend process is listening on port 3000."
    exit 0
}

$process = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue

if (-not $process) {
    Write-Warning "Found listener on port 3000, but the owning process is no longer available."
    exit 1
}

Stop-Process -Id $process.Id -Force
Write-Host "Stopped $($process.ProcessName) (PID $($process.Id)) on port 3000."
