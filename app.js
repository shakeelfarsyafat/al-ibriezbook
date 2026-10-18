/**
 * ============================================================================
 * AL-IBRIEZ BOOK - INTERACTIVE LOGIC & ORDER ENGINE
 * Official Store: Al-Qur'an Al-Muttaqin (Penerbit Al-Qosbah)
 * ============================================================================
 */

// 1. PRODUCTS DATA
const CATALOG_PRODUCTS = [
  {
    id: 'QOS-HAFALAN',
    name: 'Al-Qur\'an Untuk Hafalan',
    price: 75000,
    desc: '5 blok warna hafalan per-halaman, panduan pengingat awal ayat.',
    badge: 'BEST SELLER',
    category: 'Hafalan'
  },
  {
    id: 'QOS-TERJEMAH',
    name: 'Al-Qur\'an Dengan Terjemah',
    price: 88000,
    desc: 'Terjemahan lengkap Kemenag RI, asbabun nuzul & indeks tematik.',
    category: 'Terjemah'
  },
  {
    id: 'QOS-MTQ-A5',
    name: 'Al-Qur\'an Non Terjemah (Al-Muttaqin A5)',
    price: 65000,
    desc: 'Mushaf Al-Muttaqin: Tajwid Multikode warna, panduan Waqaf & Ibtida\'.',
    badge: 'TILAWAH UTAMA',
    category: 'Tilawah'
  },
  {
    id: 'QOS-MTQ-A4',
    name: 'Al-Qur\'an Non Terjemah (Al-Muttaqin A4 Jumbo)',
    price: 99000,
    desc: 'Mushaf Al-Muttaqin ukuran besar, huruf ekstra besar ramah lansia.',
    category: 'Tilawah'
  },
  {
    id: 'QOS-TAFSIR',
    name: 'Al-Qur\'an Dengan Tafsir Tematik',
    price: 115000,
    desc: 'Kompilasi tafsir mu\'tabar berdasar tema aqidah, syariah, akhlak.',
    category: 'Tafsir'
  },
  {
    id: 'QOS-JAKET',
    name: 'Al-Qur\'an Dengan Cover Jaket',
    price: 95000,
    desc: 'Sampul resleting kulit sintetis lux tahan percikan air.',
    category: 'Cover Kulit'
  },
  {
    id: 'QOS-BUKU',
    name: 'Buku Bacaan & Panduan Tajwid',
    price: 45000,
    desc: 'Buku tajwid praktis, makhorijul huruf bergambar & doa harian.',
    category: 'Buku'
  }
];

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

document.addEventListener('DOMContentLoaded', () => {
  initNavbarSearch();
  initTajwidDemo();
  initOrderModal();
});

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
// TAJWID & WAQAF INTERACTIVE DEMO
// ==========================================================================
function initTajwidDemo() {
  const chips = document.querySelectorAll('.tajwid-chip-btn');
  const explanationBox = document.getElementById('sampleExplanationBox');
  const ayahBox = document.getElementById('sampleAyahBox');

  if (!chips.length || !explanationBox) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const ruleKey = chip.getAttribute('data-rule');
      const rule = TAJWID_RULES[ruleKey];
      if (rule) {
        explanationBox.innerHTML = `<strong>${rule.title}:</strong> ${rule.text}`;
      }

      // Pulse highlight in Arabic text
      const targetClass = ruleKey === 'waqaf' ? '.tj-waqaf' :
                          ruleKey === 'ibtida' ? '.tj-ibtida' :
                          `.tj-${ruleKey}`;
      
      const elements = ayahBox.querySelectorAll(targetClass);
      elements.forEach(el => {
        el.style.transition = 'all 0.3s ease';
        el.style.transform = 'scale(1.15)';
        el.style.display = 'inline-block';
        setTimeout(() => {
          el.style.transform = 'scale(1)';
        }, 400);
      });
    });
  });
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

async function loadProvinces() {
  const provSelect = document.getElementById('modalProvince');
  const spinner = document.getElementById('spinnerProvince');
  if (!provSelect) return;

  if (spinner) spinner.style.display = 'inline-block';
  try {
    let data = regionCache.provinces;
    if (!data) {
      const res = await fetch(`${API_BASE}/provinces.json`);
      if (!res.ok) throw new Error('API Wilayah tidak merespons');
      data = await res.json();
      regionCache.provinces = data;
    }
    populateSelect(provSelect, data, '-- Pilih Provinsi --');
  } catch (err) {
    console.warn('Menggunakan fallback data provinsi:', err);
    populateSelect(provSelect, FALLBACK_PROVINCES, '-- Pilih Provinsi --');
  } finally {
    if (spinner) spinner.style.display = 'none';
  }
}

