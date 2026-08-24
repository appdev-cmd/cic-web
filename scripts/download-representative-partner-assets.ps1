param([string]$OutputDirectory = "public/partner-map-logos")

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$assets = @(
  @{ Name='01-pytha-lab.png'; Id='10ezscx3sIR8YHeDc5HgWfVtCIHr8cyK9' }, @{ Name='02-opera-software-company-inc.png'; Id='1ShtH4iinBTBcxCInNWCCJ0lZ_FNsfV71' },
  @{ Name='03-lantek.png'; Id='1jYDqqly3yHovJTG-FPURI9Btb5aNElIY' }, @{ Name='04-emmegi.png'; Id='1uHorktoK0En-y5A0XI_Fqvr4mBO1bfGG' },
  @{ Name='05-roomvo.png'; Id='1Jx7Ab35zW6ZUbHeUolZnB9AoWhL8x-KG' }, @{ Name='06-seequent-bentley-system.png'; Id='1lTkD3Sgj1jq9fEdahJXVQ2hEdpYvPaq0' },
  @{ Name='07-maptek.png'; Id='1gwGEP-fOSXW0os7hxW13I6ulCgCMsF7K' }, @{ Name='08-deswik.png'; Id='1izqfz3TVS8Lcpgt-m8nIH7e6KLEx5Ye2' },
  @{ Name='09-metsims.png'; Id='1QBzSFAf9yQWu_i5Qb-NaIlGuGHCM7WJY' }, @{ Name='10-stx.png'; Id='12kOYsRmzUU4fKtYNQAIMPPUKVmyJ3a3-' },
  @{ Name='11-instral.png'; Id='10IgMXuYpDcH3BcaTns64A9a4tTc1ndax' }, @{ Name='12-csi.png'; Id='1OypRkoUkkX9TWawKx-FPt4BQbjP9bBKy' },
  @{ Name='13-bentley-system.png'; Id='11ZS2Okc_BZs-9nKKfp-Aua9kcl2lqERs' }, @{ Name='14-gstarsoft.png'; Id='1G_M7HahfpURZVuv-0virIiABVKRyX3wh' },
  @{ Name='15-prokon.png'; Id='1Lj4KbmqtXKq5nWzULA3iVKUulI8Ud3dD' }, @{ Name='16-glodon.png'; Id='1vzs8p9JbqotveXIqQoxab4BqJ3GIOnsW' },
  @{ Name='17-allplan.png'; Id='12e7ftYwKNJg_ajzIKj3oRhSvS7YG2UWG' }, @{ Name='18-idea-statica.png'; Id='1HbuZfajlHohA69Kuo3jzcC0dQ1TYJDk5' },
  @{ Name='20-graitec.png'; Id='1PiT4cYIXzvkTUDl0sDmaSGOHGH2sThKA' }, @{ Name='21-hexagon.png'; Id='1zlVu0iPJ-cG_Exwd3zCCwgbd6t0wT1Tt' },
  @{ Name='22-ptv.png'; Id='1RnhMgdsVXNddg2pFRZO-mgXFK6dwzvJW' }, @{ Name='23-piletest.png'; Id='1h4M5y3PZdC4x8JOzNCQkt6AybWVmTDiU' },
  @{ Name='24-zx-lidar.png'; Id='10xvoeOODO6QgfVkeyNSC0EGDUOwZye-8' }, @{ Name='25-kritikal.png'; Id='12OVbqU6thFK-VKbG8POqZsjBTjqCoJ2y' },
  @{ Name='26-htri.png'; Id='1S0jzvPW80G44hl8sdPQnEHmgHsTydMiq' }, @{ Name='28-dnv.png'; Id='1wwmnVb_-leQlQw3lSZP1eEFX5R2fscgi' },
  @{ Name='29-radio-detection-spx.png'; Id='1rgKYYDvOLeOK6m6t14ItyO0XMuNBSOBp' }, @{ Name='30-ansys.png'; Id='1DrlqCfrJiO6NT6I19gEkDXReeJs9ujjg' },
  @{ Name='32-agi.png'; Id='1dDIQLdjnIgUTFFuEmUY9peOTIEmEMS2B' }, @{ Name='33-geoscanner.png'; Id='1gphiivNpixw0PiZoyb8r3lMZ-9A9WVt8' },
  @{ Name='34-foxit.png'; Id='1SsHKzVXIb1wkXG5E4EwQvU9YBfSkpYM5' }, @{ Name='35-autodesk.png'; Id='1xa4mRTta01yuLZEP-x8SaCAOknbGDp_e' },
  @{ Name='27-geosig.png'; Url='https://www.geosig.com/images/logo.png' },
  @{ Name='36-bimage.png'; Url='https://i0.wp.com/bimageconsulting.com/wp-content/uploads/2022/08/BIMAGE__Consulting_black-logo.png?w=1565&ssl=1' }
)

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$tempRoot = Join-Path ([IO.Path]::GetTempPath()) ("cic-partners-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tempRoot | Out-Null
$results = @()

try {
  foreach ($asset in $assets) {
    $source = if ($asset.Url) { $asset.Url } else { "https://drive.google.com/uc?export=download&id=$($asset.Id)&confirm=t" }
    $tempFile = Join-Path $tempRoot ([guid]::NewGuid().ToString('N'))
    try {
      Invoke-WebRequest -Uri $source -OutFile $tempFile -MaximumRedirection 8 -TimeoutSec 12 -Headers @{ 'User-Agent'='Mozilla/5.0' }
      $bytes = [IO.File]::ReadAllBytes($tempFile)
      $head = [Text.Encoding]::UTF8.GetString($bytes, 0, [Math]::Min($bytes.Length, 512)).TrimStart([char]0xFEFF, [char]0x00, [char]0x20, [char]0x09, [char]0x0A, [char]0x0D)
      if ($bytes.Length -lt 64 -or $head -match '<!DOCTYPE|<html') { throw 'source returned HTML instead of an image' }
      if ($head -match '^<\?xml' -or $head -match '^<svg') {
        $svgName = [IO.Path]::ChangeExtension($asset.Name, '.svg')
        Copy-Item -LiteralPath $tempFile -Destination (Join-Path $OutputDirectory $svgName) -Force
        $results += [pscustomobject]@{ RequestedAsset=$asset.Name; Asset=$svgName; Format='SVG'; Status='downloaded'; Source=$source }
      } else {
        $image = [Drawing.Image]::FromFile($tempFile)
        try {
          $bitmap = New-Object Drawing.Bitmap($image.Width, $image.Height, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
          $graphics = [Drawing.Graphics]::FromImage($bitmap)
          $graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)
          $graphics.Dispose()
          $bitmap.Save((Join-Path $OutputDirectory $asset.Name), [Drawing.Imaging.ImageFormat]::Png)
          $bitmap.Dispose()
        } finally { $image.Dispose() }
        $results += [pscustomobject]@{ RequestedAsset=$asset.Name; Asset=$asset.Name; Format='PNG'; Status='downloaded'; Source=$source }
      }
    } catch {
      $results += [pscustomobject]@{ RequestedAsset=$asset.Name; Asset=$null; Format=$null; Status='blocked'; Source=$source; Error=$_.Exception.Message }
    }
  }
} finally {
  Remove-Item -LiteralPath $tempRoot -Recurse -Force
}

$results | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $OutputDirectory '_download-report.json') -Encoding UTF8
$results | Format-Table -AutoSize
if (($results | Where-Object Status -eq 'blocked').Count -gt 0) { Write-Warning 'Some original sources remain blocked. No existing repository logo was copied as fallback.' }
