const audioNode = document.getElementById('loveAudio');
let activePageIndex = 1;
let scratchInitialized = false;
let linkGeradoParaCompartilhar = "";

const versesCollection = [
    "Desde o instante em que sua vida se entrelaçou à minha, percebi que o amor verdadeiro não é um mytho, mas sim o reino que construímos através da cumplicidade mútua.",
    "Nossos capítulos não foram escritos por acaso, mas sim lapidados com o ouro da lealdade e o afeto mais puro que um peito humano pode abrigar.",
    "Prometo ser seu porto seguro em meio às guerras do cotidiano e a sua coroa de alegria nos momentos de vitória. Te amo além das barreiras do tempo.",
    "Não existem pergaminhos ou canções capazes de registrar a imensidão do bem que você me faz. Você é, e sempre será, a minha dinastia perfeita."
];

function switchEditorTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    document.getElementById('tab-' + tabId).classList.add('active');
}

function updateSliders() {
    const speed = document.getElementById('sliderSpeed').value;
    const opacity = document.getElementById('sliderOpacity').value / 10;
    
    document.getElementById('labelSpeed').innerText = speed + 's';
    document.getElementById('labelOpacity').innerText = opacity;

    document.documentElement.style.setProperty('--particle-speed', speed + 's');
    document.documentElement.style.setProperty('--particle-opacity', opacity);
    
    changeAmbientEffect();
}

function changeAmbientEffect() {
    const container = document.getElementById('particlesContainer');
    container.innerHTML = '';
    
    const effect = document.getElementById('particleSelect').value;
    const quantity = window.innerWidth < 768 ? 8 : 22;

    for(let i=0; i<quantity; i++) {
        const node = document.createElement('div');
        node.classList.add('particle');
        
        const dimension = Math.random() * 20 + 15;
        node.style.width = dimension + 'px';
        node.style.height = dimension + 'px';
        node.style.left = Math.random() * 100 + 'vw';
        node.style.top = Math.random() * 100 + 'vh';

        if (effect === 'stars') {
            node.style.backgroundImage = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='%23d4af37' viewBox='0 0 24 24'><path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/></svg>")`;
            node.style.animation = `fallingGold var(--particle-speed) infinite linear`;
        } else if (effect === 'hearts') {
            node.style.backgroundImage = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='%23d4af37' viewBox='0 0 24 24'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>")`;
            node.style.animation = `floatUpwards var(--particle-speed) infinite ease-in-out`;
        } else if (effect === 'leaves') {
            node.style.backgroundImage = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='%23f3e5ab' viewBox='0 0 24 24'><path d='M17 8c8-1 8 8 0 8s-8-9 0-8z'/></svg>")`;
            node.style.animation = `fallingGold var(--particle-speed) infinite linear`;
        } else if (effect === 'drift') {
            node.style.border = "1px solid var(--accent-pink)";
            node.style.borderRadius = "50%";
            node.style.boxShadow = "0 0 10px var(--accent-purple)";
            node.style.animation = `cosmicDrift var(--particle-speed) infinite ease`;
        }

        node.style.animationDelay = (Math.random() * 6) + 's';
        container.appendChild(node);
    }
}

function applyGlobalTheme() {
    const theme = document.getElementById('themeSelect').value;
    if(theme === 'default') document.body.removeAttribute('data-theme');
    else document.body.setAttribute('data-theme', theme);
    changeAmbientEffect();
    if(scratchInitialized) setupScratchCanvas(); 
}

function applyLetterStyle() {
    const font = document.getElementById('fontSelect').value;
    const border = document.getElementById('frameSelect').value;
    
    document.querySelectorAll('.letter-paper').forEach(paper => {
        paper.style.fontFamily = font;
        paper.classList.remove('framed-classic', 'framed-modern');
        if(border !== 'none') paper.classList.add(border);
    });
}

function injectInspiringVerse(pageIdx) {
    const targetInput = pageIdx === 1 ? 'p1TextInput' : 'p4TextInput';
    const randomPick = Math.floor(Math.random() * versesCollection.length);
    document.getElementById(targetInput).value = versesCollection[randomPick];
    syncLiveOutputData();
}

function handleMusicSelection() {
    const sel = document.getElementById('musicSelect');
    const urlGroup = document.getElementById('customUrlGroup');
    const trackLabel = document.getElementById('renderedTrackLabel');
    
    let locTrack = sel.value;
    if(sel.value === 'custom') {
        urlGroup.style.display = 'flex';
        locTrack = document.getElementById('customMusicUrl').value;
        trackLabel.innerText = "Trilha Customizada 🎵";
    } else {
        urlGroup.style.display = 'none';
        trackLabel.innerText = sel.options[sel.selectedIndex].text;
    }

    if(locTrack.trim() !== "") {
        audioNode.src = locTrack;
        audioNode.load();
    }
}

