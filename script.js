/* =========================
   ARCHETTI UNIFORMES
   script.js — v2.0
========================= */

(function () {
  "use strict";

  /* -------------------------------------------------------
     ELEMENTOS
  ------------------------------------------------------- */
  const header      = document.getElementById("header");
  const menuToggle  = document.getElementById("menu-toggle");
  const navMenu     = document.getElementById("nav-menu");
  const navLinks    = document.querySelectorAll(".nav-menu a");

  /* -------------------------------------------------------
     HEADER — sombra ao rolar
  ------------------------------------------------------- */
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // executa na carga

  /* -------------------------------------------------------
     MENU MOBILE
  ------------------------------------------------------- */
  function openMenu() {
    navMenu.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  // Fecha ao clicar num link
  navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Fecha ao clicar fora
  document.addEventListener("click", (e) => {
    if (
      navMenu.classList.contains("open") &&
      !navMenu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* -------------------------------------------------------
     SCROLL SUAVE — links internos
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* -------------------------------------------------------
     SCROLL REVEAL
  ------------------------------------------------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger delay baseado na posição
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
              entry.target.classList.add("is-visible");
            }, delay);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach((el, i) => {
      if (!el.dataset.delay) {
        el.dataset.delay = (i % 4) * 80; // stagger leve dentro de cada linha
      }
      revealObserver.observe(el);
    });
  }

  /* -------------------------------------------------------
     CONTADORES ANIMADOS (.stat-card dentro do hero)
  ------------------------------------------------------- */
  const heroStats = document.querySelectorAll(".hero-stat strong");

  if (heroStats.length) {
    let counted = false;

    const heroSection = document.getElementById("hero");

    const counterObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counted) {
          counted = true;
          heroStats.forEach(el => animateCount(el));
          counterObserver.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    counterObserver.observe(heroSection);
  }

  function animateCount(el) {
    const raw = el.textContent.replace(/[^0-9]/g, "");
    const target = parseInt(raw, 10);
    if (isNaN(target)) return;

    const suffix = el.textContent.includes("+") ? "+" : "";
    const separator = el.textContent.includes(".") ? "." : "";

    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      const current = Math.floor(ease * target);

      // Formata com separador de milhar (ponto) se necessário
      el.textContent = separator
        ? current.toLocaleString("pt-BR") + suffix
        : current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = separator
          ? target.toLocaleString("pt-BR") + suffix
          : target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* -------------------------------------------------------
     PORTFOLIO — drag / swipe no mobile
  ------------------------------------------------------- */
  const track = document.querySelector(".portfolio-track");

  if (track) {
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener("mousedown", (e) => {
      isDown = true;
      track.style.cursor = "grabbing";
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener("mouseleave", () => {
      isDown = false;
      track.style.cursor = "";
    });

    track.addEventListener("mouseup", () => {
      isDown = false;
      track.style.cursor = "";
    });

    track.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  }

  /* -------------------------------------------------------
     ACTIVE NAV LINK ao rolar
  ------------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");

  function setActiveLink() {
    const scrollY = window.scrollY + header.offsetHeight + 60;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(a => a.removeAttribute("aria-current"));
        const active = document.querySelector(`.nav-menu a[href="#${sec.id}"]`);
        if (active) active.setAttribute("aria-current", "page");
      }
    });
  }

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

})();

document.querySelectorAll(".play-btn[data-video-src]").forEach(btn => {
  btn.addEventListener("click", () => {
    const src = btn.dataset.videoSrc;

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,.92);
      display:flex; align-items:center; justify-content:center;
    `;

    overlay.innerHTML = `
      <button aria-label="Fechar" style="
        position:absolute; top:1.5rem; right:1.5rem;
        background:none; border:none; color:#fff;
        font-size:2rem; cursor:pointer; line-height:1;
      ">✕</button>
      <video src="${src}" controls autoplay style="
        max-width:95vw; max-height:85vh; border-radius:12px;
      "></video>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    overlay.querySelector("button").addEventListener("click", () => {
      overlay.remove();
      document.body.style.overflow = "";
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        document.body.style.overflow = "";
      }
    });
  });
});

/* -------------------------------------------------------
   LIGHTBOX — fotos do portfólio
------------------------------------------------------- */
document.querySelectorAll(".portfolio-card:not(.portfolio-card--video) .portfolio-img img").forEach(img => {
  img.style.cursor = "zoom-in";

  img.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,.92);
      display:flex; align-items:center; justify-content:center;
      padding:1.5rem;
    `;

    overlay.innerHTML = `
      <button aria-label="Fechar" style="
        position:absolute; top:1.5rem; right:1.5rem;
        background:none; border:none; color:#fff;
        font-size:2rem; cursor:pointer; line-height:1;
      ">✕</button>
      <img src="${img.src}" alt="${img.alt}" style="
        max-width:95vw; max-height:90vh;
        border-radius:12px;
        box-shadow:0 20px 60px rgba(0,0,0,.5);
        object-fit:contain;
      " />
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    overlay.querySelector("button").addEventListener("click", () => {
      overlay.remove();
      document.body.style.overflow = "";
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        document.body.style.overflow = "";
      }
    });
  });
});

/* -------------------------------------------------------
   CARROSSEL DE DEPOIMENTOS
------------------------------------------------------- */
(function () {
  const track   = document.getElementById("testimonials-track");
  const dotsEl  = document.getElementById("testimonials-dots");
  const btnPrev = document.getElementById("prev-testimonial");
  const btnNext = document.getElementById("next-testimonial");
  if (!track || !dotsEl) return;

  const cards = Array.from(track.querySelectorAll(".testimonial-card"));
  const total = cards.length;
  const perPage = () => window.innerWidth <= 768 ? 1 : 3;
  const totalPages = () => Math.ceil(total / perPage());
  let current = 0;

  // Cria dots
  function buildDots() {
    dotsEl.innerHTML = "";
    for (let i = 0; i < totalPages(); i++) {
      const btn = document.createElement("button");
      btn.setAttribute("aria-label", `Página ${i + 1}`);
      btn.addEventListener("click", () => goTo(i));
      dotsEl.appendChild(btn);
    }
  }

  function goTo(index) {
    current = (index + totalPages()) % totalPages();

    if (window.innerWidth <= 768) {
      // Mobile: scroll suave até o card
      const card = cards[current];
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    } else {
      // Desktop: esconde/mostra grupos
      cards.forEach((card, i) => {
        const page = Math.floor(i / perPage());
        card.style.display = page === current ? "" : "none";
      });
    }

    dotsEl.querySelectorAll("button").forEach((b, i) =>
      b.classList.toggle("active", i === current)
    );
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (btnPrev) btnPrev.addEventListener("click", prev);
  if (btnNext) btnNext.addEventListener("click", next);

  // Atualiza dot ativo ao arrastar no mobile
  track.addEventListener("scroll", () => {
    if (window.innerWidth > 768) return;
    const index = Math.round(track.scrollLeft / cards[0].offsetWidth);
    if (index !== current) {
      current = index;
      dotsEl.querySelectorAll("button").forEach((b, i) =>
        b.classList.toggle("active", i === current)
      );
    }
  });

  // Reconstrói ao redimensionar
  window.addEventListener("resize", () => {
    buildDots();
    goTo(0);
  });

  buildDots();
  goTo(0);
})();