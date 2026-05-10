// ──────────────────────────────────────────────────────────
// 시드(Seed) 스크립트
// ──────────────────────────────────────────────────────────
// "시드"란 데이터베이스에 초기 데이터를 넣는 것입니다.
// 빈 데이터베이스로 서버를 시작하면 아무것도 안 보이니까,
// 기존 프론트엔드에 있던 샘플 데이터를 DB에 넣어줍니다.
//
// 실행 방법: npm run db:seed (server 폴더에서)
// ──────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시드 데이터 삽입을 시작합니다...');

  // ── 아카이브 데이터 ──────────────────────────────────────
  // 기존 데이터가 있으면 건너뜁니다 (중복 방지)
  const archiveCount = await prisma.archive.count();
  if (archiveCount === 0) {
    await prisma.archive.createMany({
      data: [
        {
          year: '2024',
          category: '정기 클래스',
          title: '클래식 칵테일 마스터리',
          date: '2024.03.15',
          base: 'Gin',
          img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
          participants: 18,
          location: '신촌 Bar Lune',
          description: '진(Gin)을 베이스로 한 클래식 칵테일들을 직접 제조하는 마스터리 클래스입니다. 네그로니, 마티니, 에비에이션 등 진의 역사와 함께 각 레시피의 균형을 탐구했습니다.',
          tags: JSON.stringify(['Gin', 'Classic', 'Masterclass']),
          gallery: JSON.stringify([
            'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800',
          ]),
          recipes: JSON.stringify([
            { name: 'Negroni', ingredients: 'Gin 30ml · Campari 30ml · Sweet Vermouth 30ml', img: 'https://images.unsplash.com/photo-1614313512903-5e3e9be40dc4?auto=format&fit=crop&q=80&w=800' },
            { name: 'Dry Martini', ingredients: 'Gin 60ml · Dry Vermouth 10ml · Orange Bitters', img: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=800' },
            { name: 'Aviation', ingredients: 'Gin 45ml · Maraschino 15ml · Crème de Violette 7.5ml', img: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&q=80&w=800' },
          ]),
          content: JSON.stringify([]),
        },
        {
          year: '2024',
          category: '외부 협업',
          title: '성수 팝업 게스트 바텐딩',
          date: '2024.04.10',
          base: 'Whiskey',
          img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
          participants: 8,
          location: '성수 Craft Bar Seoul',
          description: '성수동의 유명 크래프트 바에서 코콕 멤버들이 직접 게스트 바텐더로 참여한 특별한 협업 이벤트입니다.',
          tags: JSON.stringify(['Whiskey', 'Collab', 'Popup']),
          gallery: JSON.stringify([
            'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1527281405159-35d5b9a1650c?auto=format&fit=crop&q=80&w=800',
          ]),
          recipes: JSON.stringify([
            { name: 'Smoky Highball', ingredients: 'Scotch 45ml · Soda Water 120ml · Lemon Peel', img: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80&w=800' },
            { name: 'Honey Bourbon Fizz', ingredients: 'Bourbon 45ml · Honey Syrup 15ml · Lemon 20ml · Soda', img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800' },
          ]),
          content: JSON.stringify([]),
        },
        {
          year: '2023',
          category: 'MT/파티',
          title: 'COCOC 연말 네트워킹 파티',
          date: '2023.12.20',
          base: 'Various',
          img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800',
          participants: 42,
          location: '강남 Private Venue',
          description: '2023년을 마무리하는 코콕의 연말 네트워킹 파티입니다.',
          tags: JSON.stringify(['Party', 'Networking', 'Signature']),
          gallery: JSON.stringify([
            'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800',
          ]),
          recipes: JSON.stringify([]),
          content: JSON.stringify([]),
        },
        {
          year: '2023',
          category: '정기 클래스',
          title: '티 칵테일 오마카세',
          date: '2023.11.05',
          base: 'Vodka',
          img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800',
          participants: 14,
          location: '용산',
          description: '차(茶) 문화와 칵테일을 접목한 실험적인 오마카세 클래스입니다.',
          tags: JSON.stringify(['Tea', 'Infusion', 'Omakase']),
          gallery: JSON.stringify([
            'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=800',
          ]),
          recipes: JSON.stringify([
            { name: 'Earl Grey Martini', ingredients: 'Earl Grey Vodka 50ml · Lemon 20ml · Simple Syrup 10ml', img: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=800' },
            { name: 'Matcha Mule', ingredients: 'Matcha Vodka 45ml · Ginger Beer 100ml · Lime 15ml', img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800' },
          ]),
          content: JSON.stringify([]),
        },
        {
          year: '2024',
          category: 'MT/파티',
          title: '신입 OT 환영 파티',
          date: '2024.03.01',
          base: 'Various',
          img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800',
          participants: 30,
          location: '신촌',
          description: '2024년 신입 멤버들을 환영하는 OT 파티입니다.',
          tags: JSON.stringify(['OT', 'Welcome', 'Party']),
          gallery: JSON.stringify([
            'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
          ]),
          recipes: JSON.stringify([]),
          content: JSON.stringify([]),
        },
        {
          year: '2023',
          category: '외부 협업',
          title: '홍대 팝업 칵테일 바',
          date: '2023.10.15',
          base: 'Rum',
          img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
          participants: 10,
          location: '홍대 팝업 스페이스',
          description: '럼 베이스 트로피칼 칵테일을 테마로 홍대에서 주말 이틀간 운영한 팝업 바입니다.',
          tags: JSON.stringify(['Rum', 'Tropical', 'Popup']),
          gallery: JSON.stringify([
            'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800',
          ]),
          recipes: JSON.stringify([
            { name: 'Jungle Bird', ingredients: 'Rum 45ml · Campari 15ml · Pineapple 45ml · Lime 15ml', img: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&q=80&w=800' },
            { name: 'Painkiller', ingredients: 'Rum 60ml · Pineapple 120ml · OJ 30ml · Cream of Coconut 30ml', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800' },
          ]),
          content: JSON.stringify([]),
        },
        {
          year: '2025',
          category: '정기 클래스',
          title: 'Blackthorn 클래스',
          date: '2025.00.00',
          base: 'Sloe Gin',
          img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
          participants: 0,
          location: '',
          description: '1900년대 해리 존슨의 저서에 처음 등장한 동음의 칵테일(BLACK THORN)과는 다른 레시피의 칵테일로, 1930년대 윌리엄 부스비의 저서에 처음으로 슬로진을 사용한 블랙쏜 칵테일이 소개됩니다.',
          tags: JSON.stringify(['Sloe Gin', 'Vermouth', 'Classic', 'Stir']),
          gallery: JSON.stringify([]),
          recipes: JSON.stringify([
            { name: 'Blackthorn', ingredients: '슬로진 22.5ml · 스윗 버무스 22.5ml · 드라이 버무스 22.5ml · 앙고스투라 비터 2dash' },
          ]),
          content: JSON.stringify([]),
        },
      ],
    });
    console.log('  ✅ 아카이브 7개 삽입 완료');
  } else {
    console.log('  ⏭️  아카이브 데이터가 이미 존재합니다 (건너뜀)');
  }

  // ── 스케줄 데이터 ────────────────────────────────────────
  const scheduleCount = await prisma.schedule.count();
  if (scheduleCount === 0) {
    await prisma.schedule.createMany({
      data: [
        { title: '첫번째 클래스, 시음회', date: '2025-12-06', type: '클래스', archiveId: 7 },
        { title: '클래스 A팀', date: '2025-12-20', type: '클래스' },
        { title: '친해지길 바래 주간', date: '2025-12-14', endDate: '2026-01-03', type: '내부행사' },
        { title: '클래스 B팀', date: '2026-01-03', type: '클래스' },
        { title: '신년회, 친해지길 바래 발표', date: '2026-01-17', type: '클래스' },
        { title: '클래스 A팀', date: '2026-02-07', type: '클래스' },
        { title: '클래스 B팀', date: '2026-02-21', type: '클래스' },
        { title: '개강총회', date: '2026-03-07', type: '내부행사' },
        { title: '클래스 A팀', date: '2026-03-21', type: '클래스' },
        { title: '클래스 B팀', date: '2026-04-04', type: '클래스' },
        { title: '내부 행사', date: '2026-04-18', type: '내부행사' },
        { title: '클래스 A팀', date: '2026-05-16', type: '클래스' },
        { title: '방학식', date: '2026-05-30', type: '내부행사' },
        { title: '방학 특강', date: '2026-07-18', type: '내부행사' },
        { title: '클래스 B팀', date: '2026-08-08', type: '클래스' },
        { title: '클래스 A팀', date: '2026-08-22', type: '클래스' },
        { title: '클래스 B팀', date: '2026-09-05', type: '클래스' },
        { title: '클래스 A팀', date: '2026-09-19', type: '클래스' },
        { title: '엔딩파티', date: '2026-10-03', type: '내부행사' },
      ],
    });
    console.log('  ✅ 스케줄 19개 삽입 완료');
  } else {
    console.log('  ⏭️  스케줄 데이터가 이미 존재합니다 (건너뜀)');
  }

  // ── 매거진 데이터 ────────────────────────────────────────
  const magazineCount = await prisma.magazine.count();
  if (magazineCount === 0) {
    await prisma.magazine.create({
      data: {
        title: '압구정 골목에서 만난 와이너리',
        author: '크리에이터 팀',
        date: '2026.03.24',
        readTime: '3분',
        excerpt: '코콕의 인스타그램 카드뉴스를 확인해보세요.',
        img: '',
        tags: JSON.stringify(['카드뉴스', '인스타그램']),
        magazineType: 'cardnews',
        instagramUrls: JSON.stringify(['https://www.instagram.com/p/DV_SRkgEyv_/']),
        content: JSON.stringify([]),
      },
    });
    console.log('  ✅ 매거진 1개 삽입 완료');
  } else {
    console.log('  ⏭️  매거진 데이터가 이미 존재합니다 (건너뜀)');
  }

  // ── 기본 면접 설정 ───────────────────────────────────────
  await prisma.interviewSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      mtDate: '추후 공지 예정',
      interviewDates: JSON.stringify(['3/22(토)', '3/23(일)']),
      interviewTimes: JSON.stringify([
        '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00',
        '13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00',
      ]),
    },
  });
  console.log('  ✅ 면접 설정 초기값 삽입 완료');

  console.log('\n🎉 시드 데이터 삽입이 완료되었습니다!');
}

main()
  .catch((e) => {
    console.error('❌ 시드 에러:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
