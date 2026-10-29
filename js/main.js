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
scrambleOnVisible('scrambleTempo');
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
    if (!backToTopButton || !whatsappButton) return;

    // só alterna uma classe: o fade fica no CSS e não há setTimeout competindo
    // entre mostrar/esconder quando o scroll sobe e desce rápido
    function toggleButtons() {
        const visible = window.scrollY > 100;
        backToTopButton.classList.toggle('visible', visible);
        whatsappButton.classList.toggle('visible', visible);
    }

    window.addEventListener('scroll', toggleButtons, { passive: true });
    backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    toggleButtons();
})();

// ===== MENU =====
(function () {
    const menuToggle = document.getElementById('menuToggle');
    const menuAberto = document.querySelector('.menu-aberto');
    const navLinks   = document.querySelectorAll('.nav-menu a');
    if (!menuToggle || !menuAberto) return;

    function setMenu(open) {
        menuToggle.checked = open;
        menuAberto.classList.toggle('active', open);
        document.body.classList.toggle('no-scroll', open);
    }

    menuToggle.addEventListener('change', () => setMenu(menuToggle.checked));
    navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuToggle.checked) setMenu(false);
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

        showSlide(0);
        if (images.length < 2) return;
        setInterval(() => { current = (current + 1) % images.length; showSlide(current); }, 3500);
    });
})();

// ===== FORMULÁRIO DE CONTATO =====
// Envia pelo FormSubmit (sem backend). Se o envio falhar, oferece mailto e WhatsApp.
(function () {
    const form = document.getElementById('formContato');
    if (!form) return;

    const EMAIL    = 'ericksilva112017@gmail.com';
    const ENDPOINT = 'https://formsubmit.co/ajax/' + EMAIL;
    const status   = document.getElementById('contatoStatus');
    const botao    = document.getElementById('contatoEnviar');
    const label    = botao.querySelector('.btn-label');
    const icone    = botao.querySelector('i');

    function setStatus(tipo, html) {
        status.className = 'form-status' + (tipo ? ' ' + tipo : '');
        status.innerHTML = html;
    }

    function setLoading(loading) {
        botao.disabled = loading;
        botao.classList.toggle('loading', loading);
        label.textContent = loading ? 'Enviando...' : 'Enviar mensagem';
        icone.className = loading ? 'bi bi-arrow-repeat' : 'bi bi-arrow-right';
    }

    function linkMailto(dados) {
        const assunto = encodeURIComponent(`Contato via portfólio - ${dados.nome}`);
        const corpo = encodeURIComponent(
            `Nome: ${dados.nome}\nTelefone: ${dados.telefone || 'não informado'}\nEmail: ${dados.email}\n\nMensagem:\n${dados.mensagem}`
        );
        return `mailto:${EMAIL}?subject=${assunto}&body=${corpo}`;
    }

    // máscara simples: (11) 99999-9999 ou (11) 9999-9999
    form.telefone.addEventListener('input', () => {
        const d = form.telefone.value.replace(/\D/g, '').slice(0, 11);
        let v = d;
        if (d.length > 2)  v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
        if (d.length > 6)  v = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
        form.telefone.value = v;
    });

    // marca o campo inválido só depois que a pessoa sai dele
    form.querySelectorAll('input[required], textarea[required]').forEach((campo) => {
        campo.addEventListener('blur', () => campo.classList.toggle('invalido', !campo.checkValidity()));
        campo.addEventListener('input', () => campo.classList.remove('invalido'));
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (form._honey.value) return;

        const dados = {
            nome: form.nome.value.trim(),
            telefone: form.telefone.value.trim(),
            email: form.email.value.trim(),
            mensagem: form.mensagem.value.trim()
        };

        if (!dados.nome || !dados.mensagem) {
            setStatus('erro', 'Preencha seu nome e a mensagem antes de enviar.');
            return;
        }

        setLoading(true);
        setStatus('', '');

        try {
            const resposta = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    nome: dados.nome,
                    telefone: dados.telefone || 'não informado',
                    email: dados.email,
                    mensagem: dados.mensagem,
                    _subject: `Contato via portfólio - ${dados.nome}`,
                    _replyto: dados.email,
                    _template: 'table',
                    _captcha: 'false'
                })
            });
            const json = await resposta.json().catch(() => ({}));
            if (!resposta.ok || String(json.success) !== 'true') throw new Error(json.message || 'falha no envio');

            form.reset();
            setStatus('sucesso', `Valeu, ${dados.nome.split(' ')[0]}! Sua mensagem chegou, logo te respondo. 🚀`);
        } catch (err) {
            setStatus('erro',
                'Não consegui enviar agora. Você pode mandar por ' +
                `<a href="${linkMailto(dados)}">e-mail</a> ou pelo ` +
                '<a href="https://wa.me/5511994842434" target="_blank" rel="noopener noreferrer">WhatsApp</a>.'
            );
        } finally {
            setLoading(false);
        }
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
    clone.setAttribute('aria-hidden', 'true');
    hs.parentNode.appendChild(clone);
})();

