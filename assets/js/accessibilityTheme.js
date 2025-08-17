(() => {
    "use strict";

    // ======== CONFIGURAÇÕES INICIAIS ========
    const DEFAULT_BASE = 16; // tamanho base de referência em pixels
    const fonteMin = 12; // tamanho mínimo da fonte
    const fonteMax = 28; // tamanho máximo da fonte

    let tamanhoFonte =
        parseInt(localStorage.getItem("fontSize"), 10) || DEFAULT_BASE;

    // ======== ELEMENTOS DO DOM ========
    const painel = document.getElementById("painelAcessibilidade");
    const btnToggleAcess = document.getElementById("btnToggleAcessibilidade");
    const btnAumentar = document.getElementById("btnAumentarFonte");
    const btnDiminuir = document.getElementById("btnDiminuirFonte");
    const btnFontePadrao = document.getElementById("btnFontePadrao");
    const btnAltoContraste = document.getElementById("btnAltoContraste");
    const btnRemoverPainel = document.getElementById("btnRemoverPainel");
    const toggleButton = document.getElementById("themeToggle");

    const body = document.body;
    const navbar = document.querySelector(".navbar");
    const footer = document.querySelector("footer");
    const sections = document.querySelectorAll(
        "section:not(#painelAcessibilidade)"
    );
    const loading = document.getElementById("loading"); // <-- adicionando loading

    // Utilitário
    const on = (el, evt, fn) => {
        if (el) el.addEventListener(evt, fn);
    };

    // ======== FUNÇÃO: armazenar tamanhos originais ========
    function storeOriginalSizes(root = document.body) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode(node) {
                    const tag = node.tagName.toLowerCase();
                    if (tag === "script" || tag === "style")
                        return NodeFilter.FILTER_REJECT;
                    if (node.id === "painelAcessibilidade")
                        return NodeFilter.FILTER_REJECT;
                    if (
                        node.classList &&
                        node.classList.contains("material-icons")
                    )
                        return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                },
            },
            false
        );

        let node;
        while ((node = walker.nextNode())) {
            if (!node.dataset.originalFontSize) {
                const cs = window.getComputedStyle(node).fontSize;
                const val = parseFloat(cs) || DEFAULT_BASE;
                node.dataset.originalFontSize = String(val);
            }
        }

        [btnToggleAcess, btnTopo].forEach((btn) => {
            if (btn && !btn.dataset.originalFontSize) {
                const cs = window.getComputedStyle(btn).fontSize;
                btn.dataset.originalFontSize = String(
                    parseFloat(cs) || DEFAULT_BASE
                );
            }
        });
    }

    storeOriginalSizes();

    const mo = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            m.addedNodes.forEach((n) => {
                if (n.nodeType === Node.ELEMENT_NODE) storeOriginalSizes(n);
            });
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // ======== FUNÇÃO: aplicar fonte escalada ========
    function aplicarFonte() {
        const scale = tamanhoFonte / DEFAULT_BASE;

        document.querySelectorAll("[data-original-font-size]").forEach((el) => {
            const orig =
                parseFloat(el.dataset.originalFontSize) || DEFAULT_BASE;
            el.style.fontSize =
                Math.max(fonteMin, Math.min(fonteMax * 2, orig * scale)) + "px";
        });

        [btnToggleAcess, btnTopo].forEach((btn) => {
            if (btn) {
                const origSize = parseFloat(btn.dataset.originalFontSize);
                const newSize = Math.max(
                    fonteMin,
                    Math.min(fonteMax * 2, origSize * scale)
                );
                btn.style.fontSize = newSize + "px";
                btn.style.width = newSize * 2 + "px";
                btn.style.height = newSize * 2 + "px";
            }
        });

        localStorage.setItem("fontSize", String(tamanhoFonte));
    }

    function resetFontePadrao() {
        tamanhoFonte = DEFAULT_BASE;
        aplicarFonte();
        body.classList.remove("alto-contraste");
        localStorage.removeItem("fontSize");
        localStorage.removeItem("altoContraste");
    }

    // ======== Painel de acessibilidade ========
    function abrirPainel() {
        if (!painel) return;
        painel.style.display = "block";
        painel.setAttribute("aria-hidden", "false");
        const primeira = painel.querySelector("button, [tabindex], input, a");
        if (primeira) primeira.focus();
    }
    function fecharPainel() {
        if (!painel) return;
        painel.style.display = "none";
        painel.setAttribute("aria-hidden", "true");
        if (btnToggleAcess) btnToggleAcess.focus();
    }

    on(btnToggleAcess, "click", (e) => {
        e.stopPropagation();
        if (!painel) return;
        const vis = painel.style.display === "block";
        vis ? fecharPainel() : abrirPainel();
    });

    document.addEventListener("click", (e) => {
        if (!painel) return;
        if (
            painel.style.display === "block" &&
            !painel.contains(e.target) &&
            e.target !== btnToggleAcess
        ) {
            fecharPainel();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && painel && painel.style.display === "block") {
            fecharPainel();
        }
    });

    on(btnRemoverPainel, "click", () => {
        const menu = document.getElementById("menuAcessibilidade");
        if (menu) menu.style.display = "none";
    });

    // ======== Botões de fonte ========
    on(btnAumentar, "click", () => {
        if (tamanhoFonte < fonteMax) {
            tamanhoFonte += 2;
            aplicarFonte();
        }
    });
    on(btnDiminuir, "click", () => {
        if (tamanhoFonte > fonteMin) {
            tamanhoFonte -= 2;
            aplicarFonte();
        }
    });
    on(btnFontePadrao, "click", resetFontePadrao);

    // ======== Alto contraste ========
    on(btnAltoContraste, "click", () => {
        body.classList.toggle("alto-contraste");
        const onFlag = body.classList.contains("alto-contraste");
        localStorage.setItem("altoContraste", onFlag ? "1" : "0");
    });

    // ======== Dark mode ========
    function setTheme(theme) {
        const isDark = theme === "dark";
        const carouselButtons = document.querySelectorAll(
            ".carousel-control-prev, .carousel-control-next"
        );

        if (isDark) {
            body.classList.add("dark-mode");
            if (navbar) navbar.classList.add("dark-mode");
            if (footer) footer.classList.add("dark-mode");
            sections.forEach((s) => s.classList.add("dark-mode"));
            if (painel) painel.classList.add("dark-mode");
            if (loading) loading.classList.add("dark-mode"); // <-- aqui
            carouselButtons.forEach((btn) => btn.classList.add("dark-mode"));
            if (toggleButton) toggleButton.textContent = "☀️";
        } else {
            body.classList.remove("dark-mode");
            if (navbar) navbar.classList.remove("dark-mode");
            if (footer) footer.classList.remove("dark-mode");
            sections.forEach((s) => s.classList.remove("dark-mode"));
            if (painel) painel.classList.remove("dark-mode");
            if (loading) loading.classList.remove("dark-mode"); // <-- aqui
            carouselButtons.forEach((btn) => btn.classList.remove("dark-mode"));
            if (toggleButton) toggleButton.textContent = "🌙";
        }

        localStorage.setItem("theme", theme);
    }

    on(toggleButton, "click", () => {
        setTheme(body.classList.contains("dark-mode") ? "light" : "dark");
    });

    // ======== Inicialização ========
    (function init() {
        storeOriginalSizes();
        aplicarFonte();

        if (localStorage.getItem("altoContraste") === "1") {
            body.classList.add("alto-contraste");
        }

        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);

        if (painel)
            painel.setAttribute(
                "aria-hidden",
                painel.style.display === "block" ? "false" : "true"
            );
    })();
})();
