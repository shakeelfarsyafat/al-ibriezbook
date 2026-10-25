/**
 * ============================================================================
 * AL-IBRIEZ BOOK - INTERACTIVE LOGIC & ORDER ENGINE
 * Official Store: Al-Qur'an Al-Muttaqin (Penerbit Al-Qosbah)
 * ============================================================================
 */

// 1. PRODUCTS DATA WITH LOCALSTORAGE PERSISTENCE
const DEFAULT_CATALOG_PRODUCTS = [
  {
    id: 'QOS-HAFALAN',
    name: 'Al-Qur\'an Untuk Hafalan',
    price: 75000,
    oldPrice: 95000,
    image: 'assets/prod-hafalan.svg',
    desc: 'Dilengkapi 5 blok warna hafalan per-halaman, panduan pengingat awal ayat, & motivasi tahfidz.',
    badge: 'BEST SELLER',
    category: 'Hafalan',
    weight: 0.70
  },
  {
    id: 'QOS-TERJEMAH',
    name: 'Al-Qur\'an Dengan Terjemah',
    price: 88000,
    oldPrice: 110000,
    image: 'assets/prod-terjemah.svg',
    desc: 'Terjemahan lengkap Kementerian Agama RI, asbabun nuzul, serta indeks tematik ayat Al-Qur\'an.',
    category: 'Terjemah',
    weight: 0.85
  },
  {
    id: 'QOS-MTQ-A5',
    name: 'Al-Qur\'an Non Terjemah (Al-Muttaqin A5)',
    price: 65000,
    oldPrice: 78000,
    image: 'assets/prod-nonterjemah.svg',
    desc: 'Mushaf Al-Muttaqin: Tajwid Multikode warna, panduan Waqaf & Ibtida\' nafas pendek.',
    badge: 'TILAWAH UTAMA',
    category: 'Tilawah',
    weight: 0.65
  },
  {
    id: 'QOS-MTQ-A4',
    name: 'Al-Qur\'an Non Terjemah (Al-Muttaqin A4 Jumbo)',
    price: 99000,
    oldPrice: 125000,
    image: 'assets/prod-nonterjemah.svg',
    desc: 'Mushaf Al-Muttaqin ukuran besar, huruf ekstra besar ramah lansia.',
    category: 'Tilawah',
    weight: 1.15
  },
  {
    id: 'QOS-TAFSIR',
    name: 'Al-Qur\'an Dengan Tafsir Tematik',
    price: 115000,
    oldPrice: 145000,
    image: 'assets/prod-tafsir.svg',
    desc: 'Kompilasi tafsir mu\'tabar berdasar tema aqidah, syariah, akhlak, dan sejarah Nabi.',
    category: 'Tafsir',
    weight: 1.20
  },
  {
    id: 'QOS-JAKET',
    name: 'Al-Qur\'an Dengan Cover Jaket',
    price: 95000,
    oldPrice: 120000,
    image: 'assets/prod-jaket.svg',
    desc: 'Sampul resleting kulit sintetis lux yang tahan percikan air, pengait tas & tali pembatas.',
    category: 'Cover Kulit',
    weight: 0.75
  },
  {
    id: 'QOS-BUKU',
    name: 'Buku Bacaan & Panduan Tajwid',
    price: 45000,
    oldPrice: 60000,
    image: 'assets/prod-buku.svg',
    desc: 'Buku bimbingan tajwid praktis, makhorijul huruf bergambar, risalah doa harian & zikir.',
    category: 'Buku',
    weight: 0.35
  }
];

function loadStoredProducts() {
  try {
    const raw = localStorage.getItem('alibriez_catalog_products');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const clean = parsed.filter(p => p && typeof p === 'object' && p.name);
        if (clean.length > 0) return clean;
      }
    }
  } catch (e) {
    console.error('Error loading products from localStorage:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_CATALOG_PRODUCTS));
}

function saveStoredProducts(products) {
  try {
    localStorage.setItem('alibriez_catalog_products', JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to localStorage:', e);
  }
}

let CATALOG_PRODUCTS = loadStoredProducts();

// ============================================================================
// 1.B HERO BANNER CONSTANTS & LOCALSTORAGE PERSISTENCE
// ============================================================================
const DEFAULT_HERO_BANNERS = [
  {
    id: 'BANNER-1',
    title: "Al-Qur'an Al-Muttaqin Tajwid Multikode & Waqaf Ibtida'",
    subtitle: "Membaca tartil tanpa rumus rumit. Dilengkapi huruf tajwid berwarna & panduan garis nafas henti-mulai cetakan resmi Penerbit Al-Qosbah.",
    tag: "MUSHAF TILAWAH UTAMA",
    bgGradient: "emerald",
    image: "assets/banner-mushaf-utama.svg",
    ctaText: "Lihat Contoh Tajwid & Waqaf",
    ctaLink: "#sectionContohBacaan",
    secondaryCtaText: "Pesan Sekarang",
    secondaryCtaLink: "#sectionProduk",
    openNewTab: false,
    isActive: true
  },
  {
    id: 'BANNER-2',
    title: "Mushaf Hafalan Al-Muttaqin 5 Blok Warna",
    subtitle: "Metode teruji 5 jam hafal 1 halaman. Dilengkapi pengingat kata kunci awal ayat, tema ayat, dan panduan motivasi tahfidz.",
    tag: "BEST SELLER TAHFIDZ",
    bgGradient: "navy",
    image: "assets/banner-hafalan.svg",
    ctaText: "Beli Mushaf Hafalan",
    ctaLink: "#sectionProduk",
    secondaryCtaText: "Lihat Spesifikasi",
    secondaryCtaLink: "#sectionKeunggulan",
    openNewTab: false,
    isActive: true
  },
  {
    id: 'BANNER-3',
    title: "Promo Spesial Toko Resmi: Diskon s/d 30%",
    subtitle: "Garansi 100% Produk Original Al-Qosbah. Siap kirim aman dengan bubble wrap ke seluruh wilayah Indonesia & pemesanan mancanegara.",
    tag: "PROMO HARI INI",
    bgGradient: "ruby",
    image: "assets/banner-promo.svg",
    ctaText: "Ambil Promo Diskon",
    ctaLink: "#sectionProduk",
    secondaryCtaText: "Tanya Admin WhatsApp",
    secondaryCtaLink: "https://wa.me/6281234567890?text=Halo%20Admin%20Al-Ibriez%20Book,%20saya%20ingin%20tanya%20promo%20mushaf%20Al-Qur'an",
    openNewTab: true,
    isActive: true
  },
  {
    id: 'BANNER-4',
    title: "Inspiring People to Love & Live with Quran",
    subtitle: "Menemani langkah setiap insan dan keluarga muslim untuk senantiasa dekat, membaca, dan mentadaburi Kalam Ilahi setiap hari.",
    tag: "OFFICIAL STORE AL-IBRIEZ",
    bgGradient: "amber",
    image: "assets/hero-kids-quran.svg",
    ctaText: "Jelajahi Semua Koleksi",
    ctaLink: "#sectionProduk",
    secondaryCtaText: "Tentang Kami",
    secondaryCtaLink: "#sectionKeunggulan",
    openNewTab: false,
    isActive: true
  }
];

function loadStoredBanners() {
  try {
    const raw = localStorage.getItem('alibriez_hero_banners');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const clean = parsed.filter(b => b && typeof b === 'object' && b.title);
        if (clean.length > 0) return clean;
      }
    }
  } catch (e) {
    console.error('Error loading hero banners from localStorage:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_HERO_BANNERS));
}

function saveStoredBanners(banners) {
  try {
    localStorage.setItem('alibriez_hero_banners', JSON.stringify(banners));
  } catch (e) {
    console.error('Error saving hero banners to localStorage:', e);
  }
}

let HERO_BANNERS = loadStoredBanners();

// Tajwid Explanations
const TAJWID_RULES = {
  mad: {
    title: 'Mad (Warna Merah)',
    text: 'Dibaca panjang 2, 4, hingga 6 harakat. Huruf berwarna merah langsung menandai ketukan panjang tanpa perlu menghafal rumus rumit.'
  },
  ikhfa: {
    title: 'Ikhfa & Idgham (Warna Hijau)',
    text: 'Dibaca dengung (ghunnah) samar selama 2 harakat. Tahan suara di pangkal hidung sebelum melanjutkan ke huruf berikutnya.'
  },
  qalqalah: {
    title: 'Qalqalah Pantul (Warna Biru)',
    text: 'Dibaca memantul saat sukun/mati pada huruf (ب ج د ط ق). Pantulan terasa alami dan jelas tanpa terkesan berharakat.'
  },
  ghunnah: {
    title: 'Ghunnah Tasydid (Warna Ungu)',
    text: 'Nun atau Mim bertasydid dibaca dengan dengung sempurna (akmal ma takun) selama 2 harakat penuh.'
  },
  waqaf: {
    title: 'Tanda Waqaf (Garis Garis Merah)',
    text: 'Tanda batas henti nafas. Disarankan berhenti di sini agar nafas tidak putus di tengah kalimat yang merusak makna ayat.'
  },
  ibtida: {
    title: 'Tanda Ibtida\' (Garis Garis Hijau)',
    text: 'Titik aman untuk memulai kembali bacaan setelah berhenti, menjamin struktur kalimat ayat Al-Qur\'an tetap sempurna.'
  }
};

// ============================================================================
// 1.C TESTIMONIALS DATA & LOCALSTORAGE INTEGRATION
// ============================================================================
const DEFAULT_LANDING_TESTIMONIALS = [
  {
    id: 'TESTI-1',
    name: 'Ustadz Muhammad Fauzi, S.Pd.I',
    role: 'Pengasuh TPQ & Tahfidz, Cirebon',
    productName: "Al-Qur'an Al-Muttaqin Tajwid Multikode & Waqaf Ibtida'",
    rating: 5,
    text: "Alhamdulillah sangat terbantu dengan mushaf Al-Muttaqin ini. Santri kami yang nafasnya pendek sekarang tidak bingung lagi harus berhenti di mana dan dari mana harus mengulang. Penanda waqaf & ibtida'-nya benar-benar akurat sesuai kaidah.",
    isActive: true
  },
  {
    id: 'TESTI-2',
    name: 'Ibu Hj. Siti Nurjanah',
    role: 'Jamaah Majelis Ta\'lim, Bandung',
    productName: "Al-Qur'an Non Terjemah (Al-Muttaqin A4 Jumbo)",
    rating: 5,
    text: "Mushaf ukuran A4 jumbo hurufnya sangat jelas dan besar, cocok sekali untuk mata lansia. Tajwid warnanya terang tapi tidak menyilaukan. Pengemasan bubble wrap-nya sangat tebal dan sampai dengan selamat.",
    isActive: true
  },
  {
    id: 'TESTI-3',
    name: 'Ahmad Ridwan Santoso',
    role: 'Mahasiswa & Penghafal Al-Qur\'an, Solo',
    productName: "Mushaf Hafalan Al-Muttaqin 5 Blok Warna",
    rating: 5,
    text: "Metode 5 blok warnanya memudahkan hafalan 1 halaman per hari. Pengingat kata kunci awal ayat di margin sangat membantu saat muroja'ah mandiri. Recomended untuk santri maupun umum!",
    isActive: true
  },
  {
    id: 'TESTI-4',
    name: 'dr. Hendra Kurniawan',
    role: 'Dokter Umum & Sahabat Quran, Surabaya',
    productName: "Al-Qur'an Cover Kulit Resleting (Jaket Lux)",
    rating: 5,
    text: "Cover jaket kulitnya lux dan resletingnya kokoh, mudah dibawa dinas ke rumah sakit tanpa takut lembaran kertasnya rusak atau kotor. Kualitas kertas QPP premium lembut di mata.",
    isActive: true
  }
];

function loadStoredTestimonials() {
  try {
    const raw = localStorage.getItem('alibriez_testimonials');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const clean = parsed.filter(t => t && typeof t === 'object' && t.name);
        if (clean.length > 0) return clean;
      }
    }
  } catch (e) {
    console.error('Error loading testimonials from localStorage:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_LANDING_TESTIMONIALS));
}

function renderLandingTestimonials() {
  const container = document.getElementById('testimonialsGrid');
  if (!container) return;

  const list = loadStoredTestimonials().filter(t => t.isActive !== false);
  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 40px;">
        Belum ada ulasan yang ditampilkan saat ini.
      </div>
    `;
    return;
  }

  const starSvg = '<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';

  container.innerHTML = list.map(t => {
    const ratingCount = Math.max(1, Math.min(5, Number(t.rating) || 5));
    const starsHtml = starSvg.repeat(ratingCount);
    const words = (t.name || 'Pelanggan').trim().split(/\s+/);
    const initials = (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase();
    const productBadge = t.productName ? `<div style="font-size:0.75rem; color:#f97316; font-weight:700; margin-bottom:8px;">★ ${t.productName}</div>` : '';

    return `
      <div class="testi-card">
        <div class="testi-stars">
          ${starsHtml}
        </div>
        ${productBadge}
        <p class="testi-quote">
          "${t.text}"
        </p>
        <div class="testi-author-row">
          <div class="testi-avatar">${initials}</div>
          <div>
            <div class="testi-meta-name">${t.name} <span class="verified-badge">✓ Terverifikasi</span></div>
            <div class="testi-meta-loc">📍 ${t.role || 'Pembeli Resmi Al-Ibriez'}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function initTestimonialsCarousel() {
  const container = document.getElementById('testimonialsGrid');
  const btnPrev = document.getElementById('btnTestiScrollPrev');
  const btnNext = document.getElementById('btnTestiScrollNext');

  if (!container) return;

  function getScrollStep() {
    const card = container.querySelector('.testi-card');
    return card ? (card.offsetWidth + 24) : 340;
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      container.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      container.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });
  }
}

function initApp() {
  initHeroBannerCarousel();
  initNavbarSearch();
  initMushafShowcaseSlider();
  initOrderModal();
  renderProductsGrid();
  updateOrderModalOptions();
  initCatalogModal();
  renderLandingTestimonials();
  initTestimonialsCarousel();
  initNavLoginButton();
  if (typeof initAdminDashboard === 'function' && document.getElementById('adminDashboardBackdrop')) {
    initAdminDashboard();
  }
  syncFromNeonDB();
}

async function syncFromNeonDB() {
  try {
    const [prodRes, bannerRes, testiRes] = await Promise.all([
      fetch('/api/products').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/banners').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/testimonials').then(r => r.ok ? r.json() : null).catch(() => null)
    ]);

    if (prodRes && prodRes.success && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
      CATALOG_PRODUCTS = prodRes.data;
      saveStoredProducts(CATALOG_PRODUCTS);
      renderProductsGrid();
      updateOrderModalOptions();
      if (document.getElementById('catalogModalBackdrop')?.classList.contains('open')) {
        renderCatalogItems();
      }
    }

    if (bannerRes && bannerRes.success && Array.isArray(bannerRes.data) && bannerRes.data.length > 0) {
      HERO_BANNERS = bannerRes.data;
      saveStoredBanners(HERO_BANNERS);
      initHeroBannerCarousel();
    }

    if (testiRes && testiRes.success && Array.isArray(testiRes.data) && testiRes.data.length > 0) {
      saveStoredTestimonials(testiRes.data);
      renderLandingTestimonials();
    }
  } catch (err) {
    console.warn('Neon DB sync notice, using local cache:', err);
  }
}

