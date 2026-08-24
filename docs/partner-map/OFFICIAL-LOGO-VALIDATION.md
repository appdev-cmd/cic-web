# Representative Partner Logo Validation

> Scope: logo fidelity and contrast only. Partner data, country mapping, world map, marker coordinates, and connector geometry were not changed.

## Method

Each official company website was requested directly. Logo candidates exposed by the header, footer, theme assets, or official media directory were downloaded into a temporary review area and compared with the current asset on both light and `slate-950` surfaces.

Candidates were rejected when they represented a customer, award, social icon, favicon, loading mark, or unrelated brand. No third-party logo source was used. The bulk background-removal script was not run.

## Official Website Assets Adopted

| Brand | Official asset evidence | Decision |
| --- | --- | --- |
| Roomvo | `get.roomvo.com/.../Roomvo-Logo-1000px.png` | replaced with current official wordmark |
| Kritikal | `kritikalsolutions.com/.../KritiKal-Logo-Black.png` | replaced with official full lockup |
| AGI | `agiusa.com/.../AGI-logo.png` | replaced with official theme asset |
| Metsims | `metsims.com/images/metsims-logo-148.png` | replaced with official header asset |
| Radiodetection | `spx.com/.../RADIODET_LOGO_R_RGB-scaled.png` | replaced with official business logo |
| PYTHA Lab | `res.pytha.com/.../pytha-logo.png` | replaced with higher-resolution official asset |
| Opera | `operacompany.com/.../opera-company-logo-120x50.png` | replaced with the current company lockup |
| Gstarsoft | `gstarcad.net/.../logo-newimg1.png` | replaced with official site logo |
| BIMAGE | `bimageconsulting.com/.../BIMAGE__Consulting_black-logo.png` | replaced with official site asset |

## Reviewed Source Assets Retained

The remaining supplied assets were visually reviewed for complete wordmark/icon content, uncropped edges, aspect ratio, and brand match. They were retained when the official page did not expose a better reusable asset, blocked automated access, or exposed only an incomplete mark such as a favicon/loading icon.

```text
Lantek, STX, CSI, Bentley Systems, HTRI, Ansys, Foxit, Autodesk,
Seequent, ZX Lidars, Prokon, Graitec, Deltares, Allplan, PTV,
GeoSIG, Emmegi, IDEA StatiCa, Hexagon, Geoscanner, DNV, Piletest,
Glodon, Instral, Maptek, Deswik
```

Instral has no official website in the supplied dataset. Its supplied original was therefore checked for visual completeness but is classified as `provided-source-reviewed`, not `official-site`.

## Contrast Treatment

Dark valid logos are not recolored. A local borderless neutral halo is enabled only for:

```text
STX, Bentley Systems, Kritikal, Autodesk, Seequent, Metsims,
Allplan, Emmegi, Hexagon, Geoscanner, BIMAGE
```

The halo does not alter the asset file, does not create a card, and does not affect layout geometry.

## Validation Contract

Every production logo now declares one of:

```text
official-site
provided-source-reviewed
```

The asset verifier rejects a logo without one of these states and continues to verify format signatures, unique files, deduplicated brand identity, and `object-fit: contain`.
