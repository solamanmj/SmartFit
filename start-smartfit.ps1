# SmartFit AI - Unified High-Efficiency Application Launcher
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "         🚀 STARTING SMARTFIT AI APPLICATION 🚀             " -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Ensure MongoDB Server is running on port 27017
$testMongo = Test-NetConnection -ComputerName 127.0.0.1 -Port 27017 -WarningAction SilentlyContinue
if (-not $testMongo.TcpTestSucceeded) {
    Write-Host " Starting Local MongoDB Server (Port 27017)..." -ForegroundColor Green
    $mongoBin = "C:\Users\solaman\.embedmongo\fileSets\502204368a43bed4f84cd1cfc5d912f718d2d1d170dbfb6212b31179622471e7\mongod.exe"
    $dbPath = "d:\SmartFit\backend\data\db"
    New-Item -ItemType Directory -Force -Path $dbPath | Out-Null
    Start-Process -FilePath $mongoBin -ArgumentList "--dbpath `"$dbPath`" --port 27017" -WindowStyle Hidden
} else {
    Write-Host " [SUCCESS] Local MongoDB Server is active on Port 27017." -ForegroundColor Green
}

Write-Host " Starting Spring Boot Backend API (Port 8081)..." -ForegroundColor Green
Write-Host " Starting FastAPI Python ML Engine (Port 8000)..." -ForegroundColor Green
Write-Host " Starting Vite React Frontend (Port 5173)..." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan

Set-Location -Path "d:\SmartFit"
npm run dev:all

