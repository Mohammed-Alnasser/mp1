/* Your JS here. */

const PROFILE = {
  github: 'https://github.com/Mohammed-Alnasser',
  email: 'ma138@illinois.edu',
};

document.querySelectorAll('.profile-github').forEach((link) => { link.href = PROFILE.github; });
document.querySelectorAll('.contact-email').forEach((link) => {
  link.href = `mailto:${PROFILE.email}`;
  if (link.classList.contains('email-address')) link.textContent = PROFILE.email;
});
document.getElementById('year').textContent = new Date().getFullYear();

// SECTION NAVIGATION --------------------------------------------------------
const header = document.getElementById('site-header');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href')));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let scrollFramePending = false;

function updateNavigation() {
  header.classList.toggle('is-scrolled', window.scrollY > 32);
  const readingLine = header.getBoundingClientRect().bottom + 3;
  let activeIndex = 0;
  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= readingLine) activeIndex = index;
  });


  if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2) {
    activeIndex = sections.length - 1;
  }
  navLinks.forEach((link, index) => {
    const active = index === activeIndex;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollFramePending = false;
}

function scheduleNavigationUpdate() {
  if (!scrollFramePending) {
    scrollFramePending = true;
    window.requestAnimationFrame(updateNavigation);
  }
}

function goToSection(section, smooth = true) {

  const top = section.id === 'home' ? 0 :
    section.getBoundingClientRect().top + window.scrollY - header.getBoundingClientRect().height + 1;
  window.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduceMotion.matches ? 'smooth' : 'instant' });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    event.preventDefault();
    goToSection(target);
    // replaceState avoids adding an entry for every in-page navigation click.
    window.history.replaceState(null, '', `#${target.id}`);
    if (link.classList.contains('skip-link')) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
});
window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
window.addEventListener('resize', scheduleNavigationUpdate);
header.addEventListener('transitionend', scheduleNavigationUpdate);
window.addEventListener('load', () => {
  const target = document.getElementById(window.location.hash.slice(1));
  if (target) {
    // Settle the header before aligning a direct fragment link. Otherwise
    // browser scroll anchoring can preserve the expanded header's offset.
    header.classList.add('is-initializing');
    header.classList.toggle('is-scrolled', target.id !== 'home');
    goToSection(target, false);
    window.requestAnimationFrame(() => header.classList.remove('is-initializing'));
  }
  updateNavigation();
});
updateNavigation();

// PROJECT CAROUSEL ----------------------------------------------------------
const carousel = document.querySelector('.carousel');
const slides = Array.from(document.querySelectorAll('.project-slide'));
const dots = Array.from(document.querySelectorAll('.carousel-dot'));
const slideCount = document.querySelector('.slide-count');
const carouselStatus = document.getElementById('carousel-status');
const slideNames = ['Explainable interview evaluation', 'Tennis ball collector', 'RISC-V operating systems'];
let currentSlide = 0;

function showSlide(index) {
  const nextIndex = (index + slides.length) % slides.length;
  if (nextIndex !== currentSlide && slides[currentSlide].contains(document.activeElement)) {
    carousel.focus({ preventScroll: true });
  }
  currentSlide = nextIndex;
  slides.forEach((slide, i) => { slide.hidden = i !== currentSlide; });
  dots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === currentSlide);
    dot.setAttribute('aria-pressed', String(i === currentSlide));
  });
  slideCount.firstChild.textContent = `${String(currentSlide + 1).padStart(2, '0')} `;
  carouselStatus.textContent = `Project ${currentSlide + 1} of ${slides.length}: ${slideNames[currentSlide]}`;
  scheduleNavigationUpdate();
}

