const projects = window.siteContent?.projetos || [];
const testimonials = window.siteContent?.avaliacoes || [];

const grid = document.querySelector('#projectsGrid');

function renderProjects(filter = 'Todos') {
  const visible = filter === 'Todos' ? projects : projects.filter(project => project.categoria === filter);
  grid.innerHTML = visible.map((project, index) => `
    <article class="project-card reveal is-visible" style="transition-delay:${(index % 2) * 80}ms">
      ${project.link ? `<a class="project-image" href="${project.link}" target="_blank" rel="noopener" aria-label="Abrir projeto ${project.titulo}">` : '<div class="project-image">'}
        <img src="${project.imagem}" alt="Tela do projeto ${project.titulo}" loading="lazy">
      ${project.link ? '</a>' : '</div>'}
      <div class="project-meta">
        <div><h3>${project.titulo}</h3><p>${project.descricao}</p></div>
        <span>${project.categoria} / ${project.ano}</span>
      </div>
    </article>`).join('');
}

renderProjects();

let testimonialIndex = 0;
let testimonialTimer;
const testimonialSection = document.querySelector('.testimonial');
const testimonialSlide = document.querySelector('#testimonialSlide');
const testimonialDots = document.querySelector('#testimonialDots');

function renderTestimonial(index) {
  if (!testimonials.length) return;
  testimonialIndex = (index + testimonials.length) % testimonials.length;
  const item = testimonials[testimonialIndex];
  testimonialSlide.classList.remove('is-changing');
  void testimonialSlide.offsetWidth;
  testimonialSlide.classList.add('is-changing');
  testimonialSlide.innerHTML = `
    <blockquote>“${item.comentario}”</blockquote>
    <div class="client"><span>${item.iniciais}</span><div><strong>${item.nome}</strong><small>${item.empresa}</small></div></div>`;
  document.querySelector('#testimonialCounter').textContent = `${String(testimonialIndex + 1).padStart(2, '0')} / ${String(testimonials.length).padStart(2, '0')}`;
  testimonialDots.querySelectorAll('button').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === testimonialIndex));
}

function startTestimonialCarousel() {
  clearInterval(testimonialTimer);
  if (testimonials.length > 1) testimonialTimer = setInterval(() => renderTestimonial(testimonialIndex + 1), 6500);
}

if (testimonials.length) {
  testimonialDots.innerHTML = testimonials.map((_, index) => `<button type="button" aria-label="Ver avaliação ${index + 1}"></button>`).join('');
  testimonialDots.querySelectorAll('button').forEach((dot, index) => dot.addEventListener('click', () => { renderTestimonial(index); startTestimonialCarousel(); }));
  document.querySelector('#testimonialPrev').addEventListener('click', () => { renderTestimonial(testimonialIndex - 1); startTestimonialCarousel(); });
  document.querySelector('#testimonialNext').addEventListener('click', () => { renderTestimonial(testimonialIndex + 1); startTestimonialCarousel(); });
  testimonialSection.addEventListener('mouseenter', () => clearInterval(testimonialTimer));
  testimonialSection.addEventListener('mouseleave', startTestimonialCarousel);
  renderTestimonial(0);
  startTestimonialCarousel();
} else {
  testimonialSection.hidden = true;
}

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filter.is-active')?.classList.remove('is-active');
    button.classList.add('is-active');
    renderProjects(button.dataset.filter);
  });
});

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function toggleMenu(forceClose = false) {
  const open = forceClose ? false : !menuButton.classList.contains('is-open');
  menuButton.classList.toggle('is-open', open);
  mobileMenu.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileMenu.setAttribute('aria-hidden', String(!open));
}

menuButton.addEventListener('click', () => toggleMenu());
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggleMenu(true)));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

document.querySelectorAll('.accordion details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.accordion details[open]').forEach(openDetail => {
      if (openDetail !== detail) openDetail.open = false;
    });
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelector('.back-top')?.addEventListener('click', event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
