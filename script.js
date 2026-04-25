const themeToggle = document.getElementById("themeToggle");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
const scrollProgress = document.getElementById("scrollProgress");
const modal = document.getElementById("landmarkModal");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDetail = document.getElementById("modalDetail");
const foodTrack = document.getElementById("foodTrack");
const foodSection = document.getElementById("food");
const typewriter = document.getElementById("typewriter");
const verseButtons = [...document.querySelectorAll(".verse-btn")];
const parallaxImages = [...document.querySelectorAll(".parallax-img")];
const reveals = [...document.querySelectorAll(".reveal")];

const poetry = [
  "Lucknow speaks softly, yet leaves the deepest echo.",
  "In every lane, tehzeeb is not taught, it is lived.",
  "The city does not rush. It invites you to arrive."
];

const setTheme = (dark) => {
  document.body.classList.toggle("dark", dark);
  localStorage.setItem("lucknow-theme", dark ? "dark" : "light");
  themeToggle.textContent = dark ? "Dark" : "Light";
};

const initTheme = () => {
  const saved = localStorage.getItem("lucknow-theme");
  const darkPreferred = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(saved ? saved === "dark" : darkPreferred);
};

const updateProgress = () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const value = total > 0 ? window.scrollY / total : 0;
  scrollProgress.style.width = `${value * 100}%`;
};

const animateFoodTrack = () => {
  const reduced = window.matchMedia("(max-width: 900px), (prefers-reduced-motion: reduce)").matches;
  if (reduced || !foodTrack || !foodSection) {
    return;
  }
  const rect = foodSection.getBoundingClientRect();
  const sectionHeight = foodSection.offsetHeight - window.innerHeight;
  if (sectionHeight <= 0) {
    return;
  }
  const progress = Math.min(Math.max(-rect.top / sectionHeight, 0), 1);
  const maxTranslate = Math.max(foodTrack.scrollWidth - window.innerWidth * 0.94, 0);
  foodTrack.style.transform = `translateX(${-progress * maxTranslate}px)`;
};

const updateParallax = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  parallaxImages.forEach((img) => {
    const speed = Number(img.dataset.speed || 0.1);
    const box = img.getBoundingClientRect();
    const centerOffset = box.top + box.height / 2 - window.innerHeight / 2;
    img.style.transform = `translateY(${centerOffset * speed * -1}px) scale(1.05)`;
  });
};

const typeLine = (text) => {
  let i = 0;
  typewriter.textContent = "";
  const timer = setInterval(() => {
    i += 1;
    typewriter.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(timer);
    }
  }, 36);
};

const initPoetry = () => {
  typeLine(poetry[0]);
  verseButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      verseButtons.forEach((x) => x.classList.remove("active"));
      btn.classList.add("active");
      const i = Number(btn.dataset.index);
      typeLine(poetry[i]);
    });
  });
};

const initReveal = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  reveals.forEach((node) => observer.observe(node));
};

const initModal = () => {
  const cards = [...document.querySelectorAll(".landmark-card")];
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      modalImage.src = card.dataset.image;
      modalTitle.textContent = card.dataset.title;
      modalDetail.textContent = card.dataset.detail;
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });
};

const closeModal = () => {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

const initMap = () => {
  const map = L.map("lucknowMap", { scrollWheelZoom: false }).setView([26.85, 80.95], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const spots = [
    { name: "Bara Imambara", desc: "Monumental hall and Bhul Bhulaiya maze.", latlng: [26.8695, 80.9126] },
    { name: "Rumi Darwaza", desc: "Historic Awadhi gateway.", latlng: [26.8692, 80.9129] },
    { name: "Tunday Kababi", desc: "Legendary kebab destination.", latlng: [26.8684, 80.9156] }
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        spots.forEach((spot, idx) => {
          setTimeout(() => {
            L.marker(spot.latlng).addTo(map).bindPopup(`<strong>${spot.name}</strong><br>${spot.desc}`);
          }, idx * 220);
        });
        observer.disconnect();
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(document.getElementById("map"));
};

const initGsap = () => {
  if (!window.gsap || !window.ScrollTrigger) {
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".hero-content", { opacity: 0, y: 40, duration: 1, ease: "power3.out" });
  gsap.utils.toArray(".section-title").forEach((node) => {
    gsap.from(node, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      scrollTrigger: { trigger: node, start: "top 84%" }
    });
  });
};

themeToggle.addEventListener("click", () => {
  const dark = !document.body.classList.contains("dark");
  setTheme(dark);
});

musicToggle.addEventListener("click", async () => {
  if (bgMusic.paused) {
    try {
      await bgMusic.play();
      musicToggle.textContent = "Music On";
    } catch {
      musicToggle.textContent = "Music Off";
    }
  } else {
    bgMusic.pause();
    musicToggle.textContent = "Music Off";
  }
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

window.addEventListener("scroll", () => {
  updateProgress();
  animateFoodTrack();
  updateParallax();
});
window.addEventListener("resize", animateFoodTrack);

initTheme();
updateProgress();
initReveal();
initPoetry();
initModal();
initMap();
initGsap();
animateFoodTrack();
updateParallax();