document.querySelector('.carousel-prev').addEventListener('click', () => showSlide(currentSlide - 1));
document.querySelector('.carousel-next').addEventListener('click', () => showSlide(currentSlide + 1));
dots.forEach((dot) => dot.addEventListener('click', () => showSlide(Number(dot.dataset.index))));
carousel.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showSlide(currentSlide + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
let touchStart = null;
carousel.addEventListener('touchstart', (event) => {
  if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
}, { passive: true });
carousel.addEventListener('touchend', (event) => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) showSlide(currentSlide + (dx < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });
carousel.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
document.querySelectorAll('[data-show-project]').forEach((link) => {
  link.addEventListener('click', () => showSlide(Number(link.dataset.showProject)));
});

// PROJECT DETAILS -----------------------------------------------------------
const projectDetails = {
  research: {
    category: 'Research / Multimodal AI',
    title: 'Explainable video interview evaluation',
    summary: 'A research project exploring how multiple agents can select evidence from an interview and use it to support a question-specific evaluation.',
    sections: [
      ['The question', 'How much audio, video, and transcript evidence is actually needed to answer a question about an interview? The project explores adaptive evidence selection and timestamped support for an evaluation.'],
      ['The work', 'The preprocessing pipeline extracts audio, transcribes and aligns speech, and samples video frames. The evaluation pipeline brings this material together so an answer can be connected to relevant interview segments.'],
      ['What interests me', 'The connection between model behavior and its supporting evidence: making an evaluation easier to inspect, while exploring alternatives to passing an entire interview into every evaluation.'],
    ],
    tags: ['Python', 'WhisperX', 'Video processing', 'Multi-agent systems'],
  },
  robot: {
    category: 'Senior design / In progress',
    title: 'Tennis ball collection robot',
    summary: 'A small robotic vehicle intended to find and collect tennis balls, reducing the manual work between practice sessions.',
    sections: [
      ['The idea', 'A camera helps locate tennis balls. A wheeled platform approaches them, and a front intake mechanism moves them into a storage area.'],
      ['The planned system', 'The design combines an STM32 microcontroller, motor control, camera-based perception, and an ESP8266 Wi-Fi connection for a simple start/stop web interface. Obstacle sensing and the collection mechanism are part of the integration work.'],
      ['Current status', 'This project is in development. The illustrations and video on this page explain the concept; they are not photographs or footage of a completed autonomous robot.'],
    ],
    tags: ['STM32', 'ESP8266', 'Computer vision', 'Motor control'],
  },
  systems: {
    category: 'Coursework / Systems programming',
    title: 'Building beneath the application',
    summary: 'An operating systems project on RISC-V, working with the components that make programs and persistent storage useful.',
    sections: [
      ['The work', 'The project spans the KTFS filesystem, threads and processes, and a shell. Each component connects low-level implementation decisions to behavior a user can observe.'],
      ['The challenge', 'Reasoning about state across multiple layers: how data is represented, how execution is managed, and how interfaces connect these pieces.'],
      ['Why it matters to me', 'Understanding a system from the bottom up makes me a more careful engineer, whether I am working on embedded hardware or an application built on top of it.'],
    ],
    tags: ['C', 'RISC-V', 'KTFS', 'Operating systems'],
  },
};

const dialog = document.getElementById('project-dialog');
let dialogOpener = null;

document.querySelectorAll('.project-open').forEach((button) => {
  button.addEventListener('click', () => {
    const project = projectDetails[button.dataset.project];
    if (!project) return;
    dialogOpener = button;
    document.getElementById('dialog-category').textContent = project.category;
    document.getElementById('dialog-title').textContent = project.title;
    document.getElementById('dialog-summary').textContent = project.summary;
    const details = document.getElementById('dialog-details');
    details.replaceChildren();
    project.sections.forEach(([heading, text]) => {
      const title = document.createElement('h3');
      const paragraph = document.createElement('p');
      title.textContent = heading;
      paragraph.textContent = text;
      details.append(title, paragraph);
    });
    const tags = document.getElementById('dialog-tags');
    tags.replaceChildren(...project.tags.map((tag) => {
      const item = document.createElement('li');
      item.textContent = tag;
      return item;
    }));
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
  });
});
document.querySelectorAll('.dialog-close, .dialog-done').forEach((button) => {
  button.addEventListener('click', () => dialog.close());
});
dialog.addEventListener('click', (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog &&
      (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
    dialog.close();
  }
});
// Native <dialog> provides the focus trap and Escape-to-close behavior.
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (dialogOpener) dialogOpener.focus({ preventScroll: true });
});