async function loadRegencies(provinceId) {
  const regSelect = document.getElementById('modalRegency');
  const distSelect = document.getElementById('modalDistrict');
  const villSelect = document.getElementById('modalVillage');
  const spinner = document.getElementById('spinnerRegency');

  if (!regSelect) return;
  resetSelect(regSelect, '-- Memuat Kabupaten / Kota... --', true);
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
      const res = await fetch(`${API_BASE}/regencies/${provinceId}.json`);
      if (!res.ok) throw new Error('Gagal memuat kabupaten');
      data = await res.json();
      regionCache.regencies[provinceId] = data;
    }
    populateSelect(regSelect, data, '-- Pilih Kabupaten / Kota --');
    regSelect.disabled = false;
  } catch (err) {
    console.error('Error load regencies:', err);
    resetSelect(regSelect, '-- Gagal memuat data kota --', true);
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
  resetSelect(distSelect, '-- Memuat Kecamatan... --', true);
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
      const res = await fetch(`${API_BASE}/districts/${regencyId}.json`);
      if (!res.ok) throw new Error('Gagal memuat kecamatan');
      data = await res.json();
      regionCache.districts[regencyId] = data;
    }
    populateSelect(distSelect, data, '-- Pilih Kecamatan --');
    distSelect.disabled = false;
  } catch (err) {
    console.error('Error load districts:', err);
    resetSelect(distSelect, '-- Gagal memuat kecamatan --', true);
  } finally {
    if (spinner) spinner.style.display = 'none';
    calculateModalTotal();
  }
}

async function loadVillages(districtId) {
  const villSelect = document.getElementById('modalVillage');
  const spinner = document.getElementById('spinnerVillage');

  if (!villSelect) return;
  resetSelect(villSelect, '-- Memuat Desa / Kelurahan... --', true);

  if (!districtId) {
    resetSelect(villSelect, '-- Pilih Kecamatan Dahulu --', true);
    calculateModalTotal();
    return;
  }

  if (spinner) spinner.style.display = 'inline-block';
  try {
    let data = regionCache.villages[districtId];
    if (!data) {
      const res = await fetch(`${API_BASE}/villages/${districtId}.json`);
      if (!res.ok) throw new Error('Gagal memuat kelurahan');
      data = await res.json();
      regionCache.villages[districtId] = data;
    }
    populateSelect(villSelect, data, '-- Pilih Desa / Kelurahan --');
    villSelect.disabled = false;
  } catch (err) {
    console.error('Error load villages:', err);
    resetSelect(villSelect, '-- Gagal memuat desa --', true);
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

function populateSelect(selectEl, items, defaultLabel) {
  let html = `<option value="">${defaultLabel}</option>`;
  items.forEach(item => {
    const formattedName = formatTitleCase(item.name);
    html += `<option value="${item.id}" data-name="${item.name}">${formattedName}</option>`;
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
      backdrop.classList.add('open');
      calculateModalTotal();
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

  // Initial load of Indonesian provinces
  loadProvinces();

  // WhatsApp Checkout Confirmation Button
  const btnConfirm = document.getElementById('btnConfirmWhatsApp');
  if (btnConfirm) {
    btnConfirm.addEventListener('click', submitWhatsAppOrder);
  }
}

window.openOrderModal = function(productId, productName, price) {
  const backdrop = document.getElementById('orderModalBackdrop');
  const productSelect = document.getElementById('modalProductSelect');
  if (productSelect) {
    for (let i = 0; i < productSelect.options.length; i++) {
      if (productSelect.options[i].value === productId) {
        productSelect.selectedIndex = i;
        break;
      }
    }
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
  const unitWeight = PRODUCT_WEIGHTS[prodId] || 0.65;
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

    if (!provName || !regName || !distName || !villName || !streetAddress) {
      alert('Mohon lengkapi wilayah Provinsi, Kabupaten/Kota, Kecamatan, Desa/Kelurahan, dan Detail Jalan pengiriman Anda.');
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
