$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$url = "http://localhost:8765/"
$python = Get-Command py.exe -ErrorAction SilentlyContinue
$pythonArguments = "-3 -m http.server 8765 --bind 127.0.0.1"

if (-not $python) {
    $python = Get-Command python.exe -ErrorAction SilentlyContinue
    $pythonArguments = "-m http.server 8765 --bind 127.0.0.1"
}

if (-not $python) {
    Write-Error "Python 3 was not found. Install Python 3, then run run-local.bat again."
}

$response = $null
try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
} catch [System.Net.WebException] {
    # No server is listening yet; start the repository's static site.
} catch {
    Write-Error "Could not check localhost:8765. Check the port and try again. $($_.Exception.Message)"
}

if ($response) {
    if ($response.Content -notmatch "A better next step for your dog") {
        Write-Error "Port 8765 is already serving a different site. Stop that server or use another port."
    }

    Start-Process $url
    Write-Host "The Pet Vaccine site is already running at $url"
    exit 0
}

$server = Start-Process `
    -FilePath $python.Source `
    -ArgumentList $pythonArguments `
    -WorkingDirectory $root `
    -PassThru

for ($attempt = 0; $attempt -lt 20; $attempt++) {
    if ($server.HasExited) {
        Write-Error "The server stopped while starting. Port 8765 may already be in use."
    }

    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
        if ($response.Content -match "A better next step for your dog") {
            Start-Process $url
            Write-Host "The Pet Vaccine site is running at $url"
            Write-Host "Keep the server window open while you use the site."
            exit 0
        }
    } catch [System.Net.WebException] {
        Start-Sleep -Milliseconds 500
    }
}

if (-not $server.HasExited) {
    Stop-Process -Id $server.Id -ErrorAction SilentlyContinue
}
Write-Error "The site did not respond at $url. Check that Python 3 is installed and port 8765 is available."