function initNavLoginButton() {
  // Tombol centang mengarahkan pengguna ke halaman login admin.html untuk autentikasi PIN
}

window.addEventListener('storage', (e) => {
  if (e.key === 'alibriez_testimonials') {
    renderLandingTestimonials();
  }
  if (e.key === 'alibriez_hero_banners') {
    initHeroBannerCarousel();
  }
  if (e.key === 'alibriez_catalog_products') {
    CATALOG_PRODUCTS = loadStoredProducts();
    renderProductsGrid();
    updateOrderModalOptions();
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// ==========================================================================
// HERO BANNER CAROUSEL LOGIC
// Dynamic banner carousel with auto-slide, gesture swipe/drag,
// animated progress indicator dots, and interactive CTA links.
// ==========================================================================
function initHeroBannerCarousel() {
  const viewport = document.getElementById('heroBannerViewport');
  const track = document.getElementById('heroBannerTrack');
  const prevBtn = document.getElementById('btnHeroPrev');
  const nextBtn = document.getElementById('btnHeroNext');
  const dotsContainer = document.getElementById('heroPaginationDots');
  const autoplayToggle = document.getElementById('btnHeroAutoplay');

  if (!viewport || !track) return;

  let banners = loadStoredBanners().filter(b => b.isActive !== false);
  if (banners.length === 0) {
    banners = JSON.parse(JSON.stringify(DEFAULT_HERO_BANNERS));
  }

  let currentIndex = 0;
  let autoSlideTimer = null;
  let isAutoplayPaused = false;
  const slideDuration = 5000; // 5 seconds per slide

  // Render Slides
  function renderSlides() {
    track.innerHTML = banners.map((b, idx) => {
      const targetAttr = b.openNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
      const ctaUrl = b.ctaLink && b.ctaLink.trim() ? b.ctaLink.trim() : '#sectionProduk';
      const secCtaBtn = b.secondaryCtaText && b.secondaryCtaText.trim() ? `
        <span class="hero-slide-btn-sub" onclick="event.preventDefault(); event.stopPropagation(); window.location.href='${b.secondaryCtaLink || '#sectionProduk'}'">
          ${b.secondaryCtaText}
        </span>
      ` : '';

      return `
        <div class="hero-slide-item theme-${b.bgGradient || 'emerald'} ${idx === 0 ? 'active' : ''}" data-index="${idx}">
          <a href="${ctaUrl}" class="hero-slide-link" ${targetAttr}>
            <div class="hero-slide-bg-ambient"></div>
            <div class="hero-slide-pattern"></div>
            
            <div class="container hero-slide-container">
              <div class="hero-slide-content">
                ${b.tag ? `
                  <div class="hero-slide-badge">
                    <span class="badge-sparkle">★</span>
                    <span>${b.tag}</span>
                  </div>
                ` : ''}

                <h1 class="hero-slide-title">${b.title}</h1>
                <p class="hero-slide-subtitle">${b.subtitle}</p>

                <div class="hero-slide-actions">
                  <span class="hero-slide-btn-cta">
                    <span>${b.ctaText || 'Pesan Sekarang'}</span>
                    <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                  </span>
                  ${secCtaBtn}
                </div>
              </div>

              <div class="hero-slide-media">
                <div class="hero-media-wrapper">
                  <img src="${b.image}" alt="${b.title}" class="hero-media-img" onerror="this.src='assets/banner-mushaf-utama.svg'">
                </div>
              </div>
            </div>
          </a>
        </div>
      `;
    }).join('');

    renderDots();
    goToSlide(0, false);
  }

  // Render Pagination Dots
  function renderDots() {
    if (!dotsContainer) return;
    if (banners.length <= 1) {
      dotsContainer.style.display = 'none';
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (autoplayToggle) autoplayToggle.style.display = 'none';
      return;
    }

    dotsContainer.style.display = 'flex';
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
    if (autoplayToggle) autoplayToggle.style.display = 'flex';

    dotsContainer.innerHTML = banners.map((_, idx) => `
      <button class="hero-dot ${idx === 0 ? 'active' : ''}" data-goto="${idx}" aria-label="Lompat ke Slide ${idx + 1}" title="Slide ${idx + 1}">
        <span class="hero-dot-progress"></span>
      </button>
    `).join('');

    dotsContainer.querySelectorAll('.hero-dot').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetIdx = parseInt(btn.getAttribute('data-goto'), 10);
        goToSlide(targetIdx);
      });
    });
  }

  // Move to Slide
  function goToSlide(idx, animate = true) {
    if (banners.length === 0) return;
    currentIndex = (idx + banners.length) % banners.length;

    track.style.transition = animate ? 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Toggle active class on slide items
    const slideItems = track.querySelectorAll('.hero-slide-item');
    slideItems.forEach((item, i) => {
      item.classList.toggle('active', i === currentIndex);
    });

    // Update Dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.hero-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
        const bar = dot.querySelector('.hero-dot-progress');
        if (bar) {
          bar.style.transition = 'none';
          bar.style.width = '0%';
          if (i === currentIndex && !isAutoplayPaused) {
            // Trigger reflow to restart css animation
            void bar.offsetWidth;
            bar.style.transition = `width ${slideDuration}ms linear`;
            bar.style.width = '100%';
          }
        }
      });
    }

    restartAutoSlide();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Autoplay Logic
  function startAutoSlide() {
    stopAutoSlide();
    if (banners.length <= 1 || isAutoplayPaused) return;

    // Reset progress bar on active dot
    if (dotsContainer) {
      const activeDot = dotsContainer.querySelector('.hero-dot.active .hero-dot-progress');
      if (activeDot) {
        activeDot.style.transition = 'none';
        activeDot.style.width = '0%';
        void activeDot.offsetWidth;
        activeDot.style.transition = `width ${slideDuration}ms linear`;
        activeDot.style.width = '100%';
      }
    }

    autoSlideTimer = setTimeout(() => {
      nextSlide();
    }, slideDuration);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearTimeout(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Arrow Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
    });
  }

  // Autoplay Toggle Button
  if (autoplayToggle) {
    const iconPause = autoplayToggle.querySelector('.icon-pause');
    const iconPlay = autoplayToggle.querySelector('.icon-play');

    autoplayToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      isAutoplayPaused = !isAutoplayPaused;
      if (isAutoplayPaused) {
        stopAutoSlide();
        if (iconPause) iconPause.style.display = 'none';
        if (iconPlay) iconPlay.style.display = 'block';
        autoplayToggle.setAttribute('title', 'Lanjutkan Auto Slide');
      } else {
        if (iconPause) iconPause.style.display = 'block';
        if (iconPlay) iconPlay.style.display = 'none';
        autoplayToggle.setAttribute('title', 'Jeda Auto Slide');
        startAutoSlide();
      }
    });
  }

  // Pause on Mouse Hover
  viewport.addEventListener('mouseenter', () => {
    if (!isAutoplayPaused) stopAutoSlide();
  });

  viewport.addEventListener('mouseleave', () => {
    if (!isAutoplayPaused) startAutoSlide();
  });

  // Touch Swipe & Mouse Drag Handling
  let startX = 0;
  let currentTranslateX = 0;
  let isDragging = false;
  let dragDistance = 0;

  function onTouchStart(e) {
    if (banners.length <= 1) return;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    isDragging = true;
    dragDistance = 0;
    stopAutoSlide();
    track.style.transition = 'none';
  }

  function onTouchMove(e) {
    if (!isDragging) return;
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const diffX = currentX - startX;
    dragDistance = Math.abs(diffX);

    // Prevent scrolling page if swiping banner
    if (dragDistance > 10 && e.cancelable && !e.type.includes('mouse')) {
      e.preventDefault();
    }

    const offset = -(currentIndex * 100) + (diffX / viewport.offsetWidth) * 100;
    track.style.transform = `translateX(${offset}%)`;
  }

  function onTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';

    const endX = e.type.includes('mouse') ? e.pageX : (e.changedTouches ? e.changedTouches[0].clientX : startX);
    const diffX = endX - startX;

    if (diffX < -45) {
      nextSlide();
    } else if (diffX > 45) {
      prevSlide();
    } else {
      goToSlide(currentIndex);
    }

    if (!isAutoplayPaused) startAutoSlide();
  }

  // Prevent accidental link opening while dragging
  viewport.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (dragDistance > 10) {
        e.preventDefault();
      }
    });
  });

  // Attach touch events
  viewport.addEventListener('touchstart', onTouchStart, { passive: true });
  viewport.addEventListener('touchmove', onTouchMove, { passive: false });
  viewport.addEventListener('touchend', onTouchEnd, { passive: true });

  // Attach mouse drag events
  viewport.addEventListener('mousedown', onTouchStart);
  window.addEventListener('mousemove', onTouchMove);
  window.addEventListener('mouseup', onTouchEnd);

  // Keyboard Arrow Navigation
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Re-render when storage updates in another tab
  window.addEventListener('storage', (e) => {
    if (e.key === 'alibriez_hero_banners') {
      banners = loadStoredBanners().filter(b => b.isActive !== false);
      if (banners.length === 0) banners = JSON.parse(JSON.stringify(DEFAULT_HERO_BANNERS));
      renderSlides();
    }
  });

  // Expose global reload function
  window.reloadHeroBanners = function() {
    banners = loadStoredBanners().filter(b => b.isActive !== false);
    if (banners.length === 0) banners = JSON.parse(JSON.stringify(DEFAULT_HERO_BANNERS));
    renderSlides();
  };

  // Initial render
  renderSlides();
}