// ===== LINHA DO TEMPO =====
(function () {
    const trilho = document.querySelector('.lt-trilho');
    if (!trilho) return;

    const ERAS = {
        '2000': {
            href: 'tempo/2000.html',
            janela: '~*~ HoMePaGe Do ErIcK ~*~ - Internet Explorer',
            titulo: 'A era da internet discada',
            descricao: 'Página pessoal feita no Bloco de Notas, com tudo que a web tinha de mais "moderno" na virada do milênio.',
            tracos: ['Layout em tabelas, <font> e WordArt', 'Texto piscando e <marquee> no topo', 'Contador de visitas e livro de visitas', 'Rastro de estrelinhas e MIDI de fundo'],
            botao: 'Viajar para 2000'
        },
        '2005': {
            href: 'tempo/2005.html',
            janela: '.:: ERICK SILVA ::. web developer - v2.0',
            titulo: 'A era do Flash',
            descricao: 'Site "todo em Flash", com intro, som nos botões e um perfil de rede social cheio de recados e comunidades.',
            tracos: ['Intro com preloader travado em 87%', 'Abas animadas com som de clique', 'Selinhos 80x15 e lightbox nos projetos', 'Messenger com "chamar a atenção"'],
            botao: 'Viajar para 2005'
        },
        '2010': {
            href: 'tempo/2010.html',
            janela: 'Erick Silva :: Web Developer 2.0 (beta)',
            titulo: 'A era da Web 2.0',
            descricao: 'Tudo brilhando: gradientes glossy, reflexos, cantos arredondados e um selo BETA que nunca sai.',
            tracos: ['Botões glossy e logo com reflexo', 'Slider "em jQuery" e nuvem de tags', 'Widget de tweets e botão Curtir', 'Layout fixo em 960px'],
            botao: 'Viajar para 2010'
        },
        '2017': {
            href: 'tempo/2017.html',
            janela: 'Erick Silva | Web Developer & Designer',
            titulo: 'A era do flat design',
            descricao: 'Landing page de uma página só, gradiente roxo e rosa e uma animação pra cada scroll.',
            tracos: ['Partículas conectadas no hero', 'Texto digitando estilo typed.js', 'Barras de skill em porcentagem', 'Aviso de cookies e contadores animados'],
            botao: 'Viajar para 2017'
        },
        'hoje': {
            href: 'index.html',
            janela: 'Portfólio Erick│Dev',
            titulo: 'O presente',
            descricao: 'Este site que você está vendo agora: escuro, minimalista e cheio de pequenos detalhes.',
            tracos: ['Dark mode com glow e blobs animados', 'Efeito scramble nos títulos', 'Tipografia expressiva com Syne', 'Formulário que envia de verdade'],
            botao: 'Voltar ao início'
        },
        '2035': {
            href: 'tempo/2035.html',
            janela: 'EKS.AI — interface 2035',
            titulo: 'Uma espiada no futuro',
            descricao: 'Uma interface holográfica em vidro e neon, com o EKS AI, o meu assistente, respondendo perguntas sobre mim.',
            tracos: ['Holograma e chão em grade sci-fi', 'EKS AI com voz opcional', 'Skills orbitando um núcleo', 'Cards de projeto com inclinação 3D'],
            botao: 'Viajar para 2035'
        }
    };

    const marcos    = Array.from(trilho.querySelectorAll('.lt-marco'));
    const fill      = document.getElementById('ltFill');
    const janela    = document.getElementById('ltJanela');
    const url       = document.getElementById('ltUrl');
    const tela      = document.getElementById('ltTela');
    const frame     = document.getElementById('ltFrame');
    const info      = document.getElementById('ltInfo');
    const ano       = document.getElementById('ltAno');
    const titulo    = document.getElementById('ltTitulo');
    const descricao = document.getElementById('ltDescricao');
    const tracos    = document.getElementById('ltTracos');
    const viajar    = document.getElementById('ltViajar');
    const viajarTxt = document.getElementById('ltViajarTexto');

    // dentro de uma prévia (iframe) o site não carrega prévias de novo
    const embutido = window.self !== window.top;
    let visivel = false;
    let eraAtual = '2000';

    function ajustarEscala() {
        frame.style.transform = 'scale(' + (tela.clientWidth / 1280) + ')';
    }

    function carregarPrevia() {
        if (embutido || !visivel) return;
        const src = ERAS[eraAtual].href;
        if (frame.getAttribute('src') === src) return;
        tela.classList.add('carregando');
        frame.setAttribute('src', src);
    }

    frame.addEventListener('load', () => {
        if (frame.getAttribute('src')) tela.classList.remove('carregando');
    });

    function setLink(link, id) {
        const era = ERAS[id];
        if (id === 'hoje') {
            link.setAttribute('href', '#inicio');
            link.removeAttribute('data-viagem');
        } else {
            link.setAttribute('href', era.href);
            link.dataset.viagem = id;
        }
    }

    function selecionar(id, foco) {
        const era = ERAS[id];
        const indice = marcos.findIndex(m => m.dataset.era === id);
        eraAtual = id;

        marcos.forEach((m, i) => {
            const ativo = i === indice;
            m.setAttribute('aria-selected', ativo);
            m.tabIndex = ativo ? 0 : -1;
            m.classList.toggle('passado', i < indice);
        });
        if (foco) marcos[indice].focus();
        fill.style.width = (indice / (marcos.length - 1)) * 100 + '%';

        janela.dataset.era = id;
        url.textContent = era.janela;
        ano.textContent = id === 'hoje' ? new Date().getFullYear() : id;
        titulo.textContent = era.titulo;
        descricao.textContent = era.descricao;
        tracos.innerHTML = '';
        era.tracos.forEach(t => {
            const li = document.createElement('li');
            li.innerHTML = '<i class="bi bi-check2-circle"></i>';
            li.appendChild(document.createTextNode(t));
            tracos.appendChild(li);
        });
        viajarTxt.textContent = era.botao;
        setLink(viajar, id);
        setLink(tela, id);
        tela.setAttribute('aria-label', era.botao);

        // reinicia a animação de entrada do painel
        info.classList.remove('trocando');
        void info.offsetWidth;
        info.classList.add('trocando');

        carregarPrevia();
    }

    marcos.forEach(m => m.addEventListener('click', () => selecionar(m.dataset.era)));

    trilho.addEventListener('keydown', (e) => {
        const atual = marcos.findIndex(m => m.dataset.era === eraAtual);
        let proximo = null;
        if (e.key === 'ArrowRight') proximo = (atual + 1) % marcos.length;
        if (e.key === 'ArrowLeft')  proximo = (atual - 1 + marcos.length) % marcos.length;
        if (e.key === 'Home')       proximo = 0;
        if (e.key === 'End')        proximo = marcos.length - 1;
        if (proximo === null) return;
        e.preventDefault();
        selecionar(marcos[proximo].dataset.era, true);
    });

    // só carrega a prévia quando a seção chega perto da tela
    const obs = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        visivel = true;
        carregarPrevia();
        obs.disconnect();
    }, { rootMargin: '300px' });
    obs.observe(tela);

    if ('ResizeObserver' in window) new ResizeObserver(ajustarEscala).observe(tela);
    window.addEventListener('resize', ajustarEscala);
    ajustarEscala();

    selecionar('2000');
})();

// ===== ANO DO FOOTER =====
(function () {
    const ano = document.getElementById('anoAtual');
    if (ano) ano.textContent = new Date().getFullYear();
})();