function syncLiveOutputData() {
    document.getElementById('r1Title').innerText = document.getElementById('p1TitleInput').value;
    document.getElementById('r1Text').innerText = document.getElementById('p1TextInput').value;
    const img1 = document.getElementById('p1ImgInput').value;
    if(img1.trim() !== "") {
        document.getElementById('r1Img').src = img1;
        document.getElementById('r1ImgBox').style.display = 'block';
    } else { document.getElementById('r1ImgBox').style.display = 'none'; }

    document.getElementById('r2Date1').innerText = document.getElementById('tlDate1').value;
    document.getElementById('r2Desc1').innerText = document.getElementById('tlDesc1').value;
    document.getElementById('r2Date2').innerText = document.getElementById('tlDate2').value;
    document.getElementById('r2Desc2').innerText = document.getElementById('tlDesc2').value;

    document.getElementById('r3Title').innerText = document.getElementById('p3TitleInput').value;
    document.getElementById('r3Text').innerText = document.getElementById('p3TextInput').value;
    document.getElementById('r3Img').src = document.getElementById('p3ImgInput').value;

    document.getElementById('r4Title').innerText = document.getElementById('p4TitleInput').value;
    document.getElementById('r4Text').innerText = document.getElementById('p4TextInput').value;
}

function changePage3D(targetPageIdx) {
    const currentPage = document.getElementById('renderPage' + activePageIndex);
    const nextPage = document.getElementById('renderPage' + targetPageIdx);

    if(targetPageIdx > activePageIndex) {
        currentPage.classList.add('page-turned-left');
    } else {
        nextPage.classList.remove('page-turned-left');
    }

    currentPage.classList.remove('active-page');
    nextPage.classList.add('active-page');
    
    activePageIndex = targetPageIdx;

    if(targetPageIdx === 3 && !scratchInitialized) {
        setTimeout(setupScratchCanvas, 300);
    }
    
    if(targetPageIdx === 4) {
        const noBtn = document.getElementById('runawayNoButton');
        noBtn.style.position = 'relative';
        noBtn.style.left = '0px';
        noBtn.style.top = '0px';
    }
}

function setupScratchCanvas() {
    const canvas = document.getElementById('scratchCanvasElement');
    const ctx = canvas.getContext('2d');
    const wrapper = canvas.parentElement;
    
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    const estiloCor = getComputedStyle(document.documentElement).getPropertyValue('--accent-pink').trim() || '#d4af37';
    
    ctx.fillStyle = estiloCor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < 100; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 3, 3);
    }

    ctx.font = 'bold 14px Cinzel, serif';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-dark').trim() || '#120720';
    ctx.textAlign = 'center';
    ctx.fillText('👑 CAMADA REAL DE PROTEÇÃO 👑', canvas.width / 2, canvas.height / 2);

    let isDrawing = false;

    function scratch(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('touchstart', () => isDrawing = true);
    window.addEventListener('mouseup', () => isDrawing = false);
    window.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', scratch);

    scratchInitialized = true;
}

function makeNoButtonFlee(event) {
    if (event) event.preventDefault();
    const noBtn = document.getElementById('runawayNoButton');
    const container = document.getElementById('decisionContainerArea');
    
    const padX = container.clientWidth - noBtn.clientWidth;
    const padY = 130;

    const randomX = Math.floor(Math.random() * padX) - (padX / 2);
    const randomY = Math.floor(Math.random() * padY) - (padY / 2);

    noBtn.style.position = 'absolute';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

function celebrateLoveAcceptance() {
    const colorsArray = ['#d4af37', '#f3e5ab', '#ffffff', '#aa7c11'];
    
    const duration = 4 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 },
            colors: colorsArray
        });
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 },
            colors: colorsArray
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    alert("👑 Resposta perfeita! O reino do amor está em festa! ❤️");
}

function openInteractiveBooklet() {
    document.getElementById('envelopeWrapper').classList.add('open');
    document.getElementById('interactionHint').style.opacity = '0';
    syncLiveOutputData();

    setTimeout(() => {
        document.getElementById('bookletModalOverlay').classList.add('active');
        audioNode.play().then(() => {
            document.getElementById('controlIcon').innerText = '❚❚';
        }).catch(() => {
            document.getElementById('controlIcon').innerText = '▶';
        });
    }, 600);
}

function closeInteractiveBooklet() {
    document.getElementById('bookletModalOverlay').classList.remove('active');
    setTimeout(() => {
        document.getElementById('envelopeWrapper').classList.remove('open');
        document.getElementById('interactionHint').style.opacity = '1';
        audioNode.pause();
        
        document.querySelectorAll('.letter-paper').forEach(p => p.classList.remove('page-turned-left','active-page'));
        document.getElementById('renderPage1').classList.add('active-page');
        activePageIndex = 1;
        scratchInitialized = false; 
    }, 400);
}