// ==========================================================================
// SEARCH LOGIC
// ==========================================================================
function initNavbarSearch() {
  const searchInput = document.getElementById('navbarSearchInput');
  const searchBtn = document.getElementById('navbarSearchBtn');
  const resultsPanel = document.getElementById('searchResultsPanel');

  if (!searchInput || !resultsPanel) return;

  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      resultsPanel.classList.remove('open');
      resultsPanel.innerHTML = '';
      return;
    }

    const matches = CATALOG_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      resultsPanel.innerHTML = `
        <div style="padding:12px; font-size:0.84rem; color:#64748b; text-align:center;">
          Tidak ditemukan mushaf dengan kata kunci "${query}".
        </div>
      `;
    } else {
      resultsPanel.innerHTML = matches.map(p => `
        <div class="search-result-item" onclick="selectFromSearch('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price})">
          <div class="search-item-info">
            <strong>${p.name}</strong>
            <span>${p.desc.substring(0, 50)}...</span>
          </div>
          <div class="search-item-price">Rp ${p.price.toLocaleString('id-ID')}</div>
        </div>
      `).join('');
    }
    resultsPanel.classList.add('open');
  }

  searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });

  searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-search-wrap')) {
      resultsPanel.classList.remove('open');
    }
  });

  // Highlight products in grid if search submitted
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim().toLowerCase();
      if (q) {
        const target = document.getElementById('sectionProduk');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        resultsPanel.classList.remove('open');
      }
    }
  });

  // Mobile Search Toggle
  const mobileToggle = document.getElementById('btnToggleMobileSearch');
  const searchWrap = document.getElementById('navSearchWrap');
  if (mobileToggle && searchWrap) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      searchWrap.classList.toggle('mobile-search-active');
      if (searchWrap.classList.contains('mobile-search-active')) {
        searchInput.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-search-wrap') && !e.target.closest('.nav-search-toggle-mobile')) {
        searchWrap.classList.remove('mobile-search-active');
      }
    });
  }
}

window.selectFromSearch = function(id, name, price) {
  const resultsPanel = document.getElementById('searchResultsPanel');
  if (resultsPanel) resultsPanel.classList.remove('open');
  openOrderModal(id, name, price);
};

// ==========================================================================
// 2-SLIDE AUTHENTIC MUSHAF SHOWCASE SLIDER & AUDIO RECITATION PREVIEW
// ==========================================================================
function initMushafShowcaseSlider() {
  const tabs = document.querySelectorAll('.mushaf-tab-btn');
  const slides = document.querySelectorAll('.mushaf-slide');
  const dots = document.querySelectorAll('.dot-indicator');
  const btnPrev = document.getElementById('btnPrevMushafSlide');
  const btnNext = document.getElementById('btnNextMushafSlide');

  if (!tabs.length || !slides.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    slides.forEach((s, idx) => {
      if (idx === currentSlide) {
        s.style.display = 'flex';
        s.classList.add('active');
      } else {
        s.style.display = 'none';
        s.classList.remove('active');
      }
    });

    tabs.forEach((tab, idx) => {
      const isActive = idx === currentSlide;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const slideIndex = parseInt(tab.getAttribute('data-slide'), 10) || 0;
      goToSlide(slideIndex);
    });
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide'), 10) || 0;
      goToSlide(slideIndex);
    });
  });

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
    });
  }
}

// ==========================================================================
// ORDER MODAL & AUTOMATIC PAYMENT CALCULATION
// ==========================================================================

// ==========================================================================
// REGION DATA & AUTOMATIC SHIPPING CALCULATION ENGINE
// Origin: Weru Lor, Kec. Weru, Kab. Cirebon, Jawa Barat 45154
// ==========================================================================

const PRODUCT_WEIGHTS = {
  'QOS-HAFALAN': 0.70,
  'QOS-TERJEMAH': 0.85,
  'QOS-MTQ-A5': 0.65,
  'QOS-MTQ-A4': 1.25,
  'QOS-TAFSIR': 1.30,
  'QOS-JAKET': 0.75,
  'QOS-BUKU': 0.25
};

const API_BASE = 'https://emsifa.github.io/api-wilayah-indonesia/api';

const regionCache = {
  provinces: null,
  regencies: {},
  districts: {},
  villages: {}
};

