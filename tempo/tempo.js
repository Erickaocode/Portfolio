// ===== MÁQUINA DO TEMPO =====
// Barra flutuante entre as eras + animação de "viagem" com o ano rolando.
// Qualquer link com data-viagem="2000|2010|2017|hoje" passa pela animação.
(function () {
    const script = document.currentScript;
    const base = script ? script.src : location.href;
    const ANO_ATUAL = new Date().getFullYear();

    const ERAS = [
        { id: '2000', nome: '2000', frase: 'A era da internet discada', href: new URL('2000.html', base).href },
        { id: '2005', nome: '2005', frase: 'A era do Flash',            href: new URL('2005.html', base).href },
        { id: '2010', nome: '2010', frase: 'A era da Web 2.0',         href: new URL('2010.html', base).href },
        { id: '2017', nome: '2017', frase: 'A era do flat design',      href: new URL('2017.html', base).href },
        { id: 'hoje', nome: 'Hoje', frase: 'De volta ao presente',      href: new URL('../index.html#linha-do-tempo', base).href },
        { id: '2035', nome: '2035', frase: 'Uma espiada no futuro',     href: new URL('2035.html', base).href }
    ];

    const embutido = window.self !== window.top;
    const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const eraAtual = document.body.dataset.era || 'hoje';

    if (embutido) document.documentElement.classList.add('mt-embed');

    function anoDe(id) { return id === 'hoje' ? ANO_ATUAL : Number(id); }
    function eraPorId(id) { return ERAS.find(e => e.id === id); }

    // ===== OVERLAY =====
    let warp = null;
    function criarWarp() {
        if (warp) return warp;
        warp = document.createElement('div');
        warp.className = 'mt-warp';
        warp.setAttribute('aria-hidden', 'true');
        warp.innerHTML =
            '<div class="mt-warp-brilho"></div>' +
            '<div class="mt-warp-tunel"></div>' +
            '<div class="mt-warp-label">Viajando no tempo</div>' +
            '<div class="mt-warp-ano">' + anoDe(eraAtual) + '</div>' +
            '<div class="mt-warp-destino"></div>';
        document.body.appendChild(warp);
        return warp;
    }

    function viajar(destinoId, href) {
        const destino = eraPorId(destinoId);
        if (!destino) { location.href = href; return; }
        try { sessionStorage.setItem('mt-chegada', destinoId); } catch (e) { /* modo privado */ }
        if (reduzMovimento) { location.href = href; return; }

        const el = criarWarp();
        const anoEl = el.querySelector('.mt-warp-ano');
        const destinoEl = el.querySelector('.mt-warp-destino');
        const de = anoDe(eraAtual);
        const para = anoDe(destinoId);
        const duracao = 1100;
        destinoEl.textContent = 'Destino: ' + destino.nome + ' · ' + destino.frase;
        anoEl.textContent = de;
        requestAnimationFrame(() => el.classList.add('ativo'));

        const inicio = performance.now() + 250;
        function passo(agora) {
            const t = Math.min(Math.max((agora - inicio) / duracao, 0), 1);
            const suave = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            anoEl.textContent = Math.round(de + (para - de) * suave);
            if (t < 1) requestAnimationFrame(passo);
            else setTimeout(() => { location.href = href; }, 220);
        }
        requestAnimationFrame(passo);
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-viagem]');
        if (!link || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
        if (embutido) { e.preventDefault(); return; }
        e.preventDefault();
        viajar(link.dataset.viagem, link.href);
    });

    // ===== CHEGADA =====
    function chegar() {
        let chegada = null;
        try {
            chegada = sessionStorage.getItem('mt-chegada');
            sessionStorage.removeItem('mt-chegada');
        } catch (e) { /* modo privado */ }
        document.documentElement.classList.remove('mt-chegando');
        if (!chegada || reduzMovimento || embutido) return;

        const el = criarWarp();
        el.querySelector('.mt-warp-ano').textContent = anoDe(chegada);
        el.querySelector('.mt-warp-label').textContent = 'Você chegou em';
        el.style.transition = 'none';
        el.classList.add('ativo');
        el.offsetHeight; // força o estilo antes de ligar a transição de novo
        el.style.transition = 'opacity 0.7s ease 0.35s';
        el.classList.remove('ativo');
    }
    chegar();

    // voltar pelo navegador restaura a página do cache já com o overlay ligado
    window.addEventListener('pageshow', (e) => {
        if (e.persisted && warp) warp.classList.remove('ativo');
    });

    // ===== BARRA FLUTUANTE (só nas páginas de era) =====
    if (!document.body.dataset.era || embutido) return;

    const barra = document.createElement('nav');
    barra.className = 'mt-barra';
    barra.setAttribute('aria-label', 'Máquina do tempo');
    barra.innerHTML =
        '<div class="mt-barra-titulo">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M9 2h6"/></svg>' +
            '<span>Máquina do tempo</span>' +
        '</div>' +
        '<div class="mt-barra-eras">' +
            ERAS.map(e =>
                '<a href="' + e.href + '" data-viagem="' + e.id + '"' +
                (e.id === eraAtual ? ' aria-current="page"' : '') + '>' + e.nome + '</a>'
            ).join('') +
        '</div>';
    document.body.appendChild(barra);
    document.body.style.paddingBottom = '80px';
})();
