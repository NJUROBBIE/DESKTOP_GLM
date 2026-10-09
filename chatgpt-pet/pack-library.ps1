param(
  [Parameter(Mandatory=$true)][string]$Source,
  [Parameter(Mandatory=$true)][string]$Destination,
  [string]$Revision = 'v1'
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$sourceRoot = (Resolve-Path -LiteralPath $Source).Path.TrimEnd('\')
$destinationRoot = [System.IO.Path]::GetFullPath($Destination)
if ($destinationRoot.StartsWith($sourceRoot + '\', [System.StringComparison]::OrdinalIgnoreCase)) { throw 'Output must be outside source tree' }
New-Item -ItemType Directory -Path $destinationRoot -Force | Out-Null
$files = @(Get-ChildItem -LiteralPath $sourceRoot -Recurse -File | Where-Object { $_.FullName -notmatch '[\\/]__pycache__[\\/]' } | Sort-Object FullName)
$groups = [System.Collections.Generic.List[object]]::new()
$group = [System.Collections.Generic.List[object]]::new()
$bytes = 0L
foreach ($file in $files) {
  if ($file.Length -gt 9MB) { throw "Single source exceeds bundle limit: $($file.FullName)" }
  if ($bytes + $file.Length -gt 9MB -and $group.Count -gt 0) {
    $groups.Add($group.ToArray())
    $group = [System.Collections.Generic.List[object]]::new()
    $bytes = 0L
  }
  $group.Add($file)
  $bytes += $file.Length
}
if ($group.Count -gt 0) { $groups.Add($group.ToArray()) }
$index = @()
for ($i = 0; $i -lt $groups.Count; $i++) {
  $zipPath = Join-Path $destinationRoot ('huahai-' + $Revision + '-' + ($i + 1).ToString('00') + '.zip')
  if (Test-Path -LiteralPath $zipPath) { throw "Preserving existing archive: $zipPath" }
  $archive = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
  try {
    foreach ($file in $groups[$i]) {
      $relative = $file.FullName.Substring($sourceRoot.Length + 1).Replace('\','/')
      [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $relative, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
  } finally { $archive.Dispose() }
  $index += [pscustomobject]@{ path=$zipPath; bytes=(Get-Item -LiteralPath $zipPath).Length; files=$groups[$i].Count; sha256=(Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash.ToLower() }
}
$index | ConvertTo-Json -Depth 5