// Fallback jika koneksi internet klien memblokir fetch eksternal
const FALLBACK_PROVINCES = [
  { id: "11", name: "ACEH" },
  { id: "12", name: "SUMATERA UTARA" },
  { id: "13", name: "SUMATERA BARAT" },
  { id: "14", name: "RIAU" },
  { id: "15", name: "JAMBI" },
  { id: "16", name: "SUMATERA SELATAN" },
  { id: "17", name: "BENGKULU" },
  { id: "18", name: "LAMPUNG" },
  { id: "19", name: "KEPULAUAN BANGKA BELITUNG" },
  { id: "21", name: "KEPULAUAN RIAU" },
  { id: "31", name: "DKI JAKARTA" },
  { id: "32", name: "JAWA BARAT" },
  { id: "33", name: "JAWA TENGAH" },
  { id: "34", name: "DAERAH ISTIMEWA YOGYAKARTA" },
  { id: "35", name: "JAWA TIMUR" },
  { id: "36", name: "BANTEN" },
  { id: "51", name: "BALI" },
  { id: "52", name: "NUSA TENGGARA BARAT" },
  { id: "53", name: "NUSA TENGGARA TIMUR" },
  { id: "61", name: "KALIMANTAN BARAT" },
  { id: "62", name: "KALIMANTAN TENGAH" },
  { id: "63", name: "KALIMANTAN SELATAN" },
  { id: "64", name: "KALIMANTAN TIMUR" },
  { id: "65", name: "KALIMANTAN UTARA" },
  { id: "71", name: "SULAWESI UTARA" },
  { id: "72", name: "SULAWESI TENGAH" },
  { id: "73", name: "SULAWESI SELATAN" },
  { id: "74", name: "SULAWESI TENGGARA" },
  { id: "75", name: "GORONTALO" },
  { id: "76", name: "SULAWESI BARAT" },
  { id: "81", name: "MALUKU" },
  { id: "82", name: "MALUKU UTARA" },
  { id: "91", name: "PAPUA" },
  { id: "92", name: "PAPUA BARAT" }
];

let currentDestScope = 'domestic';

window.switchDestScope = function(scope) {
  currentDestScope = scope;
  const btnDomestic = document.getElementById('btnScopeDomestic');
  const btnIntl = document.getElementById('btnScopeIntl');
  const domesticSec = document.getElementById('domesticAddressSection');
  const intlSec = document.getElementById('intlAddressSection');

  if (scope === 'domestic') {
    if (btnDomestic) btnDomestic.classList.add('active');
    if (btnIntl) btnIntl.classList.remove('active');
    if (domesticSec) domesticSec.style.display = 'block';
    if (intlSec) intlSec.style.display = 'none';
  } else {
    if (btnDomestic) btnDomestic.classList.remove('active');
    if (btnIntl) btnIntl.classList.add('active');
    if (domesticSec) domesticSec.style.display = 'none';
    if (intlSec) intlSec.style.display = 'block';
  }
  calculateModalTotal();
};

function formatTitleCase(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/(?:^|\s|-)\S/g, (c) => c.toUpperCase());
}

