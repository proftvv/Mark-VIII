# Mark-VIII Encryption System Setup Script

Write-Host "Creating Mark-VIII Encryption System..." -ForegroundColor Green

# Create directory structure
$directories = @(
    "app",
    "lib",
    "components",
    "pages\api\auth",
    "pages\api\data",
    "public"
)

foreach ($dir in $directories) {
    $path = Join-Path $PSScriptRoot $dir
    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Cyan
    }
}

Write-Host "`nDirectory structure created successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run 'npm install' to install dependencies" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start the development server" -ForegroundColor White
