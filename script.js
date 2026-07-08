/* ==========================================================================
   1. THEME SWITCHER (MODE TERANG / GELAP)
   Menyimpan pilihan tema di localStorage supaya tetap tersimpan
   walaupun halaman di-refresh atau dibuka lagi nanti.
   ========================================================================== */

const themeToggle = document.getElementById("themeToggle");
const htmlEl = document.documentElement;
const STORAGE_KEY = "syikin-portfolio-theme"; // key localStorage, boleh diganti bebas

// Fungsi untuk menerapkan tema ke halaman
function applyTheme(theme) {
  if (theme === "dark") {
    htmlEl.setAttribute("data-theme", "dark");
  } else {
    htmlEl.removeAttribute("data-theme"); // tidak ada atribut = mode terang (default)
  }
}

// Saat halaman pertama kali dimuat: cek localStorage,
// kalau belum ada, ikuti preferensi sistem operasi pengguna
function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
}

// Saat tombol toggle diklik: balik tema & simpan pilihan baru
themeToggle.addEventListener("click", () => {
  const isDark = htmlEl.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";

  applyTheme(newTheme);
  localStorage.setItem(STORAGE_KEY, newTheme);
});

initTheme();

/* ==========================================================================
   2. MENU MOBILE (HAMBURGER)
   ========================================================================== */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// Tutup menu otomatis saat salah satu link diklik (khusus tampilan mobile)
navLinks.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* ==========================================================================
   3. SMOOTH SCROLL DENGAN OFFSET NAVBAR
   CSS "scroll-behavior: smooth" saja sudah cukup mulus, tapi karena
   navbar bersifat sticky, kita perlu geser sedikit ke atas supaya
   judul section tidak ketutupan navbar. Maka pakai JS scrollIntoView
   dengan tambahan offset manual.
   ========================================================================== */

const navbarHeight = document.getElementById("navbar").offsetHeight;

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  });
});

/* ==========================================================================
   4. SCROLL REVEAL (ANIMASI MUNCUL SAAT DI-SCROLL)
   Semua elemen dengan class "reveal" akan tersembunyi dulu (diatur di CSS),
   lalu class "in-view" ditambahkan otomatis saat elemen masuk ke layar.
   ========================================================================== */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target); // animasi cukup sekali saja
      }
    });
  },
  {
    threshold: 0.15, // elemen dianggap "terlihat" saat 15% bagiannya masuk layar
  },
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ==========================================================================
   5. SCROLL SPY (MENANDAI LINK NAVBAR YANG SEDANG AKTIF)
   Menambahkan class "active" pada link navbar sesuai section
   yang sedang terlihat di layar.
   ========================================================================== */

const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-link");

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        navAnchors.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  {
    rootMargin: `-${navbarHeight + 10}px 0px -70% 0px`, // area "aktif" ada di bagian atas layar
  },
);

sections.forEach((section) => spyObserver.observe(section));

/* ==========================================================================
   6. TAHUN OTOMATIS DI FOOTER
   ========================================================================== */

document.getElementById("year").textContent = new Date().getFullYear();
