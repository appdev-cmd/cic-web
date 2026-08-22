export interface GlobalPartner {
  stt: number;
  name: string;
  country: string;
  city: string;
  flag: string;
  lat: number;
  lng: number;
  category: string;
  url: string;
  logo: string;
}

export interface CountryNode {
  country: string;
  flag: string;
  lat: number;
  lng: number;
  partners: GlobalPartner[];
}

export const globalPartners: GlobalPartner[] = [
  {
    "stt": 1,
    "name": "PYTHA Lab",
    "country": "Đức",
    "city": "Aschaffenburg",
    "flag": "🇩🇪",
    "lat": 49.9767,
    "lng": 9.1481,
    "category": "Phần mềm Kết cấu & Cơ khí",
    "url": "https://www.pytha.com/",
    "logo": "/partners/1.png"
  },
  {
    "stt": 2,
    "name": "Opera Software Company Inc",
    "country": "Italia",
    "city": "Pordenone",
    "flag": "🇮🇹",
    "lat": 45.9567,
    "lng": 12.6605,
    "category": "BIM & Số hóa Kiến trúc",
    "url": "https://www.operacompany.com/",
    "logo": "/partners/2.png"
  },
  {
    "stt": 3,
    "name": "Lantek",
    "country": "Hoa Kỳ",
    "city": "Mason, OH",
    "flag": "🇺🇸",
    "lat": 39.3601,
    "lng": -84.3099,
    "category": "Phần mềm Kết cấu & Cơ khí",
    "url": "https://www.lantek.com/us",
    "logo": "/partners/3.png"
  },
  {
    "stt": 4,
    "name": "Emmegi",
    "country": "Italia",
    "city": "Modena",
    "flag": "🇮🇹",
    "lat": 44.7378,
    "lng": 10.9272,
    "category": "BIM & Số hóa Kiến trúc",
    "url": "https://www.emmegi.com/en/home",
    "logo": "/partners/4.png"
  },
  {
    "stt": 5,
    "name": "Roomvo",
    "country": "Hoa Kỳ",
    "city": "Toronto / US East",
    "flag": "🇺🇸",
    "lat": 43.6532,
    "lng": -79.3832,
    "category": "BIM & Số hóa Kiến trúc",
    "url": "https://get.roomvo.com/",
    "logo": "/partners/5.png"
  },
  {
    "stt": 6,
    "name": "Seequent - Bentley System",
    "country": "Canada",
    "city": "Calgary / Vancouver",
    "flag": "🇨🇦",
    "lat": 51.0447,
    "lng": -114.0719,
    "category": "BIM & Số hóa Kiến trúc",
    "url": "https://www.seequent.com/",
    "logo": "/partners/logo_seequent.png"
  },
  {
    "stt": 7,
    "name": "Maptek",
    "country": "Australia",
    "city": "Adelaide",
    "flag": "🇦🇺",
    "lat": -34.9285,
    "lng": 138.6007,
    "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
    "url": "https://www.maptek.com/",
    "logo": "/partners/7.png"
  },
  {
    "stt": 8,
    "name": "Deswik",
    "country": "Australia",
    "city": "Brisbane",
    "flag": "🇦🇺",
    "lat": -27.4698,
    "lng": 153.0251,
    "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
    "url": "https://www.deswik.com/",
    "logo": "/partners/6763e884c6186cfbb7d64c14_Deswik Logo Blue CMYK.png"
  },
  {
    "stt": 9,
    "name": "Metsims",
    "country": "Vương Quốc Anh",
    "city": "London / Oxford",
    "flag": "🇬🇧",
    "lat": 51.5074,
    "lng": -0.1278,
    "category": "Net Zero & Phát triển Bền vững",
    "url": "https://metsims.com/",
    "logo": "/partners/9.png"
  },
  {
    "stt": 10,
    "name": "PRé Sustainability",
    "country": "Hà Lan",
    "city": "Amersfoort",
    "flag": "🇳🇱",
    "lat": 52.1561,
    "lng": 5.3878,
    "category": "Net Zero & Phát triển Bền vững",
    "url": "https://pre-sustainability.com/",
    "logo": "/partners/10.png"
  },
  {
    "stt": 11,
    "name": "Gigaton",
    "country": "Vương Quốc Anh",
    "city": "London",
    "flag": "🇬🇧",
    "lat": 51.5074,
    "lng": -0.1278,
    "category": "Net Zero & Phát triển Bền vững",
    "url": "https://gigaton.co/",
    "logo": "/partners/11.png"
  },
  {
    "stt": 12,
    "name": "Metron",
    "country": "Australia",
    "city": "Sydney",
    "flag": "🇦🇺",
    "lat": -33.8688,
    "lng": 151.2093,
    "category": "Net Zero & Phát triển Bền vững",
    "url": "https://www.metron.energy/",
    "logo": "/partners/12.png"
  },
  {
    "stt": 13,
    "name": "EcoAct",
    "country": "Vương Quốc Anh",
    "city": "London",
    "flag": "🇬🇧",
    "lat": 51.5074,
    "lng": -0.1278,
    "category": "Net Zero & Phát triển Bền vững",
    "url": "https://eco-act.com/",
    "logo": "/partners/EcoAct.png"
  },
  {
    "stt": 14,
    "name": "Rock Mapper",
    "country": "Australia",
    "city": "Perth",
    "flag": "🇦🇺",
    "lat": -31.9505,
    "lng": 115.8605,
    "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
    "url": "https://www.rockmapper.net/",
    "logo": "/partners/14.jpg"
  },
  {
    "stt": 15,
    "name": "Flyability",
    "country": "Thụy Sĩ",
    "city": "Lausanne",
    "flag": "🇨🇭",
    "lat": 46.5197,
    "lng": 6.6323,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "https://www.flyability.com/",
    "logo": "/partners/15.png"
  },
  {
    "stt": 16,
    "name": "Turkeco",
    "country": "Thổ Nhĩ Kỳ",
    "city": "Istanbul",
    "flag": "🇹🇷",
    "lat": 41.0082,
    "lng": 28.9784,
    "category": "Net Zero & Phát triển Bền vững",
    "url": "https://turkeco.com/en/",
    "logo": "/partners/16.png"
  },
  {
    "stt": 17,
    "name": "Erke Tasarim",
    "country": "Thổ Nhĩ Kỳ",
    "city": "Istanbul",
    "flag": "🇹🇷",
    "lat": 41.0082,
    "lng": 28.9784,
    "category": "Net Zero & Phát triển Bền vững",
    "url": "https://erketasarim.com/en",
    "logo": "/partners/17.png"
  },
  {
    "stt": 18,
    "name": "STX",
    "country": "Hoa Kỳ",
    "city": "New York, NY",
    "flag": "🇺🇸",
    "lat": 40.7128,
    "lng": -74.006,
    "category": "Phần mềm Kết cấu & Cơ khí",
    "url": "https://stxgroup.com/",
    "logo": "/partners/18.png"
  },
  {
    "stt": 19,
    "name": "Instral",
    "country": "Hàn Quốc",
    "city": "Seoul",
    "flag": "🇰🇷",
    "lat": 37.5665,
    "lng": 126.978,
    "category": "Giải pháp Chuyển đổi số Kỹ thuật",
    "url": "",
    "logo": "/partners/19.png"
  },
  {
    "stt": 20,
    "name": "CSI",
    "country": "Hoa Kỳ",
    "city": "Berkeley, CA",
    "flag": "🇺🇸",
    "lat": 37.8715,
    "lng": -122.273,
    "category": "Phần mềm Kết cấu & Cơ khí",
    "url": "https://www.csiamerica.com/",
    "logo": "/partners/63.CSI.png"
  },
  {
    "stt": 22,
    "name": "Bentley system",
    "country": "Hoa Kỳ",
    "city": "Exton, PA",
    "flag": "🇺🇸",
    "lat": 40.0326,
    "lng": -75.6174,
    "category": "BIM & Số hóa Kiến trúc",
    "url": "https://www.bentley.com/",
    "logo": "/partners/BentleyLOGO_BLK_complete.png"
  },
  {
    "stt": 23,
    "name": "Gstarsoft",
    "country": "Trung Quốc",
    "city": "Bắc Kinh / Tô Châu",
    "flag": "🇨🇳",
    "lat": 39.9042,
    "lng": 116.4074,
    "category": "Phần mềm Kết cấu & Cơ khí",
    "url": "https://www.gstarcad.net/",
    "logo": "/partners/23.png"
  },
  {
    "stt": 24,
    "name": "RISA",
    "country": "Hoa Kỳ",
    "city": "Foothill Ranch, CA",
    "flag": "🇺🇸",
    "lat": 33.6708,
    "lng": -117.6631,
    "category": "Phần mềm Kết cấu & Cơ khí",
    "url": "",
    "logo": "/partners/24.png"
  },
  {
    "stt": 25,
    "name": "Prokon",
    "country": "Ireland",
    "city": "Dublin",
    "flag": "🇮🇪",
    "lat": 53.3498,
    "lng": -6.2603,
    "category": "Phần mềm Kết cấu & Cơ khí",
    "url": "https://prokon.com/",
    "logo": "/partners/25.png"
  },
  {
    "stt": 26,
    "name": "Glodon - Cubicost",
    "country": "Trung Quốc",
    "city": "Bắc Kinh",
    "flag": "🇨🇳",
    "lat": 39.9042,
    "lng": 116.4074,
    "category": "BIM & Số hóa Kiến trúc",
    "url": "https://asia.glodon.com/cubicost",
    "logo": "/partners/26.png"
  },
  {
    "stt": 27,
    "name": "Allplan",
    "country": "Đức",
    "city": "Munich",
    "flag": "🇩🇪",
    "lat": 48.1351,
    "lng": 11.582,
    "category": "BIM & Số hóa Kiến trúc",
    "url": "https://www.allplan.com/index.php?id=13001",
    "logo": "/partners/27.png"
  },
  {
    "stt": 28,
    "name": "IDEA Statica",
    "country": "Séc",
    "city": "Brno",
    "flag": "🇨🇿",
    "lat": 49.1951,
    "lng": 16.6068,
    "category": "Phần mềm Kết cấu & Cơ khí",
    "url": "https://www.ideastatica.com/vi",
    "logo": "/partners/28.png"
  },
  {
    "stt": 29,
    "name": "MIDAS",
    "country": "Hàn Quốc",
    "city": "Seoul / Seongnam",
    "flag": "🇰🇷",
    "lat": 37.3827,
    "lng": 127.1189,
    "category": "Phần mềm Kết cấu & Cơ khí",
    "url": "https://www.midasuser.com/en",
    "logo": "/partners/29.png"
  },
  {
    "stt": 30,
    "name": "Rocscience",
    "country": "Canada",
    "city": "Toronto, ON",
    "flag": "🇨🇦",
    "lat": 43.6532,
    "lng": -79.3832,
    "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
    "url": "https://www.rocscience.com/",
    "logo": "/partners/rocscience-logo-primary-for-website2.png"
  },
  {
    "stt": 31,
    "name": "Deltares",
    "country": "Hà Lan",
    "city": "Delft",
    "flag": "🇳🇱",
    "lat": 52.0116,
    "lng": 4.3571,
    "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
    "url": "https://www.deltares.nl/en",
    "logo": "/partners/31.png"
  },
  {
    "stt": 32,
    "name": "MARIN",
    "country": "Hà Lan",
    "city": "Wageningen",
    "flag": "🇳🇱",
    "lat": 51.9692,
    "lng": 5.6654,
    "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
    "url": "",
    "logo": "/partners/32.png"
  },
  {
    "stt": 33,
    "name": "Graitec",
    "country": "Pháp",
    "city": "Paris / Bièvres",
    "flag": "🇫🇷",
    "lat": 48.7547,
    "lng": 2.2158,
    "category": "Phần mềm Kết cấu & Cơ khí",
    "url": "https://graitec.com/uk/",
    "logo": "/partners/33.png"
  },
  {
    "stt": 34,
    "name": "Thermoflow",
    "country": "Hoa Kỳ",
    "city": "Jacksonville, FL",
    "flag": "🇺🇸",
    "lat": 30.3322,
    "lng": -81.6557,
    "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
    "url": "https://www.thermoflow.com/",
    "logo": "/partners/34.png"
  },
  {
    "stt": 35,
    "name": "Hexagon",
    "country": "Thụy Điển",
    "city": "Stockholm",
    "flag": "🇸🇪",
    "lat": 59.3293,
    "lng": 18.0686,
    "category": "Giải pháp Chuyển đổi số Kỹ thuật",
    "url": "https://hexagon.com/",
    "logo": "/partners/61.Hexagon_Signage_Standard_PMS_Logo.png"
  },
  {
    "stt": 36,
    "name": "Cype",
    "country": "Tây Ban Nha",
    "city": "Alicante",
    "flag": "🇪🇸",
    "lat": 38.3452,
    "lng": -0.481,
    "category": "Phần mềm Kết cấu & Cơ khí",
    "url": "https://info.cype.com/en/",
    "logo": "/partners/36.png"
  },
  {
    "stt": 37,
    "name": "PTV",
    "country": "Đức",
    "city": "Karlsruhe",
    "flag": "🇩🇪",
    "lat": 49.0069,
    "lng": 8.4037,
    "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
    "url": "https://www.ptvgroup.com/en",
    "logo": "/partners/37.png"
  },
  {
    "stt": 38,
    "name": "RPS",
    "country": "Vương Quốc Anh",
    "city": "Abingdon",
    "flag": "🇬🇧",
    "lat": 51.6708,
    "lng": -1.2828,
    "category": "Giải pháp Chuyển đổi số Kỹ thuật",
    "url": "",
    "logo": "/partners/38.png"
  },
  {
    "stt": 39,
    "name": "Piletest",
    "country": "Israel",
    "city": "Tel Aviv",
    "flag": "🇮🇱",
    "lat": 32.175,
    "lng": 34.9069,
    "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
    "url": "https://www.piletest.com/",
    "logo": "/partners/39.png"
  },
  {
    "stt": 40,
    "name": "Zx Lidar",
    "country": "Vương Quốc Anh",
    "city": "Ledbury",
    "flag": "🇬🇧",
    "lat": 52.0368,
    "lng": -2.4289,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "https://www.zxlidars.com/",
    "logo": "/partners/40.png"
  },
  {
    "stt": 41,
    "name": "AQS",
    "country": "Thụy Điển",
    "city": "Motala",
    "flag": "🇸🇪",
    "lat": 58.5371,
    "lng": 15.0365,
    "category": "Giải pháp Chuyển đổi số Kỹ thuật",
    "url": "",
    "logo": "/partners/aqsystem.png"
  },
  {
    "stt": 42,
    "name": "Kritikal",
    "country": "Hoa Kỳ",
    "city": "San Jose, CA",
    "flag": "🇺🇸",
    "lat": 37.3382,
    "lng": -121.8863,
    "category": "Giải pháp Chuyển đổi số Kỹ thuật",
    "url": "https://kritikalsolutions.com/",
    "logo": "/partners/42.png"
  },
  {
    "stt": 43,
    "name": "Sunrise Systems",
    "country": "Hoa Kỳ",
    "city": "Sugar Land, TX",
    "flag": "🇺🇸",
    "lat": 29.6197,
    "lng": -95.6349,
    "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
    "url": "https://www.sunrisesys.com/",
    "logo": "/partners/43.png"
  },
  {
    "stt": 44,
    "name": "SoftInWay",
    "country": "Hoa Kỳ",
    "city": "Burlington, MA",
    "flag": "🇺🇸",
    "lat": 42.5048,
    "lng": -71.1956,
    "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
    "url": "https://www.softinway.com/",
    "logo": "/partners/44.png"
  },
  {
    "stt": 45,
    "name": "TRL",
    "country": "Vương Quốc Anh",
    "city": "Crowthorne",
    "flag": "🇬🇧",
    "lat": 51.3708,
    "lng": -0.7937,
    "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
    "url": "https://www.trl.co.uk/",
    "logo": "/partners/45.png"
  },
  {
    "stt": 46,
    "name": "HTRI",
    "country": "Hoa Kỳ",
    "city": "Navasota, TX",
    "flag": "🇺🇸",
    "lat": 30.3877,
    "lng": -96.0877,
    "category": "Giải pháp Chuyển đổi số Kỹ thuật",
    "url": "https://www.htri.net/",
    "logo": "/partners/64.HTRI-transparent-v.png"
  },
  {
    "stt": 47,
    "name": "DHI",
    "country": "Đan Mạch",
    "city": "Copenhagen",
    "flag": "🇩🇰",
    "lat": 55.8833,
    "lng": 12.5,
    "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
    "url": "https://www.dhigroup.com/",
    "logo": "/partners/47.png"
  },
  {
    "stt": 48,
    "name": "Schuller",
    "country": "Đức",
    "city": "Bochum",
    "flag": "🇩🇪",
    "lat": 51.4818,
    "lng": 7.2162,
    "category": "Phần mềm Kết cấu & Cơ khí",
    "url": "https://www.schullerco.com/sc-bocad",
    "logo": "/partners/48.png"
  },
  {
    "stt": 49,
    "name": "Sewer Robotics",
    "country": "Hà Lan",
    "city": "Zevenbergen",
    "flag": "🇳🇱",
    "lat": 51.6456,
    "lng": 4.6006,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "",
    "logo": "/partners/49.png"
  },
  {
    "stt": 50,
    "name": "Geosig",
    "country": "Thụy Sĩ",
    "city": "Zurich",
    "flag": "🇨🇭",
    "lat": 47.3962,
    "lng": 8.4475,
    "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
    "url": "https://www.geosig.com/",
    "logo": "/partners/50.png"
  },
  {
    "stt": 51,
    "name": "DMT",
    "country": "Đức",
    "city": "Essen",
    "flag": "🇩🇪",
    "lat": 51.4556,
    "lng": 7.0116,
    "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
    "url": "https://www.dmt-group.com/",
    "logo": "/partners/51.png"
  },
  {
    "stt": 52,
    "name": "DNV",
    "country": "Na Uy",
    "city": "Oslo / Høvik",
    "flag": "🇳🇴",
    "lat": 59.9,
    "lng": 10.5833,
    "category": "Giải pháp Chuyển đổi số Kỹ thuật",
    "url": "https://www.dnv.com/",
    "logo": "/partners/52.png"
  },
  {
    "stt": 53,
    "name": "Radio Detection - SPX",
    "country": "Vương Quốc Anh",
    "city": "Bristol",
    "flag": "🇬🇧",
    "lat": 51.4545,
    "lng": -2.5879,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "https://spx.com/our-businesses/radiodetection/",
    "logo": "/partners/53.png"
  },
  {
    "stt": 54,
    "name": "ANSYS",
    "country": "Hoa Kỳ",
    "city": "Canonsburg, PA",
    "flag": "🇺🇸",
    "lat": 40.2592,
    "lng": -80.1873,
    "category": "Phần mềm Kết cấu & Cơ khí",
    "url": "https://ansys.synopsys.com/",
    "logo": "/partners/54.png"
  },
  {
    "stt": 55,
    "name": "AVEVA",
    "country": "Vương Quốc Anh",
    "city": "Cambridge",
    "flag": "🇬🇧",
    "lat": 52.2053,
    "lng": 0.1218,
    "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
    "url": "https://www.aveva.com/en/",
    "logo": "/partners/55.png"
  },
  {
    "stt": 56,
    "name": "Shenhao",
    "country": "Trung Quốc",
    "city": "Hàng Châu",
    "flag": "🇨🇳",
    "lat": 30.2741,
    "lng": 120.1551,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "https://www.shenhaorobotics.com/",
    "logo": "/partners/56.png"
  },
  {
    "stt": 57,
    "name": "QYSEA",
    "country": "Trung Quốc",
    "city": "Thâm Quyến",
    "flag": "🇨🇳",
    "lat": 22.5431,
    "lng": 114.0579,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "https://www.qysea.com/",
    "logo": "/partners/57.png"
  },
  {
    "stt": 58,
    "name": "Weedoo",
    "country": "Hoa Kỳ",
    "city": "West Palm Beach, FL",
    "flag": "🇺🇸",
    "lat": 26.7153,
    "lng": -80.0534,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "https://weedooboats.com/",
    "logo": "/partners/58.png"
  },
  {
    "stt": 59,
    "name": "Glodon - Magicad",
    "country": "Trung Quốc",
    "city": "Bắc Kinh",
    "flag": "🇨🇳",
    "lat": 39.9042,
    "lng": 116.4074,
    "category": "BIM & Số hóa Kiến trúc",
    "url": "https://asia.glodon.com/magicad",
    "logo": "/partners/59.png"
  },
  {
    "stt": 60,
    "name": "Goslam",
    "country": "Trung Quốc",
    "city": "Thượng Hải",
    "flag": "🇨🇳",
    "lat": 31.2304,
    "lng": 121.4737,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "https://en.goslam.com/",
    "logo": "/partners/60.jpg"
  },
  {
    "stt": 61,
    "name": "AGI",
    "country": "Hoa Kỳ",
    "city": "Austin, TX",
    "flag": "🇺🇸",
    "lat": 30.2672,
    "lng": -97.7431,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "https://www.agiusa.com/",
    "logo": "/partners/AGI-logo.png"
  },
  {
    "stt": 62,
    "name": "IRIS",
    "country": "Pháp",
    "city": "Orléans",
    "flag": "🇫🇷",
    "lat": 47.9029,
    "lng": 1.9093,
    "category": "Giải pháp Chuyển đổi số Kỹ thuật",
    "url": "",
    "logo": "/partners/Picture52.png"
  },
  {
    "stt": 63,
    "name": "Geoscanner",
    "country": "Thụy Điển",
    "city": "Boden",
    "flag": "🇸🇪",
    "lat": 65.8252,
    "lng": 21.6887,
    "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
    "url": "https://www.geoscanners.com/",
    "logo": "/partners/Picture53.png"
  },
  {
    "stt": 64,
    "name": "Geonor",
    "country": "Na Uy",
    "city": "Oslo / Østerås",
    "flag": "🇳🇴",
    "lat": 59.95,
    "lng": 10.5833,
    "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
    "url": "",
    "logo": "/partners/DNV_GL_logo.svg-_1_.png"
  },
  {
    "stt": 65,
    "name": "A.P.Vandenberg",
    "country": "Hà Lan",
    "city": "Heerenveen",
    "flag": "🇳🇱",
    "lat": 52.9563,
    "lng": 5.9281,
    "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
    "url": "",
    "logo": "/partners/Picture52.png"
  },
  {
    "stt": 66,
    "name": "Geotomographie",
    "country": "Đức",
    "city": "Neuwied",
    "flag": "🇩🇪",
    "lat": 50.4287,
    "lng": 7.4613,
    "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
    "url": "https://geotomographie.de/",
    "logo": "/partners/logo-dmt-group-neu.svg"
  },
  {
    "stt": 67,
    "name": "Pasi",
    "country": "Italia",
    "city": "Torino",
    "flag": "🇮🇹",
    "lat": 45.0703,
    "lng": 7.6869,
    "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
    "url": "",
    "logo": "/partners/Picture53.png"
  },
  {
    "stt": 68,
    "name": "DJI, Wingtra",
    "country": "Canada",
    "city": "Ottawa, ON",
    "flag": "🇨🇦",
    "lat": 45.4215,
    "lng": -75.6972,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "https://wingtra.com/dji/",
    "logo": "/partners/flyability_logo_horizontal_color_with_spaces.webp"
  },
  {
    "stt": 69,
    "name": "Pavemetrics",
    "country": "Canada",
    "city": "Quebec City, QC",
    "flag": "🇨🇦",
    "lat": 46.8139,
    "lng": -71.208,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "https://www.pavemetrics.com/",
    "logo": "/partners/Logo_Eddyfi_Pavemetrics.png"
  },
  {
    "stt": 70,
    "name": "FLIR, SONAVU",
    "country": "Canada",
    "city": "Montreal, QC",
    "flag": "🇨🇦",
    "lat": 45.5017,
    "lng": -73.5673,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "https://sonavu.com/",
    "logo": "/partners/SONAVU.png"
  },
  {
    "stt": 71,
    "name": "LIDARUSA, GVI, PHOENIX LIDAR",
    "country": "Hoa Kỳ",
    "city": "Austin, TX",
    "flag": "🇺🇸",
    "lat": 30.2672,
    "lng": -97.7431,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "https://phoenixlidar.com/",
    "logo": "/partners/PHOENIX LIDAR.svg"
  },
  {
    "stt": 73,
    "name": "EDC HVE",
    "country": "Hoa Kỳ",
    "city": "Beaverton, OR",
    "flag": "🇺🇸",
    "lat": 45.4871,
    "lng": -122.8037,
    "category": "Giải pháp Chuyển đổi số Kỹ thuật",
    "url": "https://edccorp.com/index.php/hve-software/hve",
    "logo": "/partners/Picture52.png"
  },
  {
    "stt": 74,
    "name": "MAAP & iMAAP",
    "country": "Vương Quốc Anh",
    "city": "Crowthorne",
    "flag": "🇬🇧",
    "lat": 51.3708,
    "lng": -0.7937,
    "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
    "url": "https://trlsoftware.com/software/crash-data-analysis/imaap/",
    "logo": "/partners/metsims-logo-148 (1).png"
  },
  {
    "stt": 75,
    "name": "Lander Simulation",
    "country": "Tây Ban Nha",
    "city": "San Sebastián",
    "flag": "🇪🇸",
    "lat": 43.3183,
    "lng": -1.9812,
    "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
    "url": "https://www.landersimulation.com/en",
    "logo": "/partners/Picture52.png"
  },
  {
    "stt": 76,
    "name": "Geotechnical",
    "country": "Vương Quốc Anh",
    "city": "Coventry",
    "flag": "🇬🇧",
    "lat": 52.4068,
    "lng": -1.5197,
    "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
    "url": "",
    "logo": "/partners/Picture53.png"
  },
  {
    "stt": 77,
    "name": "Foxit",
    "country": "Hoa Kỳ",
    "city": "Fremont, CA",
    "flag": "🇺🇸",
    "lat": 37.5485,
    "lng": -121.9886,
    "category": "Giải pháp Chuyển đổi số Kỹ thuật",
    "url": "https://www.foxit.com/pdf-reader/",
    "logo": "/partners/new-foxit-logo.png"
  },
  {
    "stt": 78,
    "name": "Autodesk",
    "country": "Hoa Kỳ",
    "city": "San Francisco, CA",
    "flag": "🇺🇸",
    "lat": 37.7749,
    "lng": -122.4194,
    "category": "BIM & Số hóa Kiến trúc",
    "url": "https://www.autodesk.com/",
    "logo": "/partners/Autodesk_Logo_2021.svg.png"
  },
  {
    "stt": 79,
    "name": "BIMAGE",
    "country": "Singapore",
    "city": "Singapore",
    "flag": "🇸🇬",
    "lat": 1.3521,
    "lng": 103.8198,
    "category": "BIM & Số hóa Kiến trúc",
    "url": "",
    "logo": "/partners/BIMAGE"
  }
];

