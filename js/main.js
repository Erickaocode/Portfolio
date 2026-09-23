// ===== CLASSE COMPARTILHADA: EFEITO SCRAMBLE =====
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#0101';

function TextScramble(node) {
    this.el = node;
    this.frame = 0;
    this.frameRequest = null;
    this.queue = [];
    this.update = this.update.bind(this);
}

TextScramble.prototype.setText = function (newText) {
    const oldText = this.el.textContent;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => { this.resolve = resolve; });
    this.queue = [];
    for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 30);
        const end = start + Math.floor(Math.random() * 30) + 10;
        this.queue.push({ from, to, start, end, char: '' });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
};

TextScramble.prototype.update = function () {
    let output = '';
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
        const item = this.queue[i];
        if (this.frame >= item.end) {
            complete++;
            output += item.to;
        } else if (this.frame >= item.start) {
            if (!item.char || Math.random() < 0.3) {
                item.char = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            }
            output += '<span class="scramble-char">' + item.char + '</span>';
        } else {
            output += item.from;
        }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
        this.resolve();
    } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
    }
};

// ===== TEXTO COM EFEITO SCRAMBLE (INÍCIO) =====
(function () {
    const el = document.getElementById('destaqueInicio');
    if (!el) return;

    const frases = [
        'Desenvolvedor Web', 'Web Developer',
        'Engenheiro de Software', 'Software Engineer',
        'Engenheiro de IA', 'AI Engineer',
        'Full Stack Developer',
        'Criador de Soluções Digitais', 'Digital Solutions Creator'
    ];
    const fx = new TextScramble(el);
    let counter = 0;

    function next() {
        fx.setText(frases[counter]).then(() => {
            setTimeout(next, 2400);
        });
        counter = (counter + 1) % frases.length;
    }

    setTimeout(next, 1800);
})();

// ===== TEXTO COM EFEITO SCRAMBLE (uma vez, ao entrar na tela) =====
function scrambleOnVisible(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const finalText = el.textContent;
    const fx = new TextScramble(el);
    let played = false;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !played) {
                played = true;
                fx.setText(finalText);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.4 });
    obs.observe(el);
}

scrambleOnVisible('scrambleSobre');
scrambleOnVisible('scrambleProjetos');
scrambleOnVisible('scrambleContato');

// ===== GLOW DE CURSOR GLOBAL =====
(function () {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;
    let active = false;
    window.addEventListener('mousemove', (e) => {
        glow.style.setProperty('--cx', e.clientX + 'px');
        glow.style.setProperty('--cy', e.clientY + 'px');
        if (!active) { glow.classList.add('active'); active = true; }
    });
    window.addEventListener('mouseleave', () => {
        glow.classList.remove('active');
        active = false;
    });
})();

// ===== SPOTLIGHT DO MOUSE (INÍCIO) =====
(function () {
    const inicio = document.getElementById('inicio');
    const spotlight = document.getElementById('inicioSpotlight');
    if (!inicio || !spotlight) return;
    inicio.addEventListener('mousemove', (e) => {
        const rect = inicio.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        spotlight.style.setProperty('--x', x + '%');
        spotlight.style.setProperty('--y', y + '%');
    });
})();

// ===== BARRA DE PROGRESSO =====
(function () {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
})();

// ===== BOTÕES FIXOS =====
(function () {
    const backToTopButton = document.getElementById('backToTop');
    const whatsappButton  = document.getElementById('whatsappButton');

    function toggleButtons() {
        if (window.scrollY > 100) {
            backToTopButton.style.display = 'flex';
            whatsappButton.style.display  = 'flex';
            setTimeout(() => {
                backToTopButton.style.opacity = '1';
                whatsappButton.style.opacity  = '1';
            }, 10);
        } else {
            backToTopButton.style.opacity = '0';
            whatsappButton.style.opacity  = '0';
            setTimeout(() => {
                backToTopButton.style.display = 'none';
                whatsappButton.style.display  = 'none';
            }, 500);
        }
    }

    window.addEventListener('scroll', toggleButtons);
    backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    whatsappButton.addEventListener('click',  () => window.open('https://wa.me/5511994842434', '_blank'));
})();

// ===== MENU =====
(function () {
    const menuToggle = document.getElementById('menuToggle');
    const menuAberto = document.querySelector('.menu-aberto');
    const navLinks   = document.querySelectorAll('.nav-menu a');

    menuToggle.addEventListener('change', function () {
        if (menuToggle.checked) {
            menuAberto.classList.add('active');
            document.body.classList.add('no-scroll');
        } else {
            menuAberto.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.checked = false;
            menuAberto.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
})();

// ===== SLIDES =====
(function () {
    document.querySelectorAll('.slide').forEach(slide => {
        const images  = Array.from(slide.querySelectorAll('img'));
        const prev    = slide.querySelector('.prev');
        const next    = slide.querySelector('.next');
        let current   = 0;

        function showSlide(index) {
            images.forEach((img, i) => img.classList.toggle('active', i === index));
        }

        if (next) next.addEventListener('click', () => { current = (current + 1) % images.length; showSlide(current); });
        if (prev) prev.addEventListener('click', () => { current = (current - 1 + images.length) % images.length; showSlide(current); });

        setInterval(() => { current = (current + 1) % images.length; showSlide(current); }, 3500);
        showSlide(0);
    });
})();

// ===== FORMULÁRIO DE CONTATO (mailto) =====
(function () {
    const form = document.getElementById('formContato');
    if (!form) return;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const nome = form.nome.value.trim();
        const telefone = form.telefone.value.trim();
        const email = form.email.value.trim();
        const mensagem = form.mensagem.value.trim();

        const assunto = encodeURIComponent(`Contato via portfólio - ${nome}`);
        const corpo = encodeURIComponent(
            `Nome: ${nome}\nTelefone: ${telefone || 'não informado'}\nEmail: ${email}\n\nMensagem:\n${mensagem}`
        );

        window.location.href = `mailto:ericksilva112017@gmail.com?subject=${assunto}&body=${corpo}`;
    });
})();

// ===== TRANSIÇÃO PORTFOLIO — scroll reveal letra a letra =====
(function () {
    const sec = document.getElementById('portfolio-transicao');
    if (!sec) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sec.classList.add('pt-visible');
                obs.unobserve(sec);
            }
        });
    }, { threshold: 0.25 });
    obs.observe(sec);
})();
(function () {
    const hs = document.getElementById('headline-scroll');
    if (!hs) return;
    const clone = hs.cloneNode(true);
    clone.id = '';
    hs.parentNode.appendChild(clone);
})();
