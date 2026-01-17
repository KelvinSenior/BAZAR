# Script to update .env file with Supabase connection string
# Usage: .\update-env.ps1 "your-connection-string-here"

param(
    [Parameter(Mandatory=$true)]
    [string]$ConnectionString
)

$envFile = ".env"
$newLine = "DATABASE_URL=`"$ConnectionString`""

# Backup existing .env if it exists
if (Test-Path $envFile) {
    Copy-Item $envFile "$envFile.backup"
    Write-Host "✓ Backed up existing .env to .env.backup"
}

# Write new connection string
$newLine | Out-File -FilePath $envFile -Encoding utf8 -NoNewline
Write-Host "✓ Updated .env file"
Write-Host ""
Write-Host "New DATABASE_URL:"
Get-Content $envFile
Write-Host ""
Write-Host "Testing connection..."
Write-Host "Run: npx prisma db push"
