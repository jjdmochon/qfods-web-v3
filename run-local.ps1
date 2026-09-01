# Launcher local para QFDOS Web v3
$SourceDir = $PSScriptRoot
$LocalDevDir = "$env:USERPROFILE\.dev\qfdos-web-v3"

Write-Host "== Sincronizando archivos a disco local ($LocalDevDir) ==" -ForegroundColor Cyan
if (!(Test-Path $LocalDevDir)) { New-Item -ItemType Directory -Path $LocalDevDir -Force | Out-Null }
robocopy $SourceDir $LocalDevDir /MIR /XD node_modules node_modules_backup .git .claude /XF .env.local run-local.ps1 | Out-Null

if (Test-Path "$SourceDir\.env.local") {
    Copy-Item "$SourceDir\.env.local" $LocalDevDir -Force
}

Set-Location $LocalDevDir

if (!(Test-Path "$LocalDevDir\node_modules")) {
    Write-Host "== Instalando dependencias con Bun ==" -ForegroundColor Yellow
    bun install
}

Write-Host "== Iniciando servidor Vite en http://localhost:3001 ==" -ForegroundColor Green
bun run dev
