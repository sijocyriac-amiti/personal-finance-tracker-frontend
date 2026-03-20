$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$npm = "C:\Program Files\nodejs\npm.cmd"
$stdoutLog = Join-Path $PSScriptRoot "deploy-frontend.out.log"
$stderrLog = Join-Path $PSScriptRoot "deploy-frontend.err.log"

if (-not (Test-Path $npm)) {
    throw "npm launcher not found at $npm"
}

$stopScript = Join-Path $PSScriptRoot "stop-frontend.local.ps1"
if (Test-Path $stopScript) {
    & $stopScript
}

Push-Location $projectRoot
try {
    & $npm run build

    $process = Start-Process -FilePath $npm `
        -ArgumentList "run preview -- --host 127.0.0.1 --port 3000" `
        -WorkingDirectory $projectRoot `
        -RedirectStandardOutput $stdoutLog `
        -RedirectStandardError $stderrLog `
        -PassThru

    Write-Host "Deployed personal-finance-tracker-frontend."
    Write-Host "PID: $($process.Id)"
    Write-Host "URL: http://localhost:3000"
    Write-Host "STDOUT: $stdoutLog"
    Write-Host "STDERR: $stderrLog"
}
finally {
    Pop-Location
}
