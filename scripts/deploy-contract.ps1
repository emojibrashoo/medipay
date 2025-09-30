param(
  [ValidateSet('testnet','mainnet','devnet','localnet')]
  [string]$Network = 'testnet'
)

$ErrorActionPreference = 'Stop'

Write-Host "Deploying Healthcare Smart Contract to Sui Blockchain..." -ForegroundColor Cyan

# 1) Verify Sui CLI availability
if (-not (Get-Command sui -ErrorAction SilentlyContinue)) {
  Write-Error "Sui CLI not found. Install it from https://docs.sui.io/guides/developer/getting-started/sui-install and ensure 'sui' is on PATH."
  exit 1
}

# 2) Validate project root (expects contracts/healthcare.move)
$contractPath = Join-Path $PSScriptRoot '..\contracts\healthcare.move' | Resolve-Path -ErrorAction SilentlyContinue
if (-not $contractPath) {
  Write-Error "Healthcare contract not found at contracts/healthcare.move. Run this script from the project root (medipay)."
  exit 1
}

# 3) Switch Sui environment
try {
  Write-Host "Switching Sui client to: $Network" -ForegroundColor Yellow
  sui client switch --env $Network | Out-Null
} catch {
  Write-Warning "Could not switch Sui environment automatically. Ensure your Sui client is configured for $Network. Continuing..."
}

# 4) Prepare/Scaffold a Move package (sui-healthcare)
$pkgDir = Join-Path (Get-Location) 'sui-healthcare'
if (-not (Test-Path $pkgDir)) {
  Write-Host "Creating new Sui Move package: sui-healthcare" -ForegroundColor Cyan
  sui move new sui-healthcare | Out-Null
}

# 5) Copy the Move source into package and fix Move.toml addresses
$srcDir = Join-Path $pkgDir 'sources'
New-Item -ItemType Directory -Force -Path $srcDir | Out-Null

# Remove any default sample sources
Get-ChildItem -Path $srcDir -File -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

Copy-Item -Path $contractPath -Destination (Join-Path $srcDir 'healthcare.move') -Force

# Ensure Move.toml contains an address alias that matches module address 'healthcare'
$moveToml = Join-Path $pkgDir 'Move.toml'
if (-not (Test-Path $moveToml)) {
  Write-Host "Generating Move.toml..." -ForegroundColor Cyan
  $rev = switch ($Network) {
    'mainnet' { 'framework/mainnet' }
    'testnet' { 'framework/testnet' }
    'devnet'  { 'framework/devnet' }
    default   { 'framework/testnet' }
  }
  $toml = @"
[package]
name = "sui-healthcare"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "$rev" }

[addresses]
healthcare = "0x0"
"@
  Set-Content -Path $moveToml -Value $toml -NoNewline
}

$moveTomlContent = Get-Content $moveToml -Raw
if ($moveTomlContent -notmatch '\[addresses\]') {
  $moveTomlContent = $moveTomlContent + "`n[addresses]`nhealthcare = '0x0'`n"
} elseif ($moveTomlContent -notmatch '(?m)^healthcare\s*=') {
  # Append healthcare alias under [addresses]
  $moveTomlContent = [regex]::Replace($moveTomlContent, '(?s)(\[addresses\][^\[]*)', '$1' + "`nhealthcare = '0x0'`n", 1)
}
$moveTomlContent | Set-Content -Path $moveToml -NoNewline

# 6) Build the contract
Write-Host "Building contract..." -ForegroundColor Cyan
Push-Location $pkgDir
try {
  sui move build
} catch {
  Pop-Location
  Write-Error "Build failed. Review errors above and fix Move sources before deploying."
  exit 1
}

# 7) Publish to selected network
Write-Host "Publishing contract to $Network..." -ForegroundColor Cyan
$deployJson = Join-Path $pkgDir '..\deployment-result.json'

try {
  # Publish and capture JSON output
  sui client publish --gas-budget 100000000 --json |
    Tee-Object -FilePath $deployJson | Out-Null
} catch {
  Pop-Location
  Write-Error "Publish failed. See Sui client output above."
  exit 1
}

# 8) Extract packageId from deployment JSON
if (-not (Test-Path $deployJson)) {
  Pop-Location
  Write-Error "Deployment JSON not found: $deployJson"
  exit 1
}

try {
  $json = Get-Content $deployJson -Raw | ConvertFrom-Json
  $packageId = ($json.objectChanges | Where-Object { $_.type -eq 'published' } | Select-Object -First 1).packageId
} catch {
  Pop-Location
  Write-Error "Failed to parse deployment JSON."
  exit 1
}

if (-not $packageId) {
  Pop-Location
  Write-Error "Package ID not found in deployment result."
  exit 1
}

Write-Host "Contract deployed successfully!" -ForegroundColor Green
Write-Host ("Package ID: {0}" -f $packageId) -ForegroundColor Green
Write-Host ("Explorer: https://suiexplorer.com/object/{0}?network={1}" -f $packageId, $Network) -ForegroundColor Green

# 9) Update frontend configuration (src/lib/sui.ts)
$frontendConfig = Join-Path $pkgDir '..\src\lib\sui.ts'
if (Test-Path $frontendConfig) {
  Write-Host "Updating frontend configuration (src/lib/sui.ts)..." -ForegroundColor Cyan
  $ts = Get-Content $frontendConfig -Raw
  $ts = $ts -replace "PACKAGE_ID:\s*'0x0'", "PACKAGE_ID: '$packageId'"
  $ts = $ts -replace "0x0::healthcare::", "$packageId::healthcare::"
  $ts | Set-Content $frontendConfig -NoNewline
  Write-Host "Updated PACKAGE_ID and object type prefixes." -ForegroundColor DarkGray
} else {
  Write-Warning "src/lib/sui.ts not found; skipping frontend update."
}

Pop-Location

Write-Host "Deployment complete." -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1) Commit the changes (new package, deployment-result.json updates)."
Write-Host "  2) Verify the explorer link above shows your published package."
Write-Host "  3) Adjust the frontend transaction builders to match the contract entry functions (capabilities, object args, clock)."