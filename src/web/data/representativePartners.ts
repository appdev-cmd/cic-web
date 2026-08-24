export type RepresentativePartnerLogo = { src: string; fit: 'contain'; visualWeight: 'compact' | 'standard' | 'wide'; preferredSurface: 'light' | 'dark'; contrastAid?: 'soft-light' | 'soft-light-strong' | 'maptek-green'; verification: 'official-site' | 'provided-source-reviewed' };
export type RepresentativePartner = { id: string; name: string; country: string; website?: string; logo: RepresentativePartnerLogo };
export type RepresentativePartnerCountry = { id: string; name: string; partners: readonly RepresentativePartner[] };

const officialWebsiteLogoIds = new Set(['roomvo', 'kritikal', 'agi', 'metsims', 'radiodetection', 'pytha', 'opera', 'gstarsoft', 'bimage', 'stx', 'maptek']);

const partner = (country: string, id: string, name: string, file: string, website?: string, visualWeight: RepresentativePartnerLogo['visualWeight'] = 'standard', preferredSurface: RepresentativePartnerLogo['preferredSurface'] = 'light', contrastAid?: RepresentativePartnerLogo['contrastAid']): RepresentativePartner => ({
  id, name, country, website,
  logo: { src: `/partner-map-logos/${file}`, fit: 'contain', visualWeight, preferredSurface, contrastAid, verification: officialWebsiteLogoIds.has(id) ? 'official-site' : 'provided-source-reviewed' },
});

export const representativePartnerCountries: readonly RepresentativePartnerCountry[] = [
  { id: 'usa', name: 'Mỹ', partners: [
    partner('usa', 'lantek', 'Lantek', '03-lantek.svg', 'https://www.lantek.com/us', 'wide'),
    partner('usa', 'roomvo', 'Roomvo', '05-roomvo.png', 'https://get.roomvo.com/', 'wide'),
    partner('usa', 'stx', 'STX', '10-stx-official.svg', 'https://stxgroup.com/', 'standard'),
    partner('usa', 'csi', 'CSI', '12-csi.png', 'https://www.csiamerica.com/', 'compact'),
    partner('usa', 'bentley', 'Bentley Systems', '13-bentley-system.png', 'https://www.bentley.com/', 'wide', 'light', 'soft-light'),
    partner('usa', 'kritikal', 'Kritikal', '25-kritikal.png', 'https://kritikalsolutions.com/', 'standard', 'light', 'soft-light'),
    partner('usa', 'htri', 'HTRI', '26-htri.png', 'https://www.htri.net/', 'wide'),
    partner('usa', 'ansys', 'Ansys', '30-ansys.png', 'https://ansys.synopsys.com/'),
    partner('usa', 'agi', 'AGI', '32-agi.png', 'https://www.agiusa.com/'),
    partner('usa', 'foxit', 'Foxit', '34-foxit.png', 'https://www.foxit.com/pdf-reader/'),
    partner('usa', 'autodesk', 'Autodesk', '35-autodesk.png', 'https://www.autodesk.com/', 'standard', 'light', 'soft-light'),
  ] },
  { id: 'canada', name: 'Canada', partners: [partner('canada', 'seequent', 'Seequent', '06-seequent-bentley-system.png', 'https://www.seequent.com/', 'wide', 'light', 'soft-light')] },
  { id: 'uk', name: 'Vương quốc Anh', partners: [
    partner('uk', 'metsims', 'Metsims', '09-metsims.png', 'https://metsims.com/', 'standard', 'light', 'soft-light'),
    partner('uk', 'zx-lidar', 'ZX Lidars', '24-zx-lidar.png', 'https://www.zxlidars.com/'),
    partner('uk', 'radiodetection', 'Radiodetection · SPX', '29-radio-detection-spx.png', 'https://spx.com/our-businesses/radiodetection/', 'wide'),
  ] },
  { id: 'ireland', name: 'Ireland', partners: [partner('ireland', 'prokon', 'Prokon', '15-prokon.png', 'https://prokon.com/')] },
  { id: 'france', name: 'Pháp', partners: [partner('france', 'graitec', 'Graitec', '20-graitec.png', 'https://graitec.com/uk/')] },
  { id: 'netherlands', name: 'Hà Lan', partners: [partner('netherlands', 'deltares', 'Deltares', '19-deltares.png', 'https://www.deltares.nl/en', 'wide', 'light', 'soft-light-strong')] },
  { id: 'germany', name: 'Đức', partners: [
    partner('germany', 'pytha', 'PYTHA Lab', '01-pytha-lab.png', 'https://www.pytha.com/', 'wide'),
    partner('germany', 'allplan', 'Allplan', '17-allplan.png', 'https://www.allplan.com/index.php?id=13001', 'standard', 'light', 'soft-light'),
    partner('germany', 'ptv', 'PTV', '22-ptv.png', 'https://www.ptvgroup.com/en'),
  ] },
  { id: 'switzerland', name: 'Thụy Sĩ', partners: [partner('switzerland', 'geosig', 'GeoSIG', '27-geosig.png', 'https://www.geosig.com/')] },
  { id: 'italy', name: 'Italia', partners: [
    partner('italy', 'opera', 'Opera Software Company Inc', '02-opera-software-company-inc.png', 'https://www.operacompany.com/', 'wide'),
    partner('italy', 'emmegi', 'Emmegi', '04-emmegi.png', 'https://www.emmegi.com/en/home', 'wide', 'light', 'soft-light'),
  ] },
  { id: 'czechia', name: 'Séc', partners: [partner('czechia', 'idea-statica', 'IDEA StatiCa', '18-idea-statica.png', 'https://www.ideastatica.com/vi', 'wide')] },
  { id: 'sweden', name: 'Thụy Điển', partners: [partner('sweden', 'hexagon', 'Hexagon', '21-hexagon.png', 'https://hexagon.com/', 'standard', 'light', 'soft-light'), partner('sweden', 'geoscanner', 'Geoscanner', '33-geoscanner.png', 'https://www.geoscanners.com/', 'standard', 'light', 'soft-light')] },
  { id: 'norway', name: 'Na Uy', partners: [partner('norway', 'dnv', 'DNV', '28-dnv.png', 'https://www.dnv.com/', 'wide')] },
  { id: 'israel', name: 'Israel', partners: [partner('israel', 'piletest', 'Piletest', '23-piletest.png', 'https://www.piletest.com/')] },
  { id: 'china', name: 'Trung Quốc', partners: [partner('china', 'gstarsoft', 'Gstarsoft', '14-gstarsoft.png', 'https://www.gstarcad.net/'), partner('china', 'glodon', 'Glodon', '16-glodon.svg', 'https://asia.glodon.com/', 'wide')] },
  { id: 'south-korea', name: 'Hàn Quốc', partners: [partner('south-korea', 'instral', 'Instral', '11-instral.png', undefined, 'standard', 'dark')] },
  { id: 'singapore', name: 'Singapore', partners: [partner('singapore', 'bimage', 'BIMAGE', '36-bimage.png', undefined, 'wide', 'light', 'soft-light')] },
  { id: 'australia', name: 'Australia', partners: [partner('australia', 'maptek', 'Maptek', '07-maptek.svg', 'https://www.maptek.com/', 'wide', 'dark', 'maptek-green'), partner('australia', 'deswik', 'Deswik', '08-deswik.png', 'https://www.deswik.com/', 'wide')] },
] as const;

export const representativePartners = representativePartnerCountries.flatMap((country) => country.partners);
