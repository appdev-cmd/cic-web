export type RepresentativePartnerLogo = { src: string; fit: 'contain'; visualWeight: 'compact' | 'standard' | 'wide'; preferredSurface: 'light' | 'dark'; contrastAid?: 'soft-light' | 'soft-light-strong' | 'dark-surface'; verification: 'official-site' | 'provided-source-reviewed' };
export type RepresentativePartner = { id: string; name: string; country: string; website?: string; logo: RepresentativePartnerLogo };
export type RepresentativePartnerCountry = { id: string; name: string; partners: readonly RepresentativePartner[] };

const officialWebsiteLogoIds = new Set(['roomvo', 'kritikal', 'agi', 'metsims', 'radiodetection', 'pytha', 'opera', 'gstarsoft', 'bimage', 'stx', 'maptek']);

const partner = (country: string, id: string, name: string, file: string, website?: string, visualWeight: RepresentativePartnerLogo['visualWeight'] = 'standard', preferredSurface: RepresentativePartnerLogo['preferredSurface'] = 'light', contrastAid?: RepresentativePartnerLogo['contrastAid']): RepresentativePartner => ({
  id, name, country, website,
  logo: { src: `/partner-map-logos/${file}`, fit: 'contain', visualWeight, preferredSurface, contrastAid, verification: officialWebsiteLogoIds.has(id) ? 'official-site' : 'provided-source-reviewed' },
});

