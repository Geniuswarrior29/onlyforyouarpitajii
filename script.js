/**
 * ONLY FOR YOU, ARPITA - INTERACTIVE SCRIPT
 * Features:
 * - 20 Slides Seamless Navigation (Next, Back, Dots, Keyboard, Touch Swipe)
 * - Web Audio API Ambient Romantic Soundtrack & Sound Effects
 * - Canvas Floating Petals & Firefly Particles
 * - Fullscreen Controller
 * - Live Wallpaper Clock on Slide 16
 * - Slide 20 Proposal Celebration, Confetti Burst, & WhatsApp Response Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const totalSlides = 20;
  let currentSlide = 1;
  let isAudioPlaying = false;
  let audioCtx = null;
  let ambientSynthTimer = null;

  // DOM Elements
  const slides = document.querySelectorAll('.slide');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const dotsContainer = document.getElementById('dots-container');
  const musicToggle = document.getElementById('music-toggle');
  const fullscreenToggle = document.getElementById('fullscreen-toggle');
  const liveTimeEl = document.getElementById('live-time');

  // Modal Elements
  const modal = document.getElementById('response-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalIcon = document.getElementById('modal-icon');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalExtraNote = document.getElementById('modal-extra-note');
  const modalWhatsappBtn = document.getElementById('modal-whatsapp-btn');
  const modalReadAgainBtn = document.getElementById('modal-read-again-btn');

  // Choice Buttons
  const btnChoiceYes = document.getElementById('btn-choice-yes');
  const btnChoiceThink = document.getElementById('btn-choice-think');
  const btnChoiceFriends = document.getElementById('btn-choice-friends');

  // ==========================================
  // BUILD DOT INDICATORS
  // ==========================================
  function initDots() {
    dotsContainer.innerHTML = '';
    for (let i = 1; i <= totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = `dot ${i === 1 ? 'active' : ''}`;
      dot.setAttribute('title', `Slide ${i}`);
      dot.setAttribute('data-target-slide', i);
      dot.addEventListener('click', () => {
        goToSlide(i);
        playChime(440 + i * 20);
      });
      dotsContainer.appendChild(dot);
    }
  }

  // ==========================================
  // SLIDE NAVIGATION
  // ==========================================
  function goToSlide(targetSlide) {
    if (targetSlide < 1 || targetSlide > totalSlides) return;

    // Remove active from all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });

    currentSlide = targetSlide;

    // Activate current slide
    const targetElement = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
    if (targetElement) {
      targetElement.classList.add('active');
      // Smooth scroll into view on mobile
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Update Progress Bar
    const progressPercent = (currentSlide / totalSlides) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `Slide ${currentSlide} of ${totalSlides}`;

    // Update Dots
    const allDots = document.querySelectorAll('.dot');
    allDots.forEach((dot, index) => {
      if (index + 1 === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Start background music seamlessly on first advance if not started
    if (!isAudioPlaying && currentSlide > 1) {
      startAmbientMusic();
    }
  }

  // Next and Prev Button Listeners
  document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = parseInt(btn.getAttribute('data-target'), 10);
      goToSlide(target);
      playChime(580);
    });
  });

  document.querySelectorAll('.prev-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = parseInt(btn.getAttribute('data-target'), 10);
      goToSlide(target);
      playChime(420);
    });
  });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    // If modal is open, let Escape close it
    if (modal.classList.contains('open')) {
      if (e.key === 'Escape') closeModal();
      return;
    }

    if (e.key === 'ArrowRight' || e.key === ' ') {
      if (currentSlide < totalSlides) {
        e.preventDefault();
        goToSlide(currentSlide + 1);
        playChime(580);
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentSlide > 1) {
        e.preventDefault();
        goToSlide(currentSlide - 1);
        playChime(420);
      }
    }
  });

  // Touch Swipe for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  }, { passive: true });

  function handleGesture() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 55) {
      if (diff < 0 && currentSlide < totalSlides) {
        // Swiped Left -> Go Next
        goToSlide(currentSlide + 1);
        playChime(580);
      } else if (diff > 0 && currentSlide > 1) {
        // Swiped Right -> Go Back
        goToSlide(currentSlide - 1);
        playChime(420);
      }
    }
  }

  // ==========================================
  // LIVE CLOCK FOR SLIDE 16
  // ==========================================
  function updateLiveClock() {
    if (!liveTimeEl) return;
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    liveTimeEl.textContent = `${hours}:${minutes}`;
  }
  updateLiveClock();
  setInterval(updateLiveClock, 30000);

  // ==========================================
  // ROMANTIC SOUND ENGINE (Web Audio API)
  // Generates dreamy, soothing Rhodes piano chords
  // ==========================================
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playChime(freq = 523.25) {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } catch (err) {
      // Audio not permitted yet or failed
    }
  }

  // Romantic Chord Progression: Cmaj7, Am9, Fmaj7, G7sus4
  const chordNotes = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
    [220.00, 261.63, 329.63, 392.00, 493.88], // Am9 (A3, C4, E4, G4, B4)
    [174.61, 261.63, 329.63, 349.23], // Fmaj7 (F3, C4, E4, F4)
    [196.00, 261.63, 293.66, 392.00]  // Gsus4 (G3, C4, D4, G4)
  ];
  let chordIndex = 0;

  function playSoftChord(notes) {
    if (!isAudioPlaying) return;
    try {
      const ctx = getAudioContext();
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, ctx.currentTime);

        const stagger = i * 0.08;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + stagger);
        gain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + stagger + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + stagger + 3.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + stagger);
        osc.stop(ctx.currentTime + stagger + 4.0);
      });
    } catch (e) {
      console.warn("Audio playback note issue", e);
    }
  }

  function startAmbientMusic() {
    isAudioPlaying = true;
    musicToggle.classList.add('playing');
    getAudioContext();

    function chordLoop() {
      if (!isAudioPlaying) return;
      playSoftChord(chordNotes[chordIndex]);
      chordIndex = (chordIndex + 1) % chordNotes.length;
      ambientSynthTimer = setTimeout(chordLoop, 3800);
    }

    chordLoop();
  }

  function stopAmbientMusic() {
    isAudioPlaying = false;
    musicToggle.classList.remove('playing');
    if (ambientSynthTimer) clearTimeout(ambientSynthTimer);
  }

  musicToggle.addEventListener('click', () => {
    if (isAudioPlaying) {
      stopAmbientMusic();
    } else {
      startAmbientMusic();
      playChime(659.25);
    }
  });

  // Grand Fanfare for Yes!
  function playCelebrationFanfare() {
    try {
      const ctx = getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.25);
        }, idx * 160);
      });
    } catch (e) {}
  }

  // ==========================================
  // FULLSCREEN TOGGLE
  // ==========================================
  fullscreenToggle.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });

  // ==========================================
  // CANVAS PARTICLES (Floating Petals & Fireflies)
  // ==========================================
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  const particles = [];
  const totalParticles = 45;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -100;
      this.size = Math.random() * 8 + 5;
      this.speedY = Math.random() * 0.8 + 0.4;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 1.5 - 0.75;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.isPetal = Math.random() > 0.35; // 65% rose petals, 35% glowing fireflies
      this.wobble = Math.random() * Math.PI * 2;
    }

    update() {
      this.wobble += 0.02;
      this.x += Math.sin(this.wobble) * 0.75 + this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      if (this.isPetal) {
        // Draw Soft Rose Petal
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 143, 163, ${this.opacity})`;
        ctx.ellipse(0, 0, this.size, this.size * 0.6, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw Twinkling Firefly / Star
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `rgba(255, 235, 150, ${this.opacity * 1.2})`);
        gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < totalParticles; i++) {
    const p = new Particle();
    p.y = Math.random() * height; // Spread initially across screen
    particles.push(p);
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ==========================================
  // CONFETTI BURST ENGINE (For YES Choice)
  // ==========================================
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confCtx = confettiCanvas.getContext('2d');
  let confWidth, confHeight;
  let confettiPieces = [];
  let isConfettiActive = false;

  function resizeConfetti() {
    confWidth = confettiCanvas.width = window.innerWidth;
    confHeight = confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  const confettiColors = ['#ff4d79', '#ff8fa3', '#ffd166', '#c084fc', '#ffffff', '#ff2a5f'];

  class ConfettiPiece {
    constructor() {
      this.x = confWidth / 2 + (Math.random() * 200 - 100);
      this.y = confHeight * 0.6;
      this.size = Math.random() * 12 + 8;
      const angle = (Math.random() * Math.PI) + Math.PI; // Upwards spread
      const speed = Math.random() * 14 + 10;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.gravity = 0.35;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 10 - 5;
      this.isHeart = Math.random() > 0.5;
      this.opacity = 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.rotation += this.rotSpeed;
      if (this.y > confHeight * 0.4) {
        this.opacity -= 0.008;
      }
    }

    draw() {
      if (this.opacity <= 0) return;
      confCtx.save();
      confCtx.translate(this.x, this.y);
      confCtx.rotate((this.rotation * Math.PI) / 180);
      confCtx.globalAlpha = Math.max(0, this.opacity);

      if (this.isHeart) {
        // Draw Heart Shape
        confCtx.fillStyle = this.color;
        confCtx.beginPath();
        const topCurveHeight = this.size * 0.3;
        confCtx.moveTo(0, topCurveHeight);
        confCtx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        confCtx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, (this.size + topCurveHeight) / 1.5, 0, this.size);
        confCtx.bezierCurveTo(0, (this.size + topCurveHeight) / 1.5, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        confCtx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        confCtx.fill();
      } else {
        // Shimmering Confetti Ribbon
        confCtx.fillStyle = this.color;
        confCtx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      }

      confCtx.restore();
    }
  }

  function launchConfetti(count = 140) {
    confettiPieces = [];
    for (let i = 0; i < count; i++) {
      confettiPieces.push(new ConfettiPiece());
    }
    isConfettiActive = true;
  }

  function animateConfetti() {
    if (!isConfettiActive && confettiPieces.length === 0) {
      confCtx.clearRect(0, 0, confWidth, confHeight);
      requestAnimationFrame(animateConfetti);
      return;
    }

    confCtx.clearRect(0, 0, confWidth, confHeight);
    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const p = confettiPieces[i];
      p.update();
      p.draw();
      if (p.opacity <= 0 || p.y > confHeight + 50) {
        confettiPieces.splice(i, 1);
      }
    }

    if (confettiPieces.length === 0) {
      isConfettiActive = false;
    }

    requestAnimationFrame(animateConfetti);
  }
  animateConfetti();

  // ==========================================
  // SLIDE 20 DECISION MODAL LOGIC
  // ==========================================
  function openModal({ icon, title, message, extraNote, whatsappText }) {
    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalExtraNote.textContent = extraNote;

    const encodedMsg = encodeURIComponent(whatsappText);
    modalWhatsappBtn.href = `https://api.whatsapp.com/send?text=${encodedMsg}`;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  modalReadAgainBtn.addEventListener('click', () => {
    closeModal();
    goToSlide(1);
    playChime(523.25);
  });

  // Decision 1: YES!
  btnChoiceYes.addEventListener('click', () => {
    launchConfetti(160);
    playCelebrationFanfare();

    openModal({
      icon: '😭❤️💍',
      title: 'You just made my world the happiest! ✨',
      message: 'Sach me?! I promise to cherish you, make you laugh, and always stand by your side through everything. Thank you for trusting me with your heart. You mean everything to me, Arpita! 💖💍🥂',
      extraNote: '✨ Tumhari smile hamare liye sabse precious hai, promise!',
      whatsappText: "YES! I saw your surprise website... and YES, I would love to give us a chance! 🥹❤️"
    });
  });

  // Decision 2: NEED TIME TO THINK
  btnChoiceThink.addEventListener('click', () => {
    playChime(620);

    openModal({
      icon: '🌸⏳🤍',
      title: 'Take all the time you need! 🌸🕊️',
      message: 'Sach mein, bilkul koi jaldi nahi hai. Tumhara comfort aur tumhari peace of mind sabse pehle aati hai. Think calmly, whenever you feel ready, I\'m always right here with a smile. 🤍',
      extraNote: '🌿 No pressure at all, Arpita. Your comfort is everything.',
      whatsappText: "Hey, I saw your surprise website... it was so sweet! I need a little time to think, hope you understand 🌸"
    });
  });

  // Decision 3: STAY GOOD FRIENDS
  btnChoiceFriends.addEventListener('click', () => {
    playChime(480);

    openModal({
      icon: '🤝🤍✨',
      title: 'I respect and cherish you, always 🤝🤍',
      message: 'Dil se shukriya itna honest aur sweet hone ke liye. Tumhari dosti mere liye bohot precious hai aur hamesha rahegi. Tumhari khushi aur tumhara space mere liye sabse zaroori hai. No awkwardness, just pure respect! 🌟',
      extraNote: '✨ Thank you for being such a wonderful part of my life, Arpita!',
      whatsappText: "Hey, I saw your surprise website... Thank you for being so honest with me. Let's always be great friends! 🤍"
    });
  });

  // Initialize
  initDots();
  goToSlide(1);
});
