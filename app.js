/**
 * LEAFY — OFFICIAL BOTANICAL LANDING WEBSITE JAVASCRIPT
 * Canvas 3D Spores Engine • 3D Mouse Parallax Tilt • Live Scanner Simulator • Watering Calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  init3DPhoneTilt();
  initNavbarScroll();
  initSimulator();
  initWateringCalculator();
  initFaqAccordion();
  initSmoothScroll();
});

/* ==========================================================================
   1. CANVAS BOTANICAL SPORE & PARTICLE SYSTEM
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(width > 768 ? 55 : 25, 60);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2, // Floats upward like spores
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
      color: Math.random() > 0.4 ? 'rgba(52, 211, 153,' : 'rgba(167, 243, 208,'
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;

      const dynamicAlpha = Math.max(0.1, p.alpha + Math.sin(p.pulse) * 0.2);

      // Reset when floating out of view
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color} ${dynamicAlpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(52, 211, 153, 0.8)';
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. 3D PHONE MOCKUP MOUSE PARALLAX & TILT
   ========================================================================== */
function init3DPhoneTilt() {
  const phoneContainer = document.querySelector('.hero-phone-perspective');
  const phoneMockup = document.querySelector('.phone-mockup-3d');
  if (!phoneContainer || !phoneMockup) return;

  phoneContainer.addEventListener('mousemove', (e) => {
    const rect = phoneContainer.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / rect.height) * 22; // Max 22deg
    const rotateY = (x / rect.width) * 22;

    phoneMockup.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  });

  phoneContainer.addEventListener('mouseleave', () => {
    phoneMockup.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   3. NAVBAR SCROLL EFFECT
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   4. LIVE INTERACTIVE SCANNER SIMULATOR
   ========================================================================== */
const plantDatabase = {
  caladium: {
    name: 'Caladium',
    latin: 'Caladium hortulanum',
    family: 'Araceae',
    status: 'Healthy (90%)',
    confidence: '90%',
    fillWidth: '90%',
    sunlight: 'Bright Indirect',
    watering: 'Every 5-7 Days',
    humidity: 'High (60%+)',
    toxicity: 'Toxic to Pets (ASPCA)',
    image: 'assets/images/screen_diagnosis.jpg',
    badgeText: 'Caladium • 90% Match'
  },
  monstera: {
    name: 'Monstera Deliciosa',
    latin: 'Monstera deliciosa Liebm.',
    family: 'Araceae',
    status: 'Healthy (98%)',
    confidence: '98%',
    fillWidth: '98%',
    sunlight: 'Medium to Bright',
    watering: 'Every 7-10 Days',
    humidity: 'Moderate to High',
    toxicity: 'Toxic if Ingested',
    image: 'assets/images/screen_scan.jpg',
    badgeText: 'Monstera Deliciosa • 98% Match'
  },
  orchid: {
    name: "Lady's Slipper Orchid",
    latin: 'Paphiopedilum insigne',
    family: 'Orchidaceae',
    status: 'Hydration Check (94%)',
    confidence: '94%',
    fillWidth: '94%',
    sunlight: 'Filtered Morning Light',
    watering: 'Every 4-6 Days',
    humidity: 'High (50-70%)',
    toxicity: 'Non-Toxic to Pets',
    image: 'assets/images/screen_angles.jpg',
    badgeText: 'Slipper Orchid • 94% Match'
  }
};

function initSimulator() {
  const tabs = document.querySelectorAll('.sim-tab-btn');
  const simName = document.getElementById('sim-name');
  const simLatin = document.getElementById('sim-latin');
  const simStatus = document.getElementById('sim-status');
  const simConf = document.getElementById('sim-confidence');
  const simFill = document.getElementById('sim-meter-fill');
  const simSunlight = document.getElementById('sim-sunlight');
  const simWatering = document.getElementById('sim-watering');
  const simHumidity = document.getElementById('sim-humidity');
  const simToxicity = document.getElementById('sim-toxicity');
  const simPhoneImg = document.getElementById('sim-phone-image');

  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const plantKey = tab.getAttribute('data-plant');
      const data = plantDatabase[plantKey];
      if (!data) return;

      // Animate meter reset and refill
      if (simFill) simFill.style.width = '0%';

      setTimeout(() => {
        if (simName) simName.textContent = data.name;
        if (simLatin) simLatin.textContent = data.latin;
        if (simStatus) simStatus.innerHTML = `<span>●</span> ${data.status}`;
        if (simConf) simConf.textContent = data.confidence;
        if (simSunlight) simSunlight.textContent = data.sunlight;
        if (simWatering) simWatering.textContent = data.watering;
        if (simHumidity) simHumidity.textContent = data.humidity;
        if (simToxicity) simToxicity.textContent = data.toxicity;
        if (simPhoneImg) simPhoneImg.src = data.image;

        if (simFill) simFill.style.width = data.fillWidth;
      }, 200);
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE WATERING SCHEDULE CALCULATOR
   ========================================================================== */
function initWateringCalculator() {
  const typeSelect = document.getElementById('calc-plant-type');
  const lightSelect = document.getElementById('calc-light-level');
  const daysOutput = document.getElementById('calc-days-val');
  const tipOutput = document.getElementById('calc-tip-text');

  if (!typeSelect || !lightSelect || !daysOutput) return;

  function calculateSchedule() {
    const type = typeSelect.value;
    const light = lightSelect.value;

    let days = '7 Days';
    let tip = 'Keep soil evenly moist. Water when top inch feels dry.';

    if (type === 'tropical') {
      if (light === 'high') {
        days = '5 - 6 Days';
        tip = 'Tropical foliage transpires faster in bright light. Water thoroughly and mist leaves.';
      } else if (light === 'low') {
        days = '8 - 10 Days';
        tip = 'Reduced light slows evaporation. Ensure drainage holes are clear to prevent root rot.';
      } else {
        days = '7 Days';
        tip = 'Standard indoor tropical rhythm. Check top 2 inches of soil before hydrating.';
      }
    } else if (type === 'succulent') {
      if (light === 'high') {
        days = '12 - 14 Days';
        tip = 'Succulents store water in plump leaves. Allow soil to dry completely between drinks.';
      } else {
        days = '18 - 21 Days';
        tip = 'Low light succulents require minimal water. When in doubt, wait another 3 days.';
      }
    } else if (type === 'fern') {
      days = light === 'high' ? '3 - 4 Days' : '4 - 5 Days';
      tip = 'Ferns love consistent moisture. Mist regularly and never let root ball dry out.';
    } else if (type === 'flowering') {
      days = '4 - 6 Days';
      tip = 'Flowering blooms require consistent energy. Keep soil lightly hydrated during bloom cycles.';
    }

    daysOutput.textContent = days;
    if (tipOutput) tipOutput.textContent = tip;
  }

  typeSelect.addEventListener('change', calculateSchedule);
  lightSelect.addEventListener('change', calculateSchedule);
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach((other) => other.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. SMOOTH SCROLL FOR NAV LINKS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
