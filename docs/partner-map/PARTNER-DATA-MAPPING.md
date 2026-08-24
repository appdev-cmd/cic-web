# Representative Partner Data Mapping

The supplied partner file is the sole content source for the global partner map.

```text
legacy rows: 77
rows present in supplied source: 36
deduplicated displayed brands: 35
country groups: 17
```

These values are audit metadata only and are not rendered in the interface.

## Brand merge

```text
Glodon - Cubicost
Glodon - Magicad
→ Glodon (China, 16-glodon.svg)
```

## Removed legacy partners

The following 41 legacy entries do not occur in the supplied source and are no longer part of the map data or UI:

```text
A.P.Vandenberg
AQS
AVEVA
Cype
DHI
DJI, Wingtra
DMT
EcoAct
EDC HVE
Erke Tasarim
FLIR, SONAVU
Flyability
Geonor
Geotechnical
Geotomographie
Gigaton
Goslam
IRIS
Lander Simulation
LIDARUSA, GVI, PHOENIX LIDAR
MAAP & iMAAP
MARIN
Metron
MIDAS
Pasi
Pavemetrics
PRé Sustainability
QYSEA
RISA
Rock Mapper
Rocscience
RPS
Schuller
Sewer Robotics
Shenhao
SoftInWay
Sunrise Systems
Thermoflow
TRL
Turkeco
Weedoo
```

## Final country mapping

| Country | Displayed partners |
| --- | --- |
| Mỹ | Lantek; Roomvo; STX; CSI; Bentley Systems; Kritikal; HTRI; Ansys; AGI; Foxit; Autodesk |
| Canada | Seequent |
| Vương quốc Anh | Metsims; ZX Lidars; Radiodetection · SPX |
| Ireland | Prokon |
| Pháp | Graitec |
| Hà Lan | Deltares |
| Đức | PYTHA Lab; Allplan; PTV |
| Thụy Sĩ | GeoSIG |
| Italia | Opera Software Company Inc; Emmegi |
| Séc | IDEA StatiCa |
| Thụy Điển | Hexagon; Geoscanner |
| Na Uy | DNV |
| Israel | Piletest |
| Trung Quốc | Gstarsoft; Glodon |
| Hàn Quốc | Instral |
| Singapore | BIMAGE |
| Australia | Maptek; Deswik |

Each row maps to one immutable country ID and one prepared asset under `public/partner-map-logos`. Country ownership is declared explicitly in `representativePartners.ts`; it is not inferred from company name, website, logo, or legacy data.
