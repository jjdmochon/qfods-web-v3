param(
    [int]$Port = 3002
)

$ErrorActionPreference = 'Stop'

$Source = 'K:\Mi unidad\Classroom\2627 QFDOS E\qfdos-web-v3'
$Local  = "$env:USERPROFILE\qfdos-v3-node"

Write-Host 'Sincronizando codigo -> disco local...' -ForegroundColor Cyan

if (Test-Path "$Local\src") { Remove-Item "$Local\src" -Recurse -Force }
Copy-Item "$Source\src" "$Local\src" -Recurse -Force

if (Test-Path "$Source\public") {
    if (Test-Path "$Local\public") { Remove-Item "$Local\public" -Recurse -Force }
    Copy-Item "$Source\public" "$Local\public" -Recurse -Force
}

foreach ($f in @('index.html', 'package.json', 'vite.config.ts', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json')) {
    if (Test-Path "$Source\$f") { Copy-Item "$Source\$f" $Local -Force }
}

if (Test-Path "$Source\.env.local") {
    Copy-Item "$Source\.env.local" $Local -Force
}

# Liberar puerto
$pids = netstat -ano |
    Select-String "LISTENING" |
    Select-String ":$Port\s" |
    ForEach-Object { ($_ -split '\s+' | Where-Object { $_ })[-1] } |
    Sort-Object -Unique

foreach ($procId in $pids) {
    Write-Host "Cerrando servidor previo en el puerto $Port (pid $procId)" -ForegroundColor Yellow
    taskkill /PID $procId /F 2>&1 | Out-Null
}
if ($pids) { Start-Sleep -Milliseconds 800 }

Push-Location $Local
Write-Host "Iniciando servidor Vite en http://localhost:$Port..." -ForegroundColor Green
node 'node_modules\vite\bin\vite.js' --port $Port --strictPort --host
Pop-Location
