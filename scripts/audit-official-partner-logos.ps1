param(
  [string]$CandidateDirectory = ".tmp/official-partner-logo-candidates",
  [string]$ReportPath = "docs/partner-map/OFFICIAL-LOGO-AUDIT.json"
)

$ErrorActionPreference = 'Continue'
$partners = @(
  @{ id='lantek'; website='https://www.lantek.com/us' }, @{ id='roomvo'; website='https://get.roomvo.com/' },
  @{ id='stx'; website='https://stxgroup.com/' }, @{ id='csi'; website='https://www.csiamerica.com/' },
  @{ id='bentley'; website='https://www.bentley.com/' }, @{ id='kritikal'; website='https://kritikalsolutions.com/' },
  @{ id='htri'; website='https://www.htri.net/' }, @{ id='ansys'; website='https://ansys.synopsys.com/' },
  @{ id='agi'; website='https://www.agiusa.com/' }, @{ id='foxit'; website='https://www.foxit.com/pdf-reader/' },
  @{ id='autodesk'; website='https://www.autodesk.com/' }, @{ id='seequent'; website='https://www.seequent.com/' },
  @{ id='metsims'; website='https://metsims.com/' }, @{ id='zx-lidar'; website='https://www.zxlidars.com/' },
  @{ id='radiodetection'; website='https://spx.com/our-businesses/radiodetection/' }, @{ id='prokon'; website='https://prokon.com/' },
  @{ id='graitec'; website='https://graitec.com/uk/' }, @{ id='deltares'; website='https://www.deltares.nl/en' },
  @{ id='pytha'; website='https://www.pytha.com/' }, @{ id='allplan'; website='https://www.allplan.com/' },
  @{ id='ptv'; website='https://www.ptvgroup.com/en' }, @{ id='geosig'; website='https://www.geosig.com/' },
  @{ id='opera'; website='https://www.operacompany.com/' }, @{ id='emmegi'; website='https://www.emmegi.com/en/home' },
  @{ id='idea-statica'; website='https://www.ideastatica.com/vi' }, @{ id='hexagon'; website='https://hexagon.com/' },
  @{ id='geoscanner'; website='https://www.geoscanners.com/' }, @{ id='dnv'; website='https://www.dnv.com/' },
  @{ id='piletest'; website='https://www.piletest.com/' }, @{ id='gstarsoft'; website='https://www.gstarcad.net/' },
  @{ id='glodon'; website='https://asia.glodon.com/' }, @{ id='bimage'; website='https://bimageconsulting.com/' },
  @{ id='maptek'; website='https://www.maptek.com/' }, @{ id='deswik'; website='https://www.deswik.com/' }
)

New-Item -ItemType Directory -Force -Path $CandidateDirectory | Out-Null
$headers = @{ 'User-Agent'='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/127 Safari/537.36' }
$report = @()

foreach ($partner in $partners) {
  $entry = [ordered]@{ id=$partner.id; website=$partner.website; status='BLOCKED'; pageStatus=$null; candidates=@(); error=$null }
  try {
    $response = Invoke-WebRequest -Uri $partner.website -Headers $headers -MaximumRedirection 8 -TimeoutSec 35
    $entry.pageStatus = [int]$response.StatusCode
    $baseUri = $response.BaseResponse.ResponseUri
    $matches = [regex]::Matches($response.Content, '(?is)(?:src|href)\s*=\s*["'']([^"'']*(?:logo|brand)[^"'']*)["'']')
    $urls = foreach ($match in $matches) {
      $raw = [Net.WebUtility]::HtmlDecode($match.Groups[1].Value)
      if ($raw -match '^(data:|javascript:|#)') { continue }
      try { ([Uri]::new($baseUri, $raw)).AbsoluteUri } catch { }
    }
    $urls = @($urls | Where-Object { $_ -match '\.(svg|png|webp|jpe?g)(\?|$)' } | Select-Object -Unique | Select-Object -First 8)
    $index = 0
    foreach ($url in $urls) {
      $index++
      try {
        $assetResponse = Invoke-WebRequest -Uri $url -Headers $headers -MaximumRedirection 8 -TimeoutSec 35
        $contentType = [string]$assetResponse.Headers['Content-Type']
        if ($contentType -notmatch 'image/(svg\+xml|png|webp|jpeg)') { continue }
        $extension = if ($contentType -match 'svg') {'svg'} elseif ($contentType -match 'png') {'png'} elseif ($contentType -match 'webp') {'webp'} else {'jpg'}
        $fileName = '{0}-{1:D2}.{2}' -f $partner.id,$index,$extension
        $destination = Join-Path $CandidateDirectory $fileName
        [IO.File]::WriteAllBytes((Join-Path (Get-Location) $destination), $assetResponse.Content)
        $entry.candidates += [ordered]@{ file=$fileName; url=$url; contentType=$contentType; bytes=$assetResponse.Content.Length }
      } catch { }
    }
    $entry.status = if ($entry.candidates.Count -gt 0) {'CANDIDATES_FOUND'} else {'NO_OFFICIAL_ASSET_DISCOVERED'}
  } catch {
    $entry.error = $_.Exception.Message
  }
  $report += [pscustomobject]$entry
  Write-Host ($partner.id + ': ' + $entry.status + ' (' + $entry.candidates.Count + ')')
}

$report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $ReportPath -Encoding UTF8
