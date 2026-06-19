// Adicione novos projetos aqui. O site cria os cards e filtros automaticamente.
const projects = [
  { title: 'Majestoso Mundo dos Vinhos', category: 'E-commerce', year: '2025', image: 'img/Meus projetos/Majestoso mundo dos vinhos.png', description: 'Loja virtual para uma curadoria de vinhos.' },
  { title: 'E-food', category: 'E-commerce', year: '2025', image: 'img/Meus projetos/Efood.png', description: 'Experiência digital para pedidos e delivery.' },
  { title: 'Casa da Juju', category: 'Institucional', year: '2024', image: 'img/Meus projetos/Casa da juju.png', description: 'Presença online acolhedora para a marca.' },
  { title: 'Franco News', category: 'Institucional', year: '2024', image: 'img/Meus projetos/Franco News.png', description: 'Portal editorial para notícias diárias.' },
  { title: 'Academia Blue Fit', category: 'Landing page', year: '2024', image: 'img/Meus projetos/Acdemia Blue fit.png', description: 'Página de alta energia para captação de alunos.' },
  { title: 'Le Sites', category: 'Landing page', year: '2024', image: 'img/Meus projetos/LeSites.png', description: 'Landing page para apresentar serviços digitais.' }
];

const grid = document.querySelector('#projectsGrid');

function renderProjects(filter = 'Todos') {
  const visible = filter === 'Todos' ? projects : projects.filter(project => project.category === filter);
  grid.innerHTML = visible.map((project, index) => `
    <article class="project-card reveal is-visible" style="transition-delay:${(index % 2) * 80}ms">
      <div class="project-image">
        <img src="${project.image}" alt="Tela do projeto ${project.title}" loading="lazy">
      </div>
      <div class="project-meta">
        <div><h3>${project.title}</h3><p>${project.description}</p></div>
        <span>${project.category} / ${project.year}</span>
      </div>
    </article>`).join('');
}

renderProjects();

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