// Fetch with timeout helper so browser never hangs indefinitely
async function fetchWithTimeout(url, timeoutMs = 6000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// Helper fetch wilayah dengan multi-source:
// 1. Proxy server express lokal (/api/wilayah/...) - bebas CORS, ultra cepat dengan in-memory cache
// 2. Direct Emsifa GitHub Pages
// 3. Direct Emsifa.com
async function fetchWilayahData(proxyPath, emsifaPath) {
  const sources = [
    `/api/wilayah/${proxyPath}`,
    `https://emsifa.github.io/api-wilayah-indonesia/api/${emsifaPath}`,
    `https://www.emsifa.com/api-wilayah-indonesia/api/${emsifaPath}`
  ];

  let lastError = null;
  for (const url of sources) {
    try {
      const res = await fetchWithTimeout(url, 8000);
      if (res && res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error(`Gagal memuat data wilayah: ${proxyPath}`);
}

async function loadProvinces() {
  const provSelect = document.getElementById('modalProvince');
  const spinner = document.getElementById('spinnerProvince');
  if (!provSelect) return;

  if (provSelect.dataset.loaded === 'true') {
    return;
  }

  if (spinner) spinner.style.display = 'inline-block';
  try {
    let data = regionCache.provinces;
    if (!data) {
      data = await fetchWilayahData('provinces', 'provinces.json');
      regionCache.provinces = data;
    }
    populateSelect(provSelect, data, '-- Pilih Provinsi --', '32');
    provSelect.dataset.loaded = 'true';

    // Otomatis load kabupaten untuk provinsi default (Jawa Barat) jika belum termuat
    if (provSelect.value) {
      loadRegencies(provSelect.value);
    }
  } catch (err) {
    console.warn('Gagal memuat provinsi dari API, gunakan fallback:', err);
    populateSelect(provSelect, FALLBACK_PROVINCES, '-- Pilih Provinsi --', '32');
    provSelect.dataset.loaded = 'true';
    if (provSelect.value) {
      loadRegencies(provSelect.value);
    }
  } finally {
    if (spinner) spinner.style.display = 'none';
    calculateModalTotal();
  }
}

async function loadRegencies(provinceId) {
  const regSelect = document.getElementById('modalRegency');
  const distSelect = document.getElementById('modalDistrict');
  const villSelect = document.getElementById('modalVillage');
  const spinner = document.getElementById('spinnerRegency');

  if (!regSelect) return;
  resetSelect(regSelect, '⏳ Memuat Kabupaten / Kota...', true);
  resetSelect(distSelect, '-- Pilih Kabupaten/Kota Dahulu --', true);
  resetSelect(villSelect, '-- Pilih Kecamatan Dahulu --', true);

  if (!provinceId) {
    resetSelect(regSelect, '-- Pilih Provinsi Dahulu --', true);
    calculateModalTotal();
    return;
  }

  if (spinner) spinner.style.display = 'inline-block';
  try {
    let data = regionCache.regencies[provinceId];
    if (!data) {
      data = await fetchWilayahData(`regencies/${provinceId}`, `regencies/${provinceId}.json`);
      regionCache.regencies[provinceId] = data;
    }
    populateSelect(regSelect, data, '-- Pilih Kabupaten / Kota --');
    regSelect.disabled = false;
  } catch (err) {
    console.error('Error load regencies:', err);
    regSelect.innerHTML = `
      <option value="">-- Gagal memuat online, pilih opsi di bawah --</option>
      <option value="manual_kota" data-name="KOTA UMUM">Tulis Nama Kota / Kabupaten di Alamat Lengkap</option>
    `;
    regSelect.disabled = false;
  } finally {
    if (spinner) spinner.style.display = 'none';
    calculateModalTotal();
  }
}

async function loadDistricts(regencyId) {
  const distSelect = document.getElementById('modalDistrict');
  const villSelect = document.getElementById('modalVillage');
  const spinner = document.getElementById('spinnerDistrict');

  if (!distSelect) return;
  resetSelect(distSelect, '⏳ Memuat Kecamatan...', true);
  resetSelect(villSelect, '-- Pilih Kecamatan Dahulu --', true);

  if (!regencyId) {
    resetSelect(distSelect, '-- Pilih Kabupaten/Kota Dahulu --', true);
    calculateModalTotal();
    return;
  }

  if (spinner) spinner.style.display = 'inline-block';
  try {
    let data = regionCache.districts[regencyId];
    if (!data) {
      data = await fetchWilayahData(`districts/${regencyId}`, `districts/${regencyId}.json`);
      regionCache.districts[regencyId] = data;
    }
    populateSelect(distSelect, data, '-- Pilih Kecamatan --');
    distSelect.disabled = false;
  } catch (err) {
    console.error('Error load districts:', err);
    distSelect.innerHTML = `
      <option value="">-- Gagal memuat online, pilih opsi di bawah --</option>
      <option value="manual_kecamatan" data-name="KECAMATAN UMUM">Tulis Nama Kecamatan di Alamat Lengkap</option>
    `;
    distSelect.disabled = false;
  } finally {
    if (spinner) spinner.style.display = 'none';
    calculateModalTotal();
  }
}

async function loadVillages(districtId) {
  const villSelect = document.getElementById('modalVillage');
  const spinner = document.getElementById('spinnerVillage');

  if (!villSelect) return;
  resetSelect(villSelect, '⏳ Memuat Desa / Kelurahan...', true);

  if (!districtId) {
    resetSelect(villSelect, '-- Pilih Kecamatan Dahulu --', true);
    calculateModalTotal();
    return;
  }

  if (spinner) spinner.style.display = 'inline-block';
  try {
    let data = regionCache.villages[districtId];
    if (!data) {
      data = await fetchWilayahData(`villages/${districtId}`, `villages/${districtId}.json`);
      regionCache.villages[districtId] = data;
    }
    populateSelect(villSelect, data, '-- Pilih Desa / Kelurahan --');
    villSelect.disabled = false;
  } catch (err) {
    console.warn('API desa tidak merespons, opsi manual:', err);
    villSelect.innerHTML = `
      <option value="">-- Pilih Desa / Kelurahan --</option>
      <option value="manual_desa" data-name="DESA">Tulis Nama Desa/Kelurahan di Alamat Lengkap</option>
    `;
    villSelect.disabled = false;
  } finally {
    if (spinner) spinner.style.display = 'none';
    calculateModalTotal();
  }
}

function resetSelect(selectEl, placeholder, disabled) {
  if (!selectEl) return;
  selectEl.innerHTML = `<option value="">${placeholder}</option>`;
  selectEl.disabled = !!disabled;
}

function populateSelect(selectEl, items, defaultLabel, selectedValue) {
  let html = `<option value="">${defaultLabel}</option>`;
  items.forEach(item => {
    const formattedName = formatTitleCase(item.name);
    const isSelected = selectedValue && String(item.id) === String(selectedValue) ? 'selected' : '';
    html += `<option value="${item.id}" data-name="${item.name}" ${isSelected}>${formattedName}</option>`;
  });
  selectEl.innerHTML = html;
}

// ==========================================================================
// SHIPPING RATE CALCULATOR (ZONAL & WEIGHT BASED)
// ==========================================================================
function getShippingRateInfo(scope, courier, weightKg) {
  const provSelect = document.getElementById('modalProvince');
  const regSelect = document.getElementById('modalRegency');
  const countrySelect = document.getElementById('modalCountry');

  let zoneName = 'Domestik Standard';
  let cost = 0;

  if (scope === 'domestic') {
    const provId = provSelect ? provSelect.value : '';
    const regOpt = regSelect && regSelect.selectedIndex > 0 ? regSelect.options[regSelect.selectedIndex] : null;
    const regName = regOpt ? (regOpt.getAttribute('data-name') || regOpt.text).toUpperCase() : '';

    // Zone 1: Ciayumajakuning (Cirebon, Kuningan, Majalengka, Indramayu) - Origin Local
    if (regName.includes('CIREBON') || regName.includes('KUNINGAN') || regName.includes('MAJALENGKA') || regName.includes('INDRAMAYU')) {
      zoneName = 'Cirebon & Ciayumajakuning (Lokal Asal)';
      if (courier === 'jnt') cost = weightKg * 10000;
      else if (courier === 'pos') cost = weightKg * 8000;
      else if (courier === 'kargo') cost = weightKg <= 5 ? 20000 : 20000 + (weightKg - 5) * 2500;
    }
    // Zone 2: Jawa Barat, DKI Jakarta, Banten (IDs: 32, 31, 36)
    else if (['32', '31', '36'].includes(provId)) {
      zoneName = 'Jawa Barat, DKI Jakarta & Banten';
      if (courier === 'jnt') cost = weightKg * 14000;
      else if (courier === 'pos') cost = weightKg * 11000;
      else if (courier === 'kargo') cost = weightKg <= 5 ? 28000 : 28000 + (weightKg - 5) * 3500;
    }
    // Zone 3: Jawa Tengah & DI Yogyakarta (IDs: 33, 34)
    else if (['33', '34'].includes(provId)) {
      zoneName = 'Jawa Tengah & D.I. Yogyakarta';
      if (courier === 'jnt') cost = weightKg * 17000;
      else if (courier === 'pos') cost = weightKg * 13000;
      else if (courier === 'kargo') cost = weightKg <= 5 ? 32000 : 32000 + (weightKg - 5) * 4000;
    }
    // Zone 4: Jawa Timur, Madura, Bali, NTB, Lampung (IDs: 35, 51, 52, 18)
    else if (['35', '51', '52', '18'].includes(provId)) {
      zoneName = 'Jawa Timur, Bali, NTB & Lampung';
      if (courier === 'jnt') cost = weightKg * 24000;
      else if (courier === 'pos') cost = weightKg * 18000;
      else if (courier === 'kargo') cost = weightKg <= 5 ? 45000 : 45000 + (weightKg - 5) * 5500;
    }
    // Zone 5: Sumatera, Kalimantan, Sulawesi (IDs: 11-17, 19, 21, 61-65, 71-76)
    else if (['11','12','13','14','15','16','17','19','21','61','62','63','64','65','71','72','73','74','75','76'].includes(provId)) {
      zoneName = 'Sumatera, Kalimantan & Sulawesi';
      if (courier === 'jnt') cost = weightKg * 42000;
      else if (courier === 'pos') cost = weightKg * 32000;
      else if (courier === 'kargo') cost = weightKg <= 5 ? 65000 : 65000 + (weightKg - 5) * 8000;
    }
    // Zone 6: Maluku, Papua & NTT (IDs: 53, 81, 82, 91+)
    else if (['53','81','82','91','92','93','94','95','96'].includes(provId)) {
      zoneName = 'Maluku, NTT & Papua';
      if (courier === 'jnt') cost = weightKg * 78000;
      else if (courier === 'pos') cost = weightKg * 58000;
      else if (courier === 'kargo') cost = weightKg <= 5 ? 110000 : 110000 + (weightKg - 5) * 14000;
    }
    // Default fallback jika belum pilih provinsi
    else {
      zoneName = 'Tarif Estimasi (Pilih Provinsi)';
      if (courier === 'jnt') cost = weightKg * 14000;
      else if (courier === 'pos') cost = weightKg * 11000;
      else if (courier === 'kargo') cost = weightKg <= 5 ? 28000 : 28000 + (weightKg - 5) * 3500;
    }
  } else {
    // INTERNATIONAL / MANCANEGARA
    const country = countrySelect ? countrySelect.value : 'MY';
    if (['MY', 'SG', 'BN'].includes(country)) {
      zoneName = 'Asia Tenggara (Malaysia / SG / Brunei)';
      if (courier === 'ems') cost = weightKg * 125000;
      else cost = weightKg * 260000;
    } else if (['SA', 'AE', 'QA', 'EG'].includes(country)) {
      zoneName = 'Timur Tengah & Afrika (Saudi / UAE / Mesir)';
      if (courier === 'ems') cost = weightKg * 230000;
      else cost = weightKg * 420000;
    } else if (['TW', 'HK', 'JP', 'KR'].includes(country)) {
      zoneName = 'Asia Timur (Taiwan / HK / Jepang / Korea)';
      if (courier === 'ems') cost = weightKg * 185000;
      else cost = weightKg * 350000;
    } else {
      zoneName = 'Internasional (Australia / Eropa / AS)';
      if (courier === 'ems') cost = weightKg * 310000;
      else cost = weightKg * 520000;
    }
  }

  return { zoneName, cost };
}

// ==========================================================================
// ORDER MODAL & INITIALIZATION
// ==========================================================================
function initOrderModal() {
  const backdrop = document.getElementById('orderModalBackdrop');
  const navBtn = document.getElementById('navOrderBtn');
  const closeBtn = document.getElementById('btnCloseOrderModal');
  const productSelect = document.getElementById('modalProductSelect');
  const qtyInput = document.getElementById('modalOrderQty');
  const courierSelect = document.getElementById('modalCourier');
  const courierIntlSelect = document.getElementById('modalCourierIntl');
  const countrySelect = document.getElementById('modalCountry');
  const btnAll = document.getElementById('btnAllProducts');

  // Wilayah select elements
  const provSelect = document.getElementById('modalProvince');
  const regSelect = document.getElementById('modalRegency');
  const distSelect = document.getElementById('modalDistrict');
  const villSelect = document.getElementById('modalVillage');

  if (navBtn) {
    navBtn.addEventListener('click', () => {
      loadProvinces();
      if (provSelect && provSelect.value && regSelect && (!regSelect.options || regSelect.options.length <= 1)) {
        loadRegencies(provSelect.value);
      }
      backdrop.classList.add('open');
      calculateModalTotal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      backdrop.classList.remove('open');
    });
  }

  if (btnAll) {
    btnAll.addEventListener('click', () => {
      openCatalogModal();
    });
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      backdrop.classList.remove('open');
    }
  });

  // Event listeners for recalculation
  if (productSelect) productSelect.addEventListener('change', calculateModalTotal);
  if (qtyInput) qtyInput.addEventListener('input', calculateModalTotal);
  if (courierSelect) courierSelect.addEventListener('change', calculateModalTotal);
  if (courierIntlSelect) courierIntlSelect.addEventListener('change', calculateModalTotal);
  if (countrySelect) countrySelect.addEventListener('change', calculateModalTotal);

  // Cascading dropdown listeners
  if (provSelect) {
    provSelect.addEventListener('change', (e) => {
      loadRegencies(e.target.value);
    });
  }

  if (regSelect) {
    regSelect.addEventListener('change', (e) => {
      loadDistricts(e.target.value);
    });
  }

  if (distSelect) {
    distSelect.addEventListener('change', (e) => {
      loadVillages(e.target.value);
    });
  }

  if (villSelect) {
    villSelect.addEventListener('change', () => {
      calculateModalTotal();
    });
  }

  // Initial load of Indonesian provinces & pre-load regencies if default province selected
  loadProvinces();
  if (provSelect && provSelect.value) {
    loadRegencies(provSelect.value);
  }

  // WhatsApp Checkout Confirmation Button
  const btnConfirm = document.getElementById('btnConfirmWhatsApp');
  if (btnConfirm) {
    btnConfirm.addEventListener('click', submitWhatsAppOrder);
  }
}

window.openOrderModal = function(productId, productName, price) {
  const backdrop = document.getElementById('orderModalBackdrop');
  const productSelect = document.getElementById('modalProductSelect');
  const provSelect = document.getElementById('modalProvince');
  const regSelect = document.getElementById('modalRegency');

  if (productSelect && productId) {
    for (let i = 0; i < productSelect.options.length; i++) {
      if (productSelect.options[i].value === productId) {
        productSelect.selectedIndex = i;
        break;
      }
    }
  }

  loadProvinces();
  if (provSelect && provSelect.value && regSelect && (!regSelect.options || regSelect.options.length <= 1)) {
    loadRegencies(provSelect.value);
  }

  calculateModalTotal();
  if (backdrop) backdrop.classList.add('open');
};

function calculateModalTotal() {
  const productSelect = document.getElementById('modalProductSelect');
  const qtyInput = document.getElementById('modalOrderQty');
  const courierSelect = document.getElementById('modalCourier');
  const courierIntlSelect = document.getElementById('modalCourierIntl');

  if (!productSelect || !qtyInput) return;

  const selectedOpt = productSelect.options[productSelect.selectedIndex];
  const prodId = selectedOpt ? selectedOpt.value : 'QOS-MTQ-A5';
  const unitPrice = parseInt(selectedOpt ? selectedOpt.getAttribute('data-price') : 65000) || 65000;
  const qty = Math.max(1, parseInt(qtyInput.value) || 1);

  // Berat produk
  const foundProd = CATALOG_PRODUCTS.find(p => p.id === prodId);
  const unitWeight = foundProd && foundProd.weight ? foundProd.weight : (PRODUCT_WEIGHTS[prodId] || 0.65);
  const totalActualWeight = unitWeight * qty;
  const chargeableWeight = Math.max(1, Math.ceil(totalActualWeight));

  // Kurir terpilih berdasarkan scope
  let activeCourier = 'jnt';
  let courierLabel = 'J&T Express Kilat';
  if (currentDestScope === 'domestic') {
    if (courierSelect) {
      activeCourier = courierSelect.value;
      courierLabel = courierSelect.options[courierSelect.selectedIndex].text;
    }
  } else {
    if (courierIntlSelect) {
      activeCourier = courierIntlSelect.value;
      courierLabel = courierIntlSelect.options[courierIntlSelect.selectedIndex].text;
    }
  }

  // Hitung ongkir otomatis
  const rateInfo = getShippingRateInfo(currentDestScope, activeCourier, chargeableWeight);
  const shippingCost = rateInfo.cost;
  const packagingFee = 2000;

  const subtotal = unitPrice * qty;
  const total = subtotal + shippingCost + packagingFee;

  // Update UI Elements
  const unitPriceEl = document.getElementById('modalUnitPriceText');
  if (unitPriceEl) unitPriceEl.innerText = 'Rp ' + unitPrice.toLocaleString('id-ID');

  const qtySummaryEl = document.getElementById('modalSummaryQtyText');
  if (qtySummaryEl) qtySummaryEl.innerText = qty + ' mushaf';

  const subtotalEl = document.getElementById('modalSubtotalText');
  if (subtotalEl) subtotalEl.innerText = 'Rp ' + subtotal.toLocaleString('id-ID');

  const weightEl = document.getElementById('modalWeightText');
  if (weightEl) {
    weightEl.innerText = `${totalActualWeight.toFixed(2)} kg (dihitung ${chargeableWeight} kg)`;
  }

  const zoneEl = document.getElementById('modalZoneText');
  if (zoneEl) {
    zoneEl.innerText = rateInfo.zoneName;
  }

  const shippingEl = document.getElementById('modalShippingText');
  if (shippingEl) {
    shippingEl.innerText = 'Rp ' + shippingCost.toLocaleString('id-ID');
  }

  const totalEl = document.getElementById('modalTotalText');
  if (totalEl) totalEl.innerText = 'Rp ' + total.toLocaleString('id-ID');

  return {
    unitPrice,
    qty,
    unitWeight,
    totalActualWeight,
    chargeableWeight,
    subtotal,
    shippingCost,
    packagingFee,
    total,
    zoneName: rateInfo.zoneName,
    courierLabel,
    productName: selectedOpt ? selectedOpt.text : 'Mushaf Al-Qur\'an'
  };
}

function submitWhatsAppOrder() {
  const data = calculateModalTotal();
  if (!data) return;

  const name = document.getElementById('modalCustomerName').value.trim();
  const wa = document.getElementById('modalCustomerWa').value.trim();
  const color = document.getElementById('modalCoverColor').value;

  if (!name || !wa) {
    alert('Mohon isi Nama Lengkap dan Nomor WhatsApp terlebih dahulu.');
    return;
  }

  let addressSummary = '';

  if (currentDestScope === 'domestic') {
    const provSelect = document.getElementById('modalProvince');
    const regSelect = document.getElementById('modalRegency');
    const distSelect = document.getElementById('modalDistrict');
    const villSelect = document.getElementById('modalVillage');
    const postalCode = document.getElementById('modalPostalCode').value.trim();
    const streetAddress = document.getElementById('modalStreetAddress').value.trim();

    const provName = provSelect && provSelect.selectedIndex > 0 ? provSelect.options[provSelect.selectedIndex].text : '';
    const regName = regSelect && regSelect.selectedIndex > 0 ? regSelect.options[regSelect.selectedIndex].text : '';
    const distName = distSelect && distSelect.selectedIndex > 0 ? distSelect.options[distSelect.selectedIndex].text : '';
    const villName = villSelect && villSelect.selectedIndex > 0 ? villSelect.options[villSelect.selectedIndex].text : '';

    if (!provName || !regName || !streetAddress) {
      alert('Mohon pilih Provinsi, Kabupaten/Kota, dan isi Detail Alamat Jalan pengiriman Anda.');
      return;
    }

    addressSummary = 
`🇮🇩 *Tujuan:* Domestik (Indonesia)
🏛️ *Provinsi:* ${provName}
🏙️ *Kabupaten / Kota:* ${regName}
🏘️ *Kecamatan:* ${distName}
🏡 *Desa / Kelurahan:* ${villName}
📮 *Kode Pos / RT-RW:* ${postalCode || '-'}
📍 *Detail Alamat Lengkap:* ${streetAddress}`;

  } else {
    // International
    const countrySelect = document.getElementById('modalCountry');
    const countryName = countrySelect.options[countrySelect.selectedIndex].text;
    const state = document.getElementById('modalIntlState').value.trim();
    const city = document.getElementById('modalIntlCity').value.trim();
    const zip = document.getElementById('modalIntlZip').value.trim();
    const intlStreet = document.getElementById('modalIntlStreet').value.trim();

    if (!state || !city || !zip || !intlStreet) {
      alert('Mohon lengkapi State/Provinsi, Kota, Zip Code, dan Detail Alamat Jalan di Mancanegara.');
      return;
    }

    addressSummary = 
`🌍 *Tujuan:* Mancanegara (Luar Negeri)
🌐 *Negara Tujuan:* ${countryName}
🏛️ *State / Provinsi Bagian:* ${state}
🏙️ *Kota / District:* ${city}
📮 *Postal / Zip Code:* ${zip}
📍 *Alamat Lengkap:* ${intlStreet}`;
  }

  const orderId = 'ALB-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

  const message = 
`*ASSALAMU'ALAIKUM ADMIN TOKO AL-IBRIEZ BOOK*
Saya ingin mengonfirmasi pemesanan Al-Qur'an dengan rincian berikut:

📋 *Order ID:* ${orderId}
📖 *Produk:* ${data.productName}
🏷️ *Harga Satuan:* Rp ${data.unitPrice.toLocaleString('id-ID')}
🎨 *Pilihan Cover:* ${color}
🔢 *Jumlah (Qty):* ${data.qty} mushaf
⚖️ *Berat Paket:* ${data.totalActualWeight.toFixed(2)} kg (dihitung ${data.chargeableWeight} kg)
💵 *Subtotal Produk:* Rp ${data.subtotal.toLocaleString('id-ID')} (${data.qty} x Rp ${data.unitPrice.toLocaleString('id-ID')})

🚚 *Ekspedisi:* ${data.courierLabel}
🌏 *Zona Tujuan:* ${data.zoneName}
💰 *Ongkos Kirim Otomatis:* Rp ${data.shippingCost.toLocaleString('id-ID')}
📦 *Packing Aman & Asuransi:* Rp 2.000
💳 *TOTAL PEMBAYARAN:* Rp ${data.total.toLocaleString('id-ID')}

👤 *Nama Pemesan:* ${name}
📱 *No. WhatsApp:* ${wa}
${addressSummary}

🏦 *Pilihan Rekening Toko Al-Ibriez Book:*
- BSI: 7188 2993 01 (a.n Toko Al-Ibriez Book)
- BCA: 8930 4928 11 (a.n Toko Al-Ibriez Book)

Mohon konfirmasi ketersediaan stok & panduan nomor resi pengiriman dari Kantor Cirebon / Bandung. Terima kasih!`;

  const encodedMsg = encodeURIComponent(message);
  const waUrl = `https://wa.me/6282229489062?text=${encodedMsg}`;

  window.open(waUrl, '_blank');
}

// ==========================================================================
// CLIPBOARD COPY HELPER & TOAST
// ==========================================================================
window.copyText = function(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Nomor rekening ' + text + ' berhasil disalin!');
    });
  } else {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('Nomor rekening ' + text + ' berhasil disalin!');
  }
};

