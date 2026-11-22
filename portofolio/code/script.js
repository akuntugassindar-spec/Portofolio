document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initStarfieldParticles();
  initNavbar();
  initProjectFilter();
  initBackToTop();
});

/* -------------------------------------------------------------
   1. TYPEWRITER EFFECT (Matching Soumyajit's Typewriter)
------------------------------------------------------------- */
function initTypewriter() {
  const strings = [
    "Frontend Developer",
    "Mahasiswa Informatika",
    "Pradita University",
    "UI/UX Designer",
    "Tech Problem Solver"
  ];

  const target = document.getElementById('typewriter');
  if (!target) return;

  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function loop() {
    const currentStr = strings[stringIndex];

    if (isDeleting) {
      target.textContent = currentStr.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      target.textContent = currentStr.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentStr.length) {
      // Pause at full word
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      stringIndex = (stringIndex + 1) % strings.length;
      typeSpeed = 450;
    }

    setTimeout(loop, typeSpeed);
  }

  loop();
}

/* -------------------------------------------------------------
   2. COSMIC STARFIELD PARTICLES (Matches tsParticles / Particle.js)
------------------------------------------------------------- */
function initStarfieldParticles() {
  const canvas = document.getElementById('tsparticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let stars = [];
  const starCount = 85;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Star {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 1.6 + 0.5;
      this.alpha = Math.random() * 0.7 + 0.3;
      // White, lavender, purple, cyan colors
      const starColors = ['#ffffff', '#c770f0', '#cd5ff8', '#e2d9f3', '#00f5d4'];
      this.color = starColors[Math.floor(Math.random() * starColors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }

  function connectConstellations() {
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = '#c770f0';
          ctx.globalAlpha = (1 - dist / 100) * 0.12;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(s => {
      s.update();
      s.draw();
    });

    connectConstellations();
    requestAnimationFrame(render);
  }

  render();
}

/* -------------------------------------------------------------
   3. STICKY NAVBAR, SCROLL SPY & MOBILE TOGGLE
------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggler = document.getElementById('navbarToggler');
  const collapse = document.getElementById('navbarCollapse');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile drawer toggle
  if (toggler && collapse) {
    toggler.addEventListener('click', () => {
      collapse.classList.toggle('show');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        collapse.classList.remove('show');
      });
    });
  }

  // Navbar glassmorphism scroll background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.backgroundColor = 'rgba(27, 26, 46, 0.95)';
      navbar.style.boxShadow = '0px 10px 15px 0px rgba(9, 5, 29, 0.4)';
    } else {
      navbar.style.backgroundColor = 'rgba(27, 26, 46, 0.85)';
      navbar.style.boxShadow = '0px 10px 10px 0px rgba(9, 5, 29, 0.171)';
    }

    // Scroll Spy active link
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* -------------------------------------------------------------
   4. PROJECTS FILTER TABS
------------------------------------------------------------- */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCols = document.querySelectorAll('.project-col');
  const wpSection = document.getElementById('wpSection');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      // Filter project cards
      projectCols.forEach(col => {
        const cat = col.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          col.style.display = 'flex';
          col.style.opacity = '0';
          setTimeout(() => { col.style.opacity = '1'; }, 30);
        } else {
          col.style.display = 'none';
        }
      });

      // Show/Hide WordPress Timeline
      if (wpSection) {
        if (filter === 'all' || filter === 'wordpress' || filter === 'mpk') {
          wpSection.style.display = 'block';
        } else {
          wpSection.style.display = 'none';
        }
      }
    });
  });
}

/* -------------------------------------------------------------
   5. IMAGE LIGHTBOX MODAL
------------------------------------------------------------- */
function openLightbox(src, caption) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');

  if (modal && img) {
    modal.classList.add('show');
    img.src = src;
    img.onerror = function() { const fn = src.split('/').pop(); img.src = fn; };
    cap.textContent = caption || '';
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

const modal = document.getElementById('lightboxModal');
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });
}

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

/* -------------------------------------------------------------
   6. BACK TO TOP BUTTON
------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