export const representativePartnerCountries: readonly RepresentativePartnerCountry[] = [
  { id: 'usa', name: 'Mỹ', partners: [
    partner('usa', 'lantek', 'Lantek', '01-lantek.svg', 'https://www.lantek.com/us', 'wide'),
    partner('usa', 'roomvo', 'Roomvo', '02-roomvo.png', 'https://get.roomvo.com/', 'wide'),
    partner('usa', 'stx', 'STX', '03-stx-official.svg', 'https://stxgroup.com/', 'standard'),
    partner('usa', 'csi', 'CSI', '04-csi.png', 'https://www.csiamerica.com/', 'compact'),
    partner('usa', 'bentley', 'Bentley Systems', '05-bentley-system.png', 'https://www.bentley.com/', 'wide', 'light', 'soft-light'),
    partner('usa', 'kritikal', 'Kritikal', '06-kritikal.png', 'https://kritikalsolutions.com/', 'standard', 'light', 'soft-light'),
    partner('usa', 'htri', 'HTRI', '07-htri.png', 'https://www.htri.net/', 'wide'),
    partner('usa', 'ansys', 'Ansys', '08-ansys.png', 'https://ansys.synopsys.com/'),
    partner('usa', 'agi', 'AGI', '09-agi.png', 'https://www.agiusa.com/'),
    partner('usa', 'foxit', 'Foxit', '10-foxit.png', 'https://www.foxit.com/pdf-reader/'),
    partner('usa', 'autodesk', 'Autodesk', '11-autodesk.png', 'https://www.autodesk.com/', 'standard', 'light', 'soft-light'),
    partner('usa', 'ai-architecture', 'ARCHITEChTURES', '12-ai-architecture.svg', 'https://architechtures.com/en', 'wide'),
    partner('usa', 'cype', 'CYPE', '13-cype.webp', 'https://info.cype.com/en/', 'wide'),
    partner('usa', 'sunrise-systems', 'Sunrise Systems', '45-sunrise-systems.png', undefined, 'wide'),
    partner('usa', 'softinway', 'SoftInWay', '46-softinway.svg', 'https://www.softinway.com/', 'wide'),
  ] },
  { id: 'canada', name: 'Canada', partners: [
    partner('canada', 'seequent', 'Seequent - Bentley System', '14-seequent-bentley-system.png', 'https://www.seequent.com/', 'wide', 'light', 'soft-light'),
    partner('canada', 'wingtra', 'Wingtra', '49-wingtra.png', 'https://wingtra.com/', 'wide'),
  ] },
  { id: 'uk', name: 'Vương quốc Anh', partners: [
    partner('uk', 'metsims', 'Metsims', '15-metsims.png', 'https://metsims.com/', 'standard', 'light', 'soft-light'),
    partner('uk', 'zx-lidar', 'ZX Lidars', '16-zx-lidar.png', 'https://www.zxlidars.com/'),
    partner('uk', 'radiodetection', 'Radio Detection - SPX', '17-radio-detection-spx.png', 'https://spx.com/our-businesses/radiodetection/', 'wide'),
    partner('uk', 'gigaton', 'Gigaton', '18-gigaton.png', 'https://gigaton.co/', 'wide'),
  ] },
  { id: 'ireland', name: 'Ireland', partners: [partner('ireland', 'prokon', 'Prokon', '19-prokon.png', 'https://prokon.com/')] },
  { id: 'france', name: 'Pháp', partners: [partner('france', 'graitec', 'Graitec', '20-graitec.png', 'https://graitec.com/uk/')] },
  { id: 'netherlands', name: 'Hà Lan', partners: [
    partner('netherlands', 'deltares', 'Deltares', '21-deltares.png', 'https://www.deltares.nl/en', 'wide', 'light', 'soft-light-strong'),
    partner('netherlands', 'pre-sustainability', 'PRé Sustainability', '22-pre-sustainability.png', 'https://pre-sustainability.com/', 'wide'),
    partner('netherlands', 'marin', 'MARIN', '44-marin.jpg', 'https://www.marin.nl/', 'wide'),
    partner('netherlands', 'ap-vandenberg', 'A.P. Vandenberg', '48-ap-vandenberg.png', undefined, 'wide'),
  ] },
  { id: 'germany', name: 'Đức', partners: [
    partner('germany', 'pytha', 'PYTHA', '23-pytha.png', 'https://www.pytha.com/', 'wide'),
    partner('germany', 'allplan', 'Allplan', '24-allplan.png', 'https://www.allplan.com/index.php?id=13001', 'standard', 'light', 'soft-light'),
    partner('germany', 'ptv', 'PTV', '25-ptv.png', 'https://www.ptvgroup.com/en'),
  ] },
  { id: 'switzerland', name: 'Thụy Sĩ', partners: [
    partner('switzerland', 'geosig', 'GeoSIG', '26-geosig.png', 'https://www.geosig.com/'),
    partner('switzerland', 'flyability', 'Flyability', '43-flyability.svg', 'https://www.flyability.com/', 'wide', 'dark', 'dark-surface'),
  ] },
  { id: 'denmark', name: 'Đan Mạch', partners: [partner('denmark', 'dhi', 'DHI', '47-dhi.png', 'https://www.dhigroup.com/', 'wide')] },
  { id: 'italy', name: 'Italia', partners: [
    partner('italy', 'opera', 'Opera Software Company Inc', '27-opera-software-company-inc.png', 'https://www.operacompany.com/', 'wide'),
    partner('italy', 'emmegi', 'Emmegi', '28-emmegi.png', 'https://www.emmegi.com/en/home', 'wide', 'light', 'soft-light'),
  ] },
  { id: 'czechia', name: 'Séc', partners: [partner('czechia', 'idea-statica', 'IDEA StatiCa', '29-idea-statica.png', 'https://www.ideastatica.com/vi', 'wide')] },
  { id: 'spain', name: 'Tây Ban Nha', partners: [partner('spain', 'lander', 'Lander Simulation', '30-lander-simulation.png', 'https://www.landersimulation.com/', 'wide')] },
  { id: 'sweden', name: 'Thụy Điển', partners: [partner('sweden', 'hexagon', 'Hexagon', '31-hexagon.png', 'https://hexagon.com/', 'standard', 'light', 'soft-light'), partner('sweden', 'geoscanner', 'Geoscanner', '32-geoscanner.png', 'https://www.geoscanners.com/', 'standard', 'light', 'soft-light')] },
  { id: 'norway', name: 'Na Uy', partners: [partner('norway', 'dnv', 'DNV', '33-dnv.png', 'https://www.dnv.com/', 'wide')] },
  { id: 'israel', name: 'Israel', partners: [partner('israel', 'piletest', 'Piletest', '34-piletest.png', 'https://www.piletest.com/')] },
  { id: 'china', name: 'Trung Quốc', partners: [
    partner('china', 'gstarsoft', 'Gstarsoft', '35-gstarsoft.png', 'https://www.gstarcad.net/'),
    partner('china', 'glodon', 'Glodon', '36-glodon.svg', 'https://asia.glodon.com/', 'wide'),
    partner('china', 'qysea', 'QYSEA', '37-qysea.png', 'https://www.qysea.com/', 'wide'),
    partner('china', 'chc', 'CHCNAV', '38-chc.png', 'https://www.chcnav.com/', 'standard'),
  ] },
  { id: 'singapore', name: 'Singapore', partners: [partner('singapore', 'bimage', 'BIMAGE', '39-bimage.png', undefined, 'wide', 'light', 'soft-light')] },
  { id: 'australia', name: 'Australia', partners: [partner('australia', 'maptek', 'Maptek', '40-maptek-transparent.svg', 'https://www.maptek.com/', 'wide'), partner('australia', 'deswik', 'Deswik', '41-deswik.png', 'https://www.deswik.com/', 'wide'), partner('australia', 'metron', 'METRON', '42-metron.svg', 'https://www.metron.energy/', 'wide')] },
] as const;

export const representativePartners = representativePartnerCountries.flatMap((country) => country.partners);
