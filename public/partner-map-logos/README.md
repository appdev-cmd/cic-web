# Representative partner logo assets

This directory is an independent asset set for the representative global-partner data. No file was copied from the repository's older partner-logo directories.

## Processing contract

```text
download original → detect actual format → decode/validate → remove edge-connected background where safe → crop transparent whitespace → preserve aspect ratio and brand colors
```

- SVG sources that decoded correctly remain SVG: Lantek, Maptek, and Glodon.
- Other sources are genuinely decoded and exported as 32-bit PNG; files were not renamed without conversion.
- Rendering metadata lives in `src/web/data/representativePartners.ts`: every logo uses `fit: contain`, plus a visual-weight class and preferred light/dark surface.
- Maptek's supplied SVG is white artwork and therefore declares a dark preferred surface. It was not recolored.

## Dataset updates

The original input contains 36 rows. `Glodon - Cubicost` and `Glodon - Magicad` share the same real brand and source asset, so they resolve to one `Glodon` entry and `35-glodon.svg`.

The supplied update replaces the Geoscanner, PYTHA, Autodesk, and Radio Detection - SPX artwork; removes Instral; and adds Gigaton, Lander Simulation, QYSEA, AI Architecture, CHC, Metron, CYPE, and PRé Sustainability. The current dataset contains 42 brands in 17 country groups.

## Source exceptions

- Deltares: the supplied Google Drive folder did not expose an unambiguous file-to-brand mapping. The final transparent logo was recovered from the Netherlands Centre for Coastal Research asset host and visually verified as Deltares.
- GeoSIG: the supplied official image URL repeatedly timed out. The final logo was recovered from the International Seismological Centre asset host and visually verified as GeoSIG.

These are source recoveries, not redrawn or AI-generated logos. All other assets came from the supplied direct source URLs.

## Reports

- `_download-report.json`: direct-download/detected-format results.
- `_normalization-report.json`: decode, crop, and transparency processing results.

`REVIEW` in the normalization report is a conservative edge-contact flag. Each flagged logo was inspected in the generated contact sheet; edge contact belongs to the supplied artwork and no logo content was clipped.
