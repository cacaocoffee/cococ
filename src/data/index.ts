import type { ArchiveItem } from '@/domain/archive/archive-dto';
import type { MagazineItem } from '@/domain/magazine/magazine-dto';

export interface FaqItem {
  q: string;
  a: string;
}

export const ARCHIVE_DATA: ArchiveItem[] = [
  {
    id: 1,
    year: "2024",
    category: "정기 클래스",
    title: "클래식 칵테일 마스터리",
    date: "2024.03.15",
    base: "Gin",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    participants: 18,
    location: "신촌 Bar Lune",
    description: "진(Gin)을 베이스로 한 클래식 칵테일들을 직접 제조하는 마스터리 클래스입니다. 네그로니, 마티니, 에비에이션 등 진의 역사와 함께 각 레시피의 균형을 탐구했습니다.",
    tags: ["Gin", "Classic", "Masterclass"],
    gallery: [
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800",
    ],
    recipes: [
      { name: "Negroni", ingredients: "Gin 30ml · Campari 30ml · Sweet Vermouth 30ml", img: "https://images.unsplash.com/photo-1614313512903-5e3e9be40dc4?auto=format&fit=crop&q=80&w=800" },
      { name: "Dry Martini", ingredients: "Gin 60ml · Dry Vermouth 10ml · Orange Bitters", img: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=800" },
      { name: "Aviation", ingredients: "Gin 45ml · Maraschino 15ml · Crème de Violette 7.5ml", img: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&q=80&w=800" },
    ],
    content: [],
  },
  {
    id: 2,
    year: "2024",
    category: "외부 협업",
    title: "성수 팝업 게스트 바텐딩",
    date: "2024.04.10",
    base: "Whiskey",
    img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
    participants: 8,
    location: "성수 Craft Bar Seoul",
    description: "성수동의 유명 크래프트 바에서 코콕 멤버들이 직접 게스트 바텐더로 참여한 특별한 협업 이벤트입니다. 위스키 하이볼 시리즈를 주제로 30여 명의 방문객들과 함께했습니다.",
    tags: ["Whiskey", "Collab", "Popup"],
    gallery: [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1527281405159-35d5b9a1650c?auto=format&fit=crop&q=80&w=800",
    ],
    recipes: [
      { name: "Smoky Highball", ingredients: "Scotch 45ml · Soda Water 120ml · Lemon Peel", img: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80&w=800" },
      { name: "Honey Bourbon Fizz", ingredients: "Bourbon 45ml · Honey Syrup 15ml · Lemon 20ml · Soda", img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800" },
    ],
    content: [],
  },
  {
    id: 3,
    year: "2023",
    category: "MT/파티",
    title: "COCOC 연말 네트워킹 파티",
    date: "2023.12.20",
    base: "Various",
    img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800",
    participants: 42,
    location: "강남 Private Venue",
    description: "2023년을 마무리하는 코콕의 연말 네트워킹 파티입니다. 멤버들이 직접 개발한 시그니처 칵테일을 선보이고, 주류 업계 관계자들과의 네트워킹 시간을 가졌습니다.",
    tags: ["Party", "Networking", "Signature"],
    gallery: [
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800",
    ],
    recipes: [],
    content: [],
  },
  {
    id: 4,
    year: "2023",
    category: "정기 클래스",
    title: "티 칵테일 오마카세",
    date: "2023.11.05",
    base: "Vodka",
    img: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800",
    participants: 14,
    location: "용산 ",
    description: "차(茶) 문화와 칵테일을 접목한 실험적인 오마카세 클래스입니다. 얼그레이, 말차, 우롱차 등 다양한 티 베이스 인퓨전 보드카를 직접 제조하고 페어링을 탐구했습니다.",
    tags: ["Tea", "Infusion", "Omakase"],
    gallery: [
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=800",
    ],
    recipes: [
      { name: "Earl Grey Martini", ingredients: "Earl Grey Vodka 50ml · Lemon 20ml · Simple Syrup 10ml", img: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=800" },
      { name: "Matcha Mule", ingredients: "Matcha Vodka 45ml · Ginger Beer 100ml · Lime 15ml", img: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800" },
    ],
    content: [],
  },
  {
    id: 5,
    year: "2024",
    category: "MT/파티",
    title: "신입 OT 환영 파티",
    date: "2024.03.01",
    base: "Various",
    img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800",
    participants: 30,
    location: "신촌",
    description: "2024년 신입 멤버들을 환영하는 OT 파티입니다. 코콕의 활동 소개와 함께 다양한 논알콜·저도수 음료 스테이션을 운영하며 멤버 간 친목을 다졌습니다.",
    tags: ["OT", "Welcome", "Party"],
    gallery: [
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
    ],
    recipes: [],
    content: [],
  },
  {
    id: 6,
    year: "2023",
    category: "외부 협업",
    title: "홍대 팝업 칵테일 바",
    date: "2023.10.15",
    base: "Rum",
    img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
    participants: 10,
    location: "홍대 팝업 스페이스",
    description: "럼 베이스 트로피칼 칵테일을 테마로 홍대에서 주말 이틀간 운영한 팝업 바입니다. 코콕 멤버 전원이 역할을 분담하여 기획부터 운영까지 직접 진행했습니다.",
    tags: ["Rum", "Tropical", "Popup"],
    gallery: [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800",
    ],
    recipes: [
      { name: "Jungle Bird", ingredients: "Rum 45ml · Campari 15ml · Pineapple 45ml · Lime 15ml", img: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&q=80&w=800" },
      { name: "Painkiller", ingredients: "Rum 60ml · Pineapple 120ml · OJ 30ml · Cream of Coconut 30ml", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" },
    ],
    content: [],
  },
  {
    id: 7,
    year: "2025",
    category: "정기 클래스",
    title: "Blackthorn 클래스",
    date: "2025.00.00",
    base: "Sloe Gin",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    participants: 0,
    location: "",
    description: "1900년대 해리 존슨의 저서에 처음 등장한 동음의 칵테일(BLACK THORN)과는 다른 레시피의 칵테일로, 1930년대 윌리엄 부스비의 저서에 처음으로 슬로진을 사용한 블랙쏜 칵테일이 소개됩니다. 슬로베리는 블랜쏜(프루트)라 불리기도 하는데, 1930년대에 소개된 레시피가 조금 더 설득력있는 유래라 볼 수 있습니다. 이후 두 레시피가 함께 소개되면서 각자 동음의 다른 칵테일로 존재하게 되었습니다.",
    tags: ["Sloe Gin", "Vermouth", "Classic", "Stir"],
    gallery: [],
    recipes: [
      { name: "Blackthorn", ingredients: "슬로진 22.5ml · 스윗 버무스 22.5ml · 드라이 버무스 22.5ml · 앙고스투라 비터 2dash" },
    ],
    content: [],
  },
];

export const MAGAZINE_DATA: MagazineItem[] = [
  {
    id: 1,
    title: "압구정 골목에서 만난 와이너리",
    author: "크리에이터 팀",
    date: "2026.03.24",
    readTime: "3분",
    excerpt: "코콕의 인스타그램 카드뉴스를 확인해보세요.",
    img: "",
    tags: ["카드뉴스", "인스타그램"],
    magazineType: "cardnews",
    content: [],
    instagramUrls: ["https://www.instagram.com/p/DV_SRkgEyv_/"],
  },
];

export const PARTNERS: string[] = [
  "Coca-Cola",
  "Hwayo",
  "Perrier",
  "Monin",
  "Mozart",
  "Bombay Sapphire",
];

export const FAQ_DATA: FaqItem[] = [
  { q: "술에 대해 잘 몰라도 지원 가능한가요?", a: "네, 열정과 즐겁게 배우고자 하는 마음만 있다면 충분합니다. 코콕은 주류를 사랑하는 모든 분들을 환영합니다." },
  { q: "활동 주기와 장소는 어떻게 되나요?", a: "주 1회 정기 세션이 진행되며, 장소는 강남/신촌 인근 제휴 바에서 이루어집니다." },
  { q: "활동 비용이 발생하나요?", a: "소정의 회비가 있으며, 회비는 클래스 재료비 및 행사 운영에 사용됩니다. 자세한 금액은 합격 안내 시 공지됩니다." },
];