function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.innerText = msg;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// ==========================================================================
// RENDER HOMEPAGE PRODUCTS GRID
// ==========================================================================
function renderProductsGrid() {
  const container = document.getElementById('productsGridContainer');
  if (!container) return;

  container.innerHTML = CATALOG_PRODUCTS.map(p => {
    const badgeHtml = p.badge ? `<span class="product-card-badge ${p.badge.toLowerCase().includes('tilawah') ? 'gold' : ''}">${p.badge}</span>` : '';
    const oldPriceHtml = p.oldPrice ? `<span>Rp ${p.oldPrice.toLocaleString('id-ID')}</span>` : '';
    const safeName = p.name.replace(/'/g, "\\'");
    const imgSrc = p.image || 'assets/prod-nonterjemah.svg';

    return `
      <div class="product-card-item" data-product-id="${p.id}">
        ${badgeHtml}
        <div class="product-card-img-wrap">
          <img src="${imgSrc}" alt="${p.name}" onerror="this.src='assets/prod-nonterjemah.svg'">
        </div>
        <h3 class="product-card-title">${p.name}</h3>
        <p class="product-card-desc">${p.desc}</p>
        <div class="product-card-price">Rp ${p.price.toLocaleString('id-ID')} ${oldPriceHtml}</div>
        <button class="btn-card-order" onclick="openOrderModal('${p.id}', '${safeName}', ${p.price})">
          Pesan Sekarang
        </button>
      </div>
    `;
  }).join('');
}

// Update order modal dropdown options to sync with CATALOG_PRODUCTS
function updateOrderModalOptions() {
  const productSelect = document.getElementById('modalProductSelect');
  if (!productSelect) return;

  const currentVal = productSelect.value;
  productSelect.innerHTML = CATALOG_PRODUCTS.map((p, idx) => {
    return `<option value="${p.id}" data-price="${p.price}" ${idx === 0 ? 'selected' : ''}>${p.name} (Rp ${p.price.toLocaleString('id-ID')})</option>`;
  }).join('');

  if (currentVal && CATALOG_PRODUCTS.some(p => p.id === currentVal)) {
    productSelect.value = currentVal;
  }
}

// ==========================================================================
// 8. KATALOG LENGKAP MODAL LOGIC
// ==========================================================================
let activeCatalogCategory = 'ALL';

function initCatalogModal() {
  const backdrop = document.getElementById('catalogModalBackdrop');
  const closeBtn = document.getElementById('btnCloseCatalogModal');
  const searchInput = document.getElementById('catalogSearchInput');
  const tabsWrap = document.getElementById('catalogFilterTabs');

  if (closeBtn && backdrop) {
    closeBtn.addEventListener('click', () => {
      backdrop.classList.remove('open');
    });
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('open');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderCatalogItems();
    });
  }

  if (tabsWrap) {
    tabsWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.catalog-tab-btn');
      if (!btn) return;
      tabsWrap.querySelectorAll('.catalog-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCatalogCategory = btn.getAttribute('data-category') || 'ALL';
      renderCatalogItems();
    });
  }
}