export const countryNodes: CountryNode[] = [
  {
    "country": "Đức",
    "flag": "🇩🇪",
    "lat": 49.9767,
    "lng": 9.1481,
    "partners": [
      {
        "stt": 1,
        "name": "PYTHA Lab",
        "country": "Đức",
        "city": "Aschaffenburg",
        "flag": "🇩🇪",
        "lat": 49.9767,
        "lng": 9.1481,
        "category": "Phần mềm Kết cấu & Cơ khí",
        "url": "https://www.pytha.com/",
        "logo": "/partners/1.png"
      },
      {
        "stt": 27,
        "name": "Allplan",
        "country": "Đức",
        "city": "Munich",
        "flag": "🇩🇪",
        "lat": 48.1351,
        "lng": 11.582,
        "category": "BIM & Số hóa Kiến trúc",
        "url": "https://www.allplan.com/index.php?id=13001",
        "logo": "/partners/27.png"
      },
      {
        "stt": 37,
        "name": "PTV",
        "country": "Đức",
        "city": "Karlsruhe",
        "flag": "🇩🇪",
        "lat": 49.0069,
        "lng": 8.4037,
        "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
        "url": "https://www.ptvgroup.com/en",
        "logo": "/partners/37.png"
      },
      {
        "stt": 48,
        "name": "Schuller",
        "country": "Đức",
        "city": "Bochum",
        "flag": "🇩🇪",
        "lat": 51.4818,
        "lng": 7.2162,
        "category": "Phần mềm Kết cấu & Cơ khí",
        "url": "https://www.schullerco.com/sc-bocad",
        "logo": "/partners/48.png"
      },
      {
        "stt": 51,
        "name": "DMT",
        "country": "Đức",
        "city": "Essen",
        "flag": "🇩🇪",
        "lat": 51.4556,
        "lng": 7.0116,
        "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
        "url": "https://www.dmt-group.com/",
        "logo": "/partners/51.png"
      },
      {
        "stt": 66,
        "name": "Geotomographie",
        "country": "Đức",
        "city": "Neuwied",
        "flag": "🇩🇪",
        "lat": 50.4287,
        "lng": 7.4613,
        "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
        "url": "https://geotomographie.de/",
        "logo": "/partners/logo-dmt-group-neu.svg"
      }
    ]
  },
  {
    "country": "Italia",
    "flag": "🇮🇹",
    "lat": 45.9567,
    "lng": 12.6605,
    "partners": [
      {
        "stt": 2,
        "name": "Opera Software Company Inc",
        "country": "Italia",
        "city": "Pordenone",
        "flag": "🇮🇹",
        "lat": 45.9567,
        "lng": 12.6605,
        "category": "BIM & Số hóa Kiến trúc",
        "url": "https://www.operacompany.com/",
        "logo": "/partners/2.png"
      },
      {
        "stt": 4,
        "name": "Emmegi",
        "country": "Italia",
        "city": "Modena",
        "flag": "🇮🇹",
        "lat": 44.7378,
        "lng": 10.9272,
        "category": "BIM & Số hóa Kiến trúc",
        "url": "https://www.emmegi.com/en/home",
        "logo": "/partners/4.png"
      },
      {
        "stt": 67,
        "name": "Pasi",
        "country": "Italia",
        "city": "Torino",
        "flag": "🇮🇹",
        "lat": 45.0703,
        "lng": 7.6869,
        "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
        "url": "",
        "logo": "/partners/Picture53.png"
      }
    ]
  },
  {
    "country": "Hoa Kỳ",
    "flag": "🇺🇸",
    "lat": 39.3601,
    "lng": -84.3099,
    "partners": [
      {
        "stt": 3,
        "name": "Lantek",
        "country": "Hoa Kỳ",
        "city": "Mason, OH",
        "flag": "🇺🇸",
        "lat": 39.3601,
        "lng": -84.3099,
        "category": "Phần mềm Kết cấu & Cơ khí",
        "url": "https://www.lantek.com/us",
        "logo": "/partners/3.png"
      },
      {
        "stt": 5,
        "name": "Roomvo",
        "country": "Hoa Kỳ",
        "city": "Toronto / US East",
        "flag": "🇺🇸",
        "lat": 43.6532,
        "lng": -79.3832,
        "category": "BIM & Số hóa Kiến trúc",
        "url": "https://get.roomvo.com/",
        "logo": "/partners/5.png"
      },
      {
        "stt": 18,
        "name": "STX",
        "country": "Hoa Kỳ",
        "city": "New York, NY",
        "flag": "🇺🇸",
        "lat": 40.7128,
        "lng": -74.006,
        "category": "Phần mềm Kết cấu & Cơ khí",
        "url": "https://stxgroup.com/",
        "logo": "/partners/18.png"
      },
      {
        "stt": 20,
        "name": "CSI",
        "country": "Hoa Kỳ",
        "city": "Berkeley, CA",
        "flag": "🇺🇸",
        "lat": 37.8715,
        "lng": -122.273,
        "category": "Phần mềm Kết cấu & Cơ khí",
        "url": "https://www.csiamerica.com/",
        "logo": "/partners/63.CSI.png"
      },
      {
        "stt": 22,
        "name": "Bentley system",
        "country": "Hoa Kỳ",
        "city": "Exton, PA",
        "flag": "🇺🇸",
        "lat": 40.0326,
        "lng": -75.6174,
        "category": "BIM & Số hóa Kiến trúc",
        "url": "https://www.bentley.com/",
        "logo": "/partners/BentleyLOGO_BLK_complete.png"
      },
      {
        "stt": 24,
        "name": "RISA",
        "country": "Hoa Kỳ",
        "city": "Foothill Ranch, CA",
        "flag": "🇺🇸",
        "lat": 33.6708,
        "lng": -117.6631,
        "category": "Phần mềm Kết cấu & Cơ khí",
        "url": "",
        "logo": "/partners/24.png"
      },
      {
        "stt": 34,
        "name": "Thermoflow",
        "country": "Hoa Kỳ",
        "city": "Jacksonville, FL",
        "flag": "🇺🇸",
        "lat": 30.3322,
        "lng": -81.6557,
        "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
        "url": "https://www.thermoflow.com/",
        "logo": "/partners/34.png"
      },
      {
        "stt": 42,
        "name": "Kritikal",
        "country": "Hoa Kỳ",
        "city": "San Jose, CA",
        "flag": "🇺🇸",
        "lat": 37.3382,
        "lng": -121.8863,
        "category": "Giải pháp Chuyển đổi số Kỹ thuật",
        "url": "https://kritikalsolutions.com/",
        "logo": "/partners/42.png"
      },
      {
        "stt": 43,
        "name": "Sunrise Systems",
        "country": "Hoa Kỳ",
        "city": "Sugar Land, TX",
        "flag": "🇺🇸",
        "lat": 29.6197,
        "lng": -95.6349,
        "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
        "url": "https://www.sunrisesys.com/",
        "logo": "/partners/43.png"
      },
      {
        "stt": 44,
        "name": "SoftInWay",
        "country": "Hoa Kỳ",
        "city": "Burlington, MA",
        "flag": "🇺🇸",
        "lat": 42.5048,
        "lng": -71.1956,
        "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
        "url": "https://www.softinway.com/",
        "logo": "/partners/44.png"
      },
      {
        "stt": 46,
        "name": "HTRI",
        "country": "Hoa Kỳ",
        "city": "Navasota, TX",
        "flag": "🇺🇸",
        "lat": 30.3877,
        "lng": -96.0877,
        "category": "Giải pháp Chuyển đổi số Kỹ thuật",
        "url": "https://www.htri.net/",
        "logo": "/partners/64.HTRI-transparent-v.png"
      },
      {
        "stt": 54,
        "name": "ANSYS",
        "country": "Hoa Kỳ",
        "city": "Canonsburg, PA",
        "flag": "🇺🇸",
        "lat": 40.2592,
        "lng": -80.1873,
        "category": "Phần mềm Kết cấu & Cơ khí",
        "url": "https://ansys.synopsys.com/",
        "logo": "/partners/54.png"
      },
      {
        "stt": 58,
        "name": "Weedoo",
        "country": "Hoa Kỳ",
        "city": "West Palm Beach, FL",
        "flag": "🇺🇸",
        "lat": 26.7153,
        "lng": -80.0534,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "https://weedooboats.com/",
        "logo": "/partners/58.png"
      },
      {
        "stt": 61,
        "name": "AGI",
        "country": "Hoa Kỳ",
        "city": "Austin, TX",
        "flag": "🇺🇸",
        "lat": 30.2672,
        "lng": -97.7431,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "https://www.agiusa.com/",
        "logo": "/partners/AGI-logo.png"
      },
      {
        "stt": 71,
        "name": "LIDARUSA, GVI, PHOENIX LIDAR",
        "country": "Hoa Kỳ",
        "city": "Austin, TX",
        "flag": "🇺🇸",
        "lat": 30.2672,
        "lng": -97.7431,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "https://phoenixlidar.com/",
        "logo": "/partners/PHOENIX LIDAR.svg"
      },
      {
        "stt": 73,
        "name": "EDC HVE",
        "country": "Hoa Kỳ",
        "city": "Beaverton, OR",
        "flag": "🇺🇸",
        "lat": 45.4871,
        "lng": -122.8037,
        "category": "Giải pháp Chuyển đổi số Kỹ thuật",
        "url": "https://edccorp.com/index.php/hve-software/hve",
        "logo": "/partners/Picture52.png"
      },
      {
        "stt": 77,
        "name": "Foxit",
        "country": "Hoa Kỳ",
        "city": "Fremont, CA",
        "flag": "🇺🇸",
        "lat": 37.5485,
        "lng": -121.9886,
        "category": "Giải pháp Chuyển đổi số Kỹ thuật",
        "url": "https://www.foxit.com/pdf-reader/",
        "logo": "/partners/new-foxit-logo.png"
      },
      {
        "stt": 78,
        "name": "Autodesk",
        "country": "Hoa Kỳ",
        "city": "San Francisco, CA",
        "flag": "🇺🇸",
        "lat": 37.7749,
        "lng": -122.4194,
        "category": "BIM & Số hóa Kiến trúc",
        "url": "https://www.autodesk.com/",
        "logo": "/partners/Autodesk_Logo_2021.svg.png"
      }
    ]
  },
  {
    "country": "Canada",
    "flag": "🇨🇦",
    "lat": 51.0447,
    "lng": -114.0719,
    "partners": [
      {
        "stt": 6,
        "name": "Seequent - Bentley System",
        "country": "Canada",
        "city": "Calgary / Vancouver",
        "flag": "🇨🇦",
        "lat": 51.0447,
        "lng": -114.0719,
        "category": "BIM & Số hóa Kiến trúc",
        "url": "https://www.seequent.com/",
        "logo": "/partners/logo_seequent.png"
      },
      {
        "stt": 30,
        "name": "Rocscience",
        "country": "Canada",
        "city": "Toronto, ON",
        "flag": "🇨🇦",
        "lat": 43.6532,
        "lng": -79.3832,
        "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
        "url": "https://www.rocscience.com/",
        "logo": "/partners/rocscience-logo-primary-for-website2.png"
      },
      {
        "stt": 68,
        "name": "DJI, Wingtra",
        "country": "Canada",
        "city": "Ottawa, ON",
        "flag": "🇨🇦",
        "lat": 45.4215,
        "lng": -75.6972,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "https://wingtra.com/dji/",
        "logo": "/partners/flyability_logo_horizontal_color_with_spaces.webp"
      },
      {
        "stt": 69,
        "name": "Pavemetrics",
        "country": "Canada",
        "city": "Quebec City, QC",
        "flag": "🇨🇦",
        "lat": 46.8139,
        "lng": -71.208,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "https://www.pavemetrics.com/",
        "logo": "/partners/Logo_Eddyfi_Pavemetrics.png"
      },
      {
        "stt": 70,
        "name": "FLIR, SONAVU",
        "country": "Canada",
        "city": "Montreal, QC",
        "flag": "🇨🇦",
        "lat": 45.5017,
        "lng": -73.5673,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "https://sonavu.com/",
        "logo": "/partners/SONAVU.png"
      }
    ]
  },
  {
    "country": "Australia",
    "flag": "🇦🇺",
    "lat": -34.9285,
    "lng": 138.6007,
    "partners": [
      {
        "stt": 7,
        "name": "Maptek",
        "country": "Australia",
        "city": "Adelaide",
        "flag": "🇦🇺",
        "lat": -34.9285,
        "lng": 138.6007,
        "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
        "url": "https://www.maptek.com/",
        "logo": "/partners/7.png"
      },
      {
        "stt": 8,
        "name": "Deswik",
        "country": "Australia",
        "city": "Brisbane",
        "flag": "🇦🇺",
        "lat": -27.4698,
        "lng": 153.0251,
        "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
        "url": "https://www.deswik.com/",
        "logo": "/partners/6763e884c6186cfbb7d64c14_Deswik Logo Blue CMYK.png"
      },
      {
        "stt": 12,
        "name": "Metron",
        "country": "Australia",
        "city": "Sydney",
        "flag": "🇦🇺",
        "lat": -33.8688,
        "lng": 151.2093,
        "category": "Net Zero & Phát triển Bền vững",
        "url": "https://www.metron.energy/",
        "logo": "/partners/12.png"
      },
      {
        "stt": 14,
        "name": "Rock Mapper",
        "country": "Australia",
        "city": "Perth",
        "flag": "🇦🇺",
        "lat": -31.9505,
        "lng": 115.8605,
        "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
        "url": "https://www.rockmapper.net/",
        "logo": "/partners/14.jpg"
      }
    ]
  },
  {
    "country": "Vương Quốc Anh",
    "flag": "🇬🇧",
    "lat": 51.5074,
    "lng": -0.1278,
    "partners": [
      {
        "stt": 9,
        "name": "Metsims",
        "country": "Vương Quốc Anh",
        "city": "London / Oxford",
        "flag": "🇬🇧",
        "lat": 51.5074,
        "lng": -0.1278,
        "category": "Net Zero & Phát triển Bền vững",
        "url": "https://metsims.com/",
        "logo": "/partners/9.png"
      },
      {
        "stt": 11,
        "name": "Gigaton",
        "country": "Vương Quốc Anh",
        "city": "London",
        "flag": "🇬🇧",
        "lat": 51.5074,
        "lng": -0.1278,
        "category": "Net Zero & Phát triển Bền vững",
        "url": "https://gigaton.co/",
        "logo": "/partners/11.png"
      },
      {
        "stt": 13,
        "name": "EcoAct",
        "country": "Vương Quốc Anh",
        "city": "London",
        "flag": "🇬🇧",
        "lat": 51.5074,
        "lng": -0.1278,
        "category": "Net Zero & Phát triển Bền vững",
        "url": "https://eco-act.com/",
        "logo": "/partners/EcoAct.png"
      },
      {
        "stt": 38,
        "name": "RPS",
        "country": "Vương Quốc Anh",
        "city": "Abingdon",
        "flag": "🇬🇧",
        "lat": 51.6708,
        "lng": -1.2828,
        "category": "Giải pháp Chuyển đổi số Kỹ thuật",
        "url": "",
        "logo": "/partners/38.png"
      },
      {
        "stt": 40,
        "name": "Zx Lidar",
        "country": "Vương Quốc Anh",
        "city": "Ledbury",
        "flag": "🇬🇧",
        "lat": 52.0368,
        "lng": -2.4289,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "https://www.zxlidars.com/",
        "logo": "/partners/40.png"
      },
      {
        "stt": 45,
        "name": "TRL",
        "country": "Vương Quốc Anh",
        "city": "Crowthorne",
        "flag": "🇬🇧",
        "lat": 51.3708,
        "lng": -0.7937,
        "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
        "url": "https://www.trl.co.uk/",
        "logo": "/partners/45.png"
      },
      {
        "stt": 53,
        "name": "Radio Detection - SPX",
        "country": "Vương Quốc Anh",
        "city": "Bristol",
        "flag": "🇬🇧",
        "lat": 51.4545,
        "lng": -2.5879,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "https://spx.com/our-businesses/radiodetection/",
        "logo": "/partners/53.png"
      },
      {
        "stt": 55,
        "name": "AVEVA",
        "country": "Vương Quốc Anh",
        "city": "Cambridge",
        "flag": "🇬🇧",
        "lat": 52.2053,
        "lng": 0.1218,
        "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
        "url": "https://www.aveva.com/en/",
        "logo": "/partners/55.png"
      },
      {
        "stt": 74,
        "name": "MAAP & iMAAP",
        "country": "Vương Quốc Anh",
        "city": "Crowthorne",
        "flag": "🇬🇧",
        "lat": 51.3708,
        "lng": -0.7937,
        "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
        "url": "https://trlsoftware.com/software/crash-data-analysis/imaap/",
        "logo": "/partners/metsims-logo-148 (1).png"
      },
      {
        "stt": 76,
        "name": "Geotechnical",
        "country": "Vương Quốc Anh",
        "city": "Coventry",
        "flag": "🇬🇧",
        "lat": 52.4068,
        "lng": -1.5197,
        "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
        "url": "",
        "logo": "/partners/Picture53.png"
      }
    ]
  },
  {
    "country": "Hà Lan",
    "flag": "🇳🇱",
    "lat": 52.1561,
    "lng": 5.3878,
    "partners": [
      {
        "stt": 10,
        "name": "PRé Sustainability",
        "country": "Hà Lan",
        "city": "Amersfoort",
        "flag": "🇳🇱",
        "lat": 52.1561,
        "lng": 5.3878,
        "category": "Net Zero & Phát triển Bền vững",
        "url": "https://pre-sustainability.com/",
        "logo": "/partners/10.png"
      },
      {
        "stt": 31,
        "name": "Deltares",
        "country": "Hà Lan",
        "city": "Delft",
        "flag": "🇳🇱",
        "lat": 52.0116,
        "lng": 4.3571,
        "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
        "url": "https://www.deltares.nl/en",
        "logo": "/partners/31.png"
      },
      {
        "stt": 32,
        "name": "MARIN",
        "country": "Hà Lan",
        "city": "Wageningen",
        "flag": "🇳🇱",
        "lat": 51.9692,
        "lng": 5.6654,
        "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
        "url": "",
        "logo": "/partners/32.png"
      },
      {
        "stt": 49,
        "name": "Sewer Robotics",
        "country": "Hà Lan",
        "city": "Zevenbergen",
        "flag": "🇳🇱",
        "lat": 51.6456,
        "lng": 4.6006,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "",
        "logo": "/partners/49.png"
      },
      {
        "stt": 65,
        "name": "A.P.Vandenberg",
        "country": "Hà Lan",
        "city": "Heerenveen",
        "flag": "🇳🇱",
        "lat": 52.9563,
        "lng": 5.9281,
        "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
        "url": "",
        "logo": "/partners/Picture52.png"
      }
    ]
  },
  {
    "country": "Thụy Sĩ",
    "flag": "🇨🇭",
    "lat": 46.5197,
    "lng": 6.6323,
    "partners": [
      {
        "stt": 15,
        "name": "Flyability",
        "country": "Thụy Sĩ",
        "city": "Lausanne",
        "flag": "🇨🇭",
        "lat": 46.5197,
        "lng": 6.6323,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "https://www.flyability.com/",
        "logo": "/partners/15.png"
      },
      {
        "stt": 50,
        "name": "Geosig",
        "country": "Thụy Sĩ",
        "city": "Zurich",
        "flag": "🇨🇭",
        "lat": 47.3962,
        "lng": 8.4475,
        "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
        "url": "https://www.geosig.com/",
        "logo": "/partners/50.png"
      }
    ]
  },
  {
    "country": "Thổ Nhĩ Kỳ",
    "flag": "🇹🇷",
    "lat": 41.0082,
    "lng": 28.9784,
    "partners": [
      {
        "stt": 16,
        "name": "Turkeco",
        "country": "Thổ Nhĩ Kỳ",
        "city": "Istanbul",
        "flag": "🇹🇷",
        "lat": 41.0082,
        "lng": 28.9784,
        "category": "Net Zero & Phát triển Bền vững",
        "url": "https://turkeco.com/en/",
        "logo": "/partners/16.png"
      },
      {
        "stt": 17,
        "name": "Erke Tasarim",
        "country": "Thổ Nhĩ Kỳ",
        "city": "Istanbul",
        "flag": "🇹🇷",
        "lat": 41.0082,
        "lng": 28.9784,
        "category": "Net Zero & Phát triển Bền vững",
        "url": "https://erketasarim.com/en",
        "logo": "/partners/17.png"
      }
    ]
  },
  {
    "country": "Hàn Quốc",
    "flag": "🇰🇷",
    "lat": 37.5665,
    "lng": 126.978,
    "partners": [
      {
        "stt": 19,
        "name": "Instral",
        "country": "Hàn Quốc",
        "city": "Seoul",
        "flag": "🇰🇷",
        "lat": 37.5665,
        "lng": 126.978,
        "category": "Giải pháp Chuyển đổi số Kỹ thuật",
        "url": "",
        "logo": "/partners/19.png"
      },
      {
        "stt": 29,
        "name": "MIDAS",
        "country": "Hàn Quốc",
        "city": "Seoul / Seongnam",
        "flag": "🇰🇷",
        "lat": 37.3827,
        "lng": 127.1189,
        "category": "Phần mềm Kết cấu & Cơ khí",
        "url": "https://www.midasuser.com/en",
        "logo": "/partners/29.png"
      }
    ]
  },
  {
    "country": "Trung Quốc",
    "flag": "🇨🇳",
    "lat": 39.9042,
    "lng": 116.4074,
    "partners": [
      {
        "stt": 23,
        "name": "Gstarsoft",
        "country": "Trung Quốc",
        "city": "Bắc Kinh / Tô Châu",
        "flag": "🇨🇳",
        "lat": 39.9042,
        "lng": 116.4074,
        "category": "Phần mềm Kết cấu & Cơ khí",
        "url": "https://www.gstarcad.net/",
        "logo": "/partners/23.png"
      },
      {
        "stt": 26,
        "name": "Glodon - Cubicost",
        "country": "Trung Quốc",
        "city": "Bắc Kinh",
        "flag": "🇨🇳",
        "lat": 39.9042,
        "lng": 116.4074,
        "category": "BIM & Số hóa Kiến trúc",
        "url": "https://asia.glodon.com/cubicost",
        "logo": "/partners/26.png"
      },
      {
        "stt": 56,
        "name": "Shenhao",
        "country": "Trung Quốc",
        "city": "Hàng Châu",
        "flag": "🇨🇳",
        "lat": 30.2741,
        "lng": 120.1551,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "https://www.shenhaorobotics.com/",
        "logo": "/partners/56.png"
      },
      {
        "stt": 57,
        "name": "QYSEA",
        "country": "Trung Quốc",
        "city": "Thâm Quyến",
        "flag": "🇨🇳",
        "lat": 22.5431,
        "lng": 114.0579,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "https://www.qysea.com/",
        "logo": "/partners/57.png"
      },
      {
        "stt": 59,
        "name": "Glodon - Magicad",
        "country": "Trung Quốc",
        "city": "Bắc Kinh",
        "flag": "🇨🇳",
        "lat": 39.9042,
        "lng": 116.4074,
        "category": "BIM & Số hóa Kiến trúc",
        "url": "https://asia.glodon.com/magicad",
        "logo": "/partners/59.png"
      },
      {
        "stt": 60,
        "name": "Goslam",
        "country": "Trung Quốc",
        "city": "Thượng Hải",
        "flag": "🇨🇳",
        "lat": 31.2304,
        "lng": 121.4737,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "https://en.goslam.com/",
        "logo": "/partners/60.jpg"
      }
    ]
  },
  {
    "country": "Ireland",
    "flag": "🇮🇪",
    "lat": 53.3498,
    "lng": -6.2603,
    "partners": [
      {
        "stt": 25,
        "name": "Prokon",
        "country": "Ireland",
        "city": "Dublin",
        "flag": "🇮🇪",
        "lat": 53.3498,
        "lng": -6.2603,
        "category": "Phần mềm Kết cấu & Cơ khí",
        "url": "https://prokon.com/",
        "logo": "/partners/25.png"
      }
    ]
  },
  {
    "country": "Séc",
    "flag": "🇨🇿",
    "lat": 49.1951,
    "lng": 16.6068,
    "partners": [
      {
        "stt": 28,
        "name": "IDEA Statica",
        "country": "Séc",
        "city": "Brno",
        "flag": "🇨🇿",
        "lat": 49.1951,
        "lng": 16.6068,
        "category": "Phần mềm Kết cấu & Cơ khí",
        "url": "https://www.ideastatica.com/vi",
        "logo": "/partners/28.png"
      }
    ]
  },
  {
    "country": "Pháp",
    "flag": "🇫🇷",
    "lat": 48.7547,
    "lng": 2.2158,
    "partners": [
      {
        "stt": 33,
        "name": "Graitec",
        "country": "Pháp",
        "city": "Paris / Bièvres",
        "flag": "🇫🇷",
        "lat": 48.7547,
        "lng": 2.2158,
        "category": "Phần mềm Kết cấu & Cơ khí",
        "url": "https://graitec.com/uk/",
        "logo": "/partners/33.png"
      },
      {
        "stt": 62,
        "name": "IRIS",
        "country": "Pháp",
        "city": "Orléans",
        "flag": "🇫🇷",
        "lat": 47.9029,
        "lng": 1.9093,
        "category": "Giải pháp Chuyển đổi số Kỹ thuật",
        "url": "",
        "logo": "/partners/Picture52.png"
      }
    ]
  },
  {
    "country": "Thụy Điển",
    "flag": "🇸🇪",
    "lat": 59.3293,
    "lng": 18.0686,
    "partners": [
      {
        "stt": 35,
        "name": "Hexagon",
        "country": "Thụy Điển",
        "city": "Stockholm",
        "flag": "🇸🇪",
        "lat": 59.3293,
        "lng": 18.0686,
        "category": "Giải pháp Chuyển đổi số Kỹ thuật",
        "url": "https://hexagon.com/",
        "logo": "/partners/61.Hexagon_Signage_Standard_PMS_Logo.png"
      },
      {
        "stt": 41,
        "name": "AQS",
        "country": "Thụy Điển",
        "city": "Motala",
        "flag": "🇸🇪",
        "lat": 58.5371,
        "lng": 15.0365,
        "category": "Giải pháp Chuyển đổi số Kỹ thuật",
        "url": "",
        "logo": "/partners/aqsystem.png"
      },
      {
        "stt": 63,
        "name": "Geoscanner",
        "country": "Thụy Điển",
        "city": "Boden",
        "flag": "🇸🇪",
        "lat": 65.8252,
        "lng": 21.6887,
        "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
        "url": "https://www.geoscanners.com/",
        "logo": "/partners/Picture53.png"
      }
    ]
  },
  {
    "country": "Tây Ban Nha",
    "flag": "🇪🇸",
    "lat": 38.3452,
    "lng": -0.481,
    "partners": [
      {
        "stt": 36,
        "name": "Cype",
        "country": "Tây Ban Nha",
        "city": "Alicante",
        "flag": "🇪🇸",
        "lat": 38.3452,
        "lng": -0.481,
        "category": "Phần mềm Kết cấu & Cơ khí",
        "url": "https://info.cype.com/en/",
        "logo": "/partners/36.png"
      },
      {
        "stt": 75,
        "name": "Lander Simulation",
        "country": "Tây Ban Nha",
        "city": "San Sebastián",
        "flag": "🇪🇸",
        "lat": 43.3183,
        "lng": -1.9812,
        "category": "Thiết bị Đo đạc, Robot ngầm & Drone",
        "url": "https://www.landersimulation.com/en",
        "logo": "/partners/Picture52.png"
      }
    ]
  },
  {
    "country": "Israel",
    "flag": "🇮🇱",
    "lat": 32.175,
    "lng": 34.9069,
    "partners": [
      {
        "stt": 39,
        "name": "Piletest",
        "country": "Israel",
        "city": "Tel Aviv",
        "flag": "🇮🇱",
        "lat": 32.175,
        "lng": 34.9069,
        "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
        "url": "https://www.piletest.com/",
        "logo": "/partners/39.png"
      }
    ]
  },
  {
    "country": "Đan Mạch",
    "flag": "🇩🇰",
    "lat": 55.8833,
    "lng": 12.5,
    "partners": [
      {
        "stt": 47,
        "name": "DHI",
        "country": "Đan Mạch",
        "city": "Copenhagen",
        "flag": "🇩🇰",
        "lat": 55.8833,
        "lng": 12.5,
        "category": "Mô phỏng Giao thông, Thủy lợi & Môi trường",
        "url": "https://www.dhigroup.com/",
        "logo": "/partners/47.png"
      }
    ]
  },
  {
    "country": "Na Uy",
    "flag": "🇳🇴",
    "lat": 59.9,
    "lng": 10.5833,
    "partners": [
      {
        "stt": 52,
        "name": "DNV",
        "country": "Na Uy",
        "city": "Oslo / Høvik",
        "flag": "🇳🇴",
        "lat": 59.9,
        "lng": 10.5833,
        "category": "Giải pháp Chuyển đổi số Kỹ thuật",
        "url": "https://www.dnv.com/",
        "logo": "/partners/52.png"
      },
      {
        "stt": 64,
        "name": "Geonor",
        "country": "Na Uy",
        "city": "Oslo / Østerås",
        "flag": "🇳🇴",
        "lat": 59.95,
        "lng": 10.5833,
        "category": "Địa kỹ thuật, Khai khoáng & Địa chấn",
        "url": "",
        "logo": "/partners/DNV_GL_logo.svg-_1_.png"
      }
    ]
  },
  {
    "country": "Singapore",
    "flag": "🇸🇬",
    "lat": 1.3521,
    "lng": 103.8198,
    "partners": [
      {
        "stt": 79,
        "name": "BIMAGE",
        "country": "Singapore",
        "city": "Singapore",
        "flag": "🇸🇬",
        "lat": 1.3521,
        "lng": 103.8198,
        "category": "BIM & Số hóa Kiến trúc",
        "url": "",
        "logo": "/partners/BIMAGE"
      }
    ]
  }
];
