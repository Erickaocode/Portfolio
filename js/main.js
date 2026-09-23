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