window.openCatalogModal = function(initialCategory = 'ALL') {
  activeCatalogCategory = initialCategory;
  const backdrop = document.getElementById('catalogModalBackdrop');
  const searchInput = document.getElementById('catalogSearchInput');
  const tabsWrap = document.getElementById('catalogFilterTabs');

  if (searchInput) searchInput.value = '';

  if (tabsWrap) {
    tabsWrap.querySelectorAll('.catalog-tab-btn').forEach(b => {
      if (b.getAttribute('data-category') === activeCatalogCategory) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
  }

  renderCatalogItems();
  if (backdrop) backdrop.classList.add('open');
};

function renderCatalogItems() {
  const grid = document.getElementById('catalogItemsGrid');
  const countSpan = document.getElementById('catCountAll');
  const searchInput = document.getElementById('catalogSearchInput');
  if (!grid) return;

  if (countSpan) countSpan.textContent = CATALOG_PRODUCTS.length;

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const filtered = CATALOG_PRODUCTS.filter(p => {
    const matchCat = (activeCatalogCategory === 'ALL') || 
                     (p.category && p.category.toLowerCase() === activeCatalogCategory.toLowerCase());
    const matchQuery = !query || 
                       p.name.toLowerCase().includes(query) || 
                       (p.desc && p.desc.toLowerCase().includes(query)) ||
                       (p.category && p.category.toLowerCase().includes(query));
    return matchCat && matchQuery;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; color: #64748b;">
        <svg style="width:48px; height:48px; fill:#94a3b8; margin-bottom:12px;" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <p style="font-weight:700; font-size:1rem; color:#1e293b; margin-bottom:4px;">Tidak ada produk yang cocok</p>
        <span style="font-size:0.84rem;">Coba cari dengan kata kunci lain atau pilih kategori berbeda.</span>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const badgeHtml = p.badge ? `<span class="catalog-card-badge">${p.badge}</span>` : '';
    const oldPriceHtml = p.oldPrice ? `<span class="catalog-card-old-price">Rp ${p.oldPrice.toLocaleString('id-ID')}</span>` : '';
    const safeName = p.name.replace(/'/g, "\\'");
    const imgSrc = p.image || 'assets/prod-nonterjemah.svg';

    return `
      <div class="catalog-card-item">
        ${badgeHtml}
        <div class="catalog-card-img-wrap">
          <img src="${imgSrc}" alt="${p.name}" onerror="this.src='assets/prod-nonterjemah.svg'">
        </div>
        <span class="catalog-card-cat">${p.category || 'Al-Qur\'an'}</span>
        <h4 class="catalog-card-name">${p.name}</h4>
        <p class="catalog-card-desc">${p.desc || ''}</p>
        <div class="catalog-card-price-row">
          <span class="catalog-card-price">Rp ${p.price.toLocaleString('id-ID')}</span>
          ${oldPriceHtml}
        </div>
        <button type="button" class="btn-catalog-order" onclick="selectFromCatalog('${p.id}', '${safeName}', ${p.price})">
          <svg style="width:14px;height:14px;fill:currentColor;" viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"/></svg>
          <span>Pesan Produk</span>
        </button>
      </div>
    `;
  }).join('');
}

window.selectFromCatalog = function(id, name, price) {
  const backdrop = document.getElementById('catalogModalBackdrop');
  if (backdrop) backdrop.classList.remove('open');
  openOrderModal(id, name, price);
};

// ==========================================================================
// 9. ADMIN AUTH (LOGIN PIN) & DASHBOARD CONTROLLER
// ==========================================================================
const DEFAULT_ADMIN_PIN = '123456';

function getAdminPin() {
  return localStorage.getItem('alibriez_admin_pin') || DEFAULT_ADMIN_PIN;
}

function setAdminPin(newPin) {
  localStorage.setItem('alibriez_admin_pin', newPin);
}

function initAdminDashboard() {
  const navAdminBtn = document.getElementById('navAdminBtn');
  const authBackdrop = document.getElementById('adminAuthModalBackdrop');
  const closeAuthBtn = document.getElementById('btnCloseAdminAuthModal');
  const btnSubmitPin = document.getElementById('btnSubmitPin');
  const pinInputs = document.querySelectorAll('#pinInputsWrap .pin-box');
  const pinErrorMsg = document.getElementById('pinErrorMsg');

  // Dashboard modal elements
  const dashBackdrop = document.getElementById('adminDashboardBackdrop');
  const closeDashBtn = document.getElementById('btnCloseAdminDash');
  const logoutBtn = document.getElementById('btnAdminLogout');
  const searchInput = document.getElementById('adminSearchInput');
  const btnReset = document.getElementById('btnResetDefaultProducts');
  const btnOpenAdd = document.getElementById('btnOpenAddProduct');

  // Change PIN modal elements
  const btnOpenChangePin = document.getElementById('btnOpenChangePin');
  const pinChangeBackdrop = document.getElementById('adminPinChangeBackdrop');
  const closePinChangeBtn = document.getElementById('btnCloseChangePinModal');
  const changePinForm = document.getElementById('changePinForm');

  // Product Form modal elements
  const formBackdrop = document.getElementById('adminFormModalBackdrop');
  const closeFormBtn = document.getElementById('btnCloseAdminFormModal');
  const cancelFormBtn = document.getElementById('btnCancelProductForm');
  const productForm = document.getElementById('adminProductForm');
  const imgFileInput = document.getElementById('prodFormImageFile');
  const imgUrlInput = document.getElementById('prodFormImageUrl');
  const imgPreview = document.getElementById('adminImgPreview');

  // Open PIN Modal
  if (navAdminBtn) {
    navAdminBtn.addEventListener('click', () => {
      // Check session
      if (sessionStorage.getItem('alibriez_admin_logged') === 'true') {
        openAdminDashboard();
      } else {
        openAdminAuthModal();
      }
    });
  }

  if (closeAuthBtn) {
    closeAuthBtn.addEventListener('click', () => {
      authBackdrop.classList.remove('open');
    });
  }

  // Handle PIN box inputs auto-focus behavior
  pinInputs.forEach((input, idx) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val.length === 1 && idx < pinInputs.length - 1) {
        pinInputs[idx + 1].focus();
      }
      if (idx === pinInputs.length - 1 && val.length === 1) {
        verifyAdminPin();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        pinInputs[idx - 1].focus();
      }
      if (e.key === 'Enter') {
        verifyAdminPin();
      }
    });
  });

  if (btnSubmitPin) {
    btnSubmitPin.addEventListener('click', verifyAdminPin);
  }

  function openAdminAuthModal() {
    pinInputs.forEach(i => i.value = '');
    if (pinErrorMsg) pinErrorMsg.style.display = 'none';
    if (authBackdrop) authBackdrop.classList.add('open');
    setTimeout(() => {
      if (pinInputs[0]) pinInputs[0].focus();
    }, 200);
  }

  function verifyAdminPin() {
    let entered = '';
    pinInputs.forEach(i => entered += i.value);
    const validPin = getAdminPin();

    if (entered === validPin) {
      sessionStorage.setItem('alibriez_admin_logged', 'true');
      if (authBackdrop) authBackdrop.classList.remove('open');
      showToast('Login Admin Berhasil!');
      openAdminDashboard();
    } else {
      if (pinErrorMsg) pinErrorMsg.style.display = 'block';
      pinInputs.forEach(i => i.value = '');
      if (pinInputs[0]) pinInputs[0].focus();
    }
  }

  function openAdminDashboard() {
    renderAdminProductsTable();
    updateAdminStats();
    if (dashBackdrop) dashBackdrop.classList.add('open');
  }

  if (closeDashBtn) {
    closeDashBtn.addEventListener('click', () => {
      dashBackdrop.classList.remove('open');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('alibriez_admin_logged');
      dashBackdrop.classList.remove('open');
      showToast('Telah keluar dari Admin.');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderAdminProductsTable(searchInput.value);
    });
  }

  // Reset to default products
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Kembalikan semua produk ke daftar awal bawaan sistem? Perubahan yang Anda buat sebelumnya akan digantikan.')) {
        CATALOG_PRODUCTS = JSON.parse(JSON.stringify(DEFAULT_CATALOG_PRODUCTS));
        saveStoredProducts(CATALOG_PRODUCTS);
        renderProductsGrid();
        updateOrderModalOptions();
        renderAdminProductsTable();
        updateAdminStats();
        showToast('Data produk berhasil direset ke setelan awal!');
      }
    });
  }

  // Open Add Product Form
  if (btnOpenAdd) {
    btnOpenAdd.addEventListener('click', () => {
      openProductForm();
    });
  }

  // Close Form
  if (closeFormBtn) closeFormBtn.addEventListener('click', () => formBackdrop.classList.remove('open'));
  if (cancelFormBtn) cancelFormBtn.addEventListener('click', () => formBackdrop.classList.remove('open'));

  // Image Upload handler (Base64 file or direct URL)
  if (imgFileInput) {
    imgFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          if (imgPreview) imgPreview.src = evt.target.result;
          if (imgUrlInput) imgUrlInput.value = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (imgUrlInput) {
    imgUrlInput.addEventListener('input', () => {
      if (imgPreview && imgUrlInput.value.trim()) {
        imgPreview.src = imgUrlInput.value.trim();
      }
    });
  }

  // Save Product Form
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProductFormData();
    });
  }

  // Change PIN Dialog handlers
  if (btnOpenChangePin) {
    btnOpenChangePin.addEventListener('click', () => {
      if (changePinForm) changePinForm.reset();
      const alertBox = document.getElementById('changePinAlert');
      if (alertBox) alertBox.style.display = 'none';
      if (pinChangeBackdrop) pinChangeBackdrop.classList.add('open');
    });
  }

  if (closePinChangeBtn) {
    closePinChangeBtn.addEventListener('click', () => {
      pinChangeBackdrop.classList.remove('open');
    });
  }

  if (changePinForm) {
    changePinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const oldPin = document.getElementById('oldPinInput').value.trim();
      const newPin = document.getElementById('newPinInput').value.trim();
      const confirmPin = document.getElementById('confirmPinInput').value.trim();
      const alertBox = document.getElementById('changePinAlert');

      if (oldPin !== getAdminPin()) {
        alertBox.style.display = 'block';
        alertBox.style.color = '#dc2626';
        alertBox.textContent = 'PIN Lama tidak cocok!';
        return;
      }

      if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
        alertBox.style.display = 'block';
        alertBox.style.color = '#dc2626';
        alertBox.textContent = 'PIN Baru harus terdiri dari 6 angka!';
        return;
      }

      if (newPin !== confirmPin) {
        alertBox.style.display = 'block';
        alertBox.style.color = '#dc2626';
        alertBox.textContent = 'Konfirmasi PIN Baru tidak sama!';
        return;
      }

      setAdminPin(newPin);
      alertBox.style.display = 'block';
      alertBox.style.color = '#15803d';
      alertBox.textContent = 'PIN Berhasil diubah!';
      setTimeout(() => {
        pinChangeBackdrop.classList.remove('open');
        showToast('PIN Admin berhasil diperbarui!');
      }, 1000);
    });
  }
}

