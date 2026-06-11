param(
    [Parameter(Mandatory = $true)]
    [string] $Bucket,

    [string] $Region = "ap-northeast-2",
    [string] $Profile = "",
    [switch] $DryRun
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$imageRoot = Join-Path $repoRoot "workation\back\src\main\resources\static\dummy-images"

if (-not (Test-Path $imageRoot)) {
    throw "dummy image directory not found: $imageRoot"
}

$awsArgs = @()
if ($Profile) {
    $awsArgs += @("--profile", $Profile)
}
if ($Region) {
    $awsArgs += @("--region", $Region)
}

$files = Get-ChildItem -Path $imageRoot -Recurse -File

foreach ($file in $files) {
    $relative = $file.FullName.Substring($imageRoot.Length).TrimStart("\", "/")
    $key = "dummy-images/" + ($relative -replace "\\", "/")
    $contentType = switch -Regex ($file.Extension.ToLowerInvariant()) {
        "\.jpe?g" { "image/jpeg"; break }
        "\.webp" { "image/webp"; break }
        "\.gif" { "image/gif"; break }
        default { "image/png" }
    }

    if ($DryRun) {
        Write-Host "DRYRUN s3://$Bucket/$key <= $($file.FullName)"
        continue
    }

    aws s3 cp $file.FullName "s3://$Bucket/$key" `
        --content-type $contentType `
        --cache-control "public,max-age=31536000,immutable" `
        @awsArgs
}

Write-Host "Uploaded $($files.Count) dummy image files to s3://$Bucket/dummy-images/"