function toggleAudioPlayback(e) {
    e.stopPropagation();
    if(audioNode.paused) {
        audioNode.play();
        document.getElementById('controlIcon').innerText = '❚❚';
    } else {
        audioNode.pause();
        document.getElementById('controlIcon').innerText = '▶';
    }
}

function compileAndCopyPremiumLink() {
    const data = {
        t1: document.getElementById('p1TitleInput').value,
        x1: document.getElementById('p1TextInput').value,
        i1: document.getElementById('p1ImgInput').value,
        d1: document.getElementById('tlDate1').value,
        m1: document.getElementById('tlDesc1').value,
        d2: document.getElementById('tlDate2').value,
        m2: document.getElementById('tlDesc2').value,
        t3: document.getElementById('p3TitleInput').value,
        x3: document.getElementById('p3TextInput').value,
        i3: document.getElementById('p3ImgInput').value,
        t4: document.getElementById('p4TitleInput').value,
        x4: document.getElementById('p4TextInput').value,
        th: document.getElementById('themeSelect').value,
        pr: document.getElementById('particleSelect').value,
        fn: document.getElementById('fontSelect').value,
        fr: document.getElementById('frameSelect').value,
        ms: document.getElementById('musicSelect').value === 'custom' ? document.getElementById('customMusicUrl').value : document.getElementById('musicSelect').value
    };

    const compressedPayload = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    const buildUrl = window.location.href.split('?')[0] + `?package=${compressedPayload}`;

    linkGeradoParaCompartilhar = buildUrl;
    
    document.getElementById('whatsappShareBox').style.display = 'flex';

    if(navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(buildUrl).then(() => {
            alert("✨ Link Imperial Gold criado! A caixa de envio direto por WhatsApp foi liberada logo abaixo.");
        });
    } else {
        alert("Link gerado! Use a seção do WhatsApp abaixo para configurar o envio.");
    }
}

function shareOnWhatsapp() {
    if(!linkGeradoParaCompartilhar) {
        alert("Por favor, clique em 'Gerar e Copiar Link' primeiro!");
        return;
    }

    let numeroDestinatario = document.getElementById('whatsappNumberInput').value.replace(/\D/g, '');
    
    if(!numeroDestinatario) {
        alert("Por favor, digite o número de telefone completo com DDD!");
        return;
    }

    if (numeroDestinatario.length <= 11) {
        numeroDestinatario = "55" + numeroDestinatario;
    }
    
    const textoMensagem = "👑 Preparei algo muito especial para você... Toque no selo real para abrir: ";
    
    window.open(`https://api.whatsapp.com/send?phone=${numeroDestinatario}&text=${encodeURIComponent(textoMensagem + linkGeradoParaCompartilhar)}`, '_blank');
}

function readPackageUrlStream() {
    const urlQuery = new URLSearchParams(window.location.search);
    if(urlQuery.has('package')) {
        try {
            document.body.classList.add('view-mode');
            const decrypted = JSON.parse(decodeURIComponent(escape(atob(urlQuery.get('package')))));
            
            document.getElementById('p1TitleInput').value = decrypted.t1;
            document.getElementById('p1TextInput').value = decrypted.x1;
            document.getElementById('p1ImgInput').value = decrypted.i1;
            document.getElementById('tlDate1').value = decrypted.d1;
            document.getElementById('tlDesc1').value = decrypted.m1;
            document.getElementById('tlDate2').value = decrypted.d2;
            document.getElementById('tlDesc2').value = decrypted.m2;
            document.getElementById('p3TitleInput').value = decrypted.t3;
            document.getElementById('p3TextInput').value = decrypted.x3;
            document.getElementById('p3ImgInput').value = decrypted.i3;
            document.getElementById('p4TitleInput').value = decrypted.t4;
            document.getElementById('p4TextInput').value = decrypted.x4;
            document.getElementById('themeSelect').value = decrypted.th;
            document.getElementById('particleSelect').value = decrypted.pr;
            document.getElementById('fontSelect').value = decrypted.fn;
            document.getElementById('frameSelect').value = decrypted.fr;
            
            audioNode.src = decrypted.ms;
            audioNode.load();
            
            applyGlobalTheme();
            applyLetterStyle();
            handleMusicSelection();

            setTimeout(() => {
                openInteractiveBooklet();
            }, 500);
        } catch(e) { console.error("Erro na leitura estrutural do payload da URL."); }
    } else {
        handleMusicSelection();
    }
    syncLiveOutputData();
    changeAmbientEffect();
}

window.onload = () => { readPackageUrlStream(); };