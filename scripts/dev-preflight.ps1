#!/usr/bin/env pwsh
param()
$ErrorActionPreference = 'Stop'

function Test-Port {
  param([int]$Port)
  $tcpClient = New-Object System.Net.Sockets.TcpClient
  try {
    $tcpClient.Connect('127.0.0.1', $Port)
    $tcpClient.Close()
    return $true
  } catch {
    return $false
  }
}

function Get-PidForPort {
  param([int]$Port)
  try {
    $netstat = netstat -ano | Select-String ":$Port"
    if ($netstat) {
      ($netstat -split '\s+')[-1]
    }
  } catch { }
}

function Find-FreePort {
  param([int]$Start)
  for ($p=$Start; $p -lt ($Start+50); $p++) {
    if (-not (Test-Port -Port $p)) { return $p }
  }
  return 0
}

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$override = Join-Path $root 'docker-compose.override.local.yml'

$frontend = 5173
$api = 8080
$py = 5000

$busyFrontend = (Test-Port -Port $frontend)
$busyApi = (Test-Port -Port $api)
$busyPy = (Test-Port -Port $py)

if (-not $busyFrontend -and -not $busyApi -and -not $busyPy) {
  Write-Host "All required ports are free: $frontend, $api, $py"
  exit 0
}

$altFrontend = if ($busyFrontend) { Find-FreePort -Start ($frontend+1) } else { $frontend }
$altApi = if ($busyApi) { Find-FreePort -Start ($api+1) } else { $api }
$altPy = if ($busyPy) { Find-FreePort -Start ($py+1) } else { $py }

Write-Host "Detected port conflicts:" -ForegroundColor Yellow
if ($busyFrontend) { $pid = Get-PidForPort -Port $frontend; Write-Host "- 5173 (frontend) is busy $pid" }
if ($busyApi) { $pid = Get-PidForPort -Port $api; Write-Host "- 8080 (ai-gateway) is busy $pid" }
if ($busyPy) { $pid = Get-PidForPort -Port $py; Write-Host "- 5000 (video-processor) is busy $pid" }

@"
services:
  frontend:
    ports:
      - $altFrontend:5173
  ai-gateway:
    ports:
      - $altApi:8080
  video-processor:
    ports:
      - $altPy:5000
"@ | Out-File -FilePath $override -Encoding utf8

Write-Host "Created $override with suggested mappings:" -ForegroundColor Cyan
Write-Host "- frontend: $altFrontend -> 5173"
Write-Host "- ai-gateway: $altApi -> 8080"
Write-Host "- video-processor: $altPy -> 5000"

Write-Host "Next steps:"
Write-Host "docker compose -f docker-compose.yml -f docker-compose.override.local.yml up -d --build"
exit 2