window.setFormPresetImage = function(src) {
  const imgPreview = document.getElementById('adminImgPreview');
  const imgUrlInput = document.getElementById('prodFormImageUrl');
  if (imgPreview) imgPreview.src = src;
  if (imgUrlInput) imgUrlInput.value = src;
};

function openProductForm(editProdId = null) {
  const formBackdrop = document.getElementById('adminFormModalBackdrop');
  const modalTitle = document.getElementById('adminFormModalTitle');
  const form = document.getElementById('adminProductForm');
  const imgPreview = document.getElementById('adminImgPreview');
  const idInput = document.getElementById('prodFormId');
  const nameInput = document.getElementById('prodFormName');
  const catInput = document.getElementById('prodFormCategory');
  const priceInput = document.getElementById('prodFormPrice');
  const oldPriceInput = document.getElementById('prodFormOldPrice');
  const badgeInput = document.getElementById('prodFormBadge');
  const weightInput = document.getElementById('prodFormWeight');
  const imgUrlInput = document.getElementById('prodFormImageUrl');
  const descInput = document.getElementById('prodFormDesc');
  const fileInput = document.getElementById('prodFormImageFile');

  if (!form || !formBackdrop) return;
  form.reset();
  if (fileInput) fileInput.value = '';

  if (editProdId) {
    const prod = CATALOG_PRODUCTS.find(p => p.id === editProdId);
    if (!prod) return;
    modalTitle.textContent = 'Edit Produk: ' + prod.name;
    idInput.value = prod.id;
    nameInput.value = prod.name;
    catInput.value = prod.category || 'Tilawah';
    priceInput.value = prod.price || '';
    oldPriceInput.value = prod.oldPrice || '';
    badgeInput.value = prod.badge || '';
    weightInput.value = prod.weight || 0.65;
    descInput.value = prod.desc || '';
    imgUrlInput.value = prod.image || 'assets/prod-nonterjemah.svg';
    if (imgPreview) imgPreview.src = prod.image || 'assets/prod-nonterjemah.svg';
  } else {
    modalTitle.textContent = 'Tambah Produk Baru';
    idInput.value = '';
    weightInput.value = 0.65;
    imgUrlInput.value = 'assets/prod-nonterjemah.svg';
    if (imgPreview) imgPreview.src = 'assets/prod-nonterjemah.svg';
  }

  formBackdrop.classList.add('open');
}

function saveProductFormData() {
  const formBackdrop = document.getElementById('adminFormModalBackdrop');
  const id = document.getElementById('prodFormId').value.trim();
  const name = document.getElementById('prodFormName').value.trim();
  const category = document.getElementById('prodFormCategory').value;
  const price = parseInt(document.getElementById('prodFormPrice').value) || 0;
  const oldPriceVal = document.getElementById('prodFormOldPrice').value.trim();
  const oldPrice = oldPriceVal ? parseInt(oldPriceVal) : undefined;
  const badge = document.getElementById('prodFormBadge').value.trim();
  const weight = parseFloat(document.getElementById('prodFormWeight').value) || 0.65;
  const image = document.getElementById('prodFormImageUrl').value.trim() || 'assets/prod-nonterjemah.svg';
  const desc = document.getElementById('prodFormDesc').value.trim();

  if (!name || price <= 0 || !desc) {
    alert('Mohon isi nama, harga jual, dan deskripsi produk.');
    return;
  }

  if (id) {
    // EDIT EXISTING
    const index = CATALOG_PRODUCTS.findIndex(p => p.id === id);
    if (index !== -1) {
      CATALOG_PRODUCTS[index] = {
        ...CATALOG_PRODUCTS[index],
        name,
        category,
        price,
        oldPrice,
        badge,
        weight,
        image,
        desc
      };
      showToast('Produk ' + name + ' berhasil diperbarui!');
    }
  } else {
    // ADD NEW PRODUCT
    const newId = 'PROD-' + Date.now().toString(36).toUpperCase();
    const newProduct = {
      id: newId,
      name,
      category,
      price,
      oldPrice,
      badge,
      weight,
      image,
      desc
    };
    CATALOG_PRODUCTS.unshift(newProduct);
    showToast('Produk baru berhasil ditambahkan!');
  }

  saveStoredProducts(CATALOG_PRODUCTS);
  renderProductsGrid();
  updateOrderModalOptions();
  renderAdminProductsTable();
  updateAdminStats();

  if (formBackdrop) formBackdrop.classList.remove('open');
}

window.deleteProduct = function(prodId) {
  const prod = CATALOG_PRODUCTS.find(p => p.id === prodId);
  if (!prod) return;

  if (confirm(`Apakah Anda yakin ingin menghapus produk "${prod.name}"?`)) {
    CATALOG_PRODUCTS = CATALOG_PRODUCTS.filter(p => p.id !== prodId);
    saveStoredProducts(CATALOG_PRODUCTS);
    renderProductsGrid();
    updateOrderModalOptions();
    renderAdminProductsTable();
    updateAdminStats();
    showToast(`Produk "${prod.name}" telah dihapus.`);
  }
};

window.editProduct = function(prodId) {
  openProductForm(prodId);
};

function renderAdminProductsTable(filterQuery = '') {
  const tbody = document.getElementById('adminProductsTableBody');
  if (!tbody) return;

  const q = filterQuery.trim().toLowerCase();
  const list = CATALOG_PRODUCTS.filter(p => {
    return !q || 
      p.name.toLowerCase().includes(q) || 
      p.id.toLowerCase().includes(q) || 
      (p.category && p.category.toLowerCase().includes(q));
  });

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:32px; color:#64748b;">
          Tidak ada produk yang ditemukan.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(p => {
    const imgSrc = p.image || 'assets/prod-nonterjemah.svg';
    const oldPriceHtml = p.oldPrice ? `<div class="admin-table-old-price">Rp ${p.oldPrice.toLocaleString('id-ID')}</div>` : '';
    const badgeText = p.badge ? `<span style="font-size:0.7rem; font-weight:700; color:#047857; background:#dcfce7; padding:2px 6px; border-radius:4px;">${p.badge}</span>` : '<span style="color:#94a3b8;">-</span>';
    const weightText = (p.weight || 0.65) + ' kg';

    return `
      <tr>
        <td>
          <div class="admin-table-thumb">
            <img src="${imgSrc}" alt="${p.name}" onerror="this.src='assets/prod-nonterjemah.svg'">
          </div>
        </td>
        <td>
          <div class="admin-table-title">${p.name}</div>
          <div class="admin-table-desc">${p.desc || ''}</div>
          <span style="font-size:0.68rem; color:#94a3b8; font-family:monospace;">ID: ${p.id}</span>
        </td>
        <td>
          <span class="admin-table-cat-badge">${p.category || 'Umum'}</span>
        </td>
        <td>
          <div class="admin-table-price">Rp ${p.price.toLocaleString('id-ID')}</div>
          ${oldPriceHtml}
        </td>
        <td>${badgeText}</td>
        <td><span style="font-size:0.75rem; font-weight:600; color:#475569;">${weightText}</span></td>
        <td>
          <div class="admin-table-actions">
            <button type="button" class="btn-action-edit" onclick="editProduct('${p.id}')">Edit</button>
            <button type="button" class="btn-action-delete" onclick="deleteProduct('${p.id}')">Hapus</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function updateAdminStats() {
  const statTotal = document.getElementById('statTotalProducts');
  const statCats = document.getElementById('statTotalCategories');
  const statMin = document.getElementById('statMinPrice');
  const statMax = document.getElementById('statMaxPrice');

  if (!statTotal) return;

  statTotal.textContent = CATALOG_PRODUCTS.length;

  const categories = new Set(CATALOG_PRODUCTS.map(p => p.category).filter(Boolean));
  if (statCats) statCats.textContent = categories.size;

  if (CATALOG_PRODUCTS.length > 0) {
    const prices = CATALOG_PRODUCTS.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (statMin) statMin.textContent = 'Rp ' + min.toLocaleString('id-ID');
    if (statMax) statMax.textContent = 'Rp ' + max.toLocaleString('id-ID');
  } else {
    if (statMin) statMin.textContent = 'Rp 0';
    if (statMax) statMax.textContent = 'Rp 0';
  }
}
