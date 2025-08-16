/* ========================
   ELEMENTOS GERAIS
======================== */
const links = document.querySelectorAll("#menu .nav-link");
const menu = document.getElementById("menu");
const btnTopo = document.getElementById("btnTopo");
const seletor = document.getElementById("seletorMapa");
const iframe = document.getElementById("iframeMapa");

/* ========================
   FUNÇÃO MODAL DE IMAGENS
======================== */
function abrirModal(src) {
    document.getElementById("imgModal").src = src;
    var modal = new bootstrap.Modal(document.getElementById("modalImagem"));
    modal.show();
}

// Filtragem por modalidade
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");
        galleryItems.forEach((item) => {
            item.style.display = item.classList.contains(filter)
                ? "block"
                : "none";
        });
    });
});
/* ========================
   BOTÃO VOLTAR AO TOPO
======================== */
window.addEventListener("scroll", () => {
    btnTopo.style.display = window.scrollY > 300 ? "block" : "none";
});
btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ========================
   FECHAR MENU MOBILE AO CLICAR
======================== */
links.forEach((link) => {
    link.addEventListener("click", () => {
        if (menu.classList.contains("show")) {
            new bootstrap.Collapse(menu).toggle();
        }
    });
});

/* ========================
   TROCA DE MAPA NO DROPDOWN
======================== */
if (seletor && iframe) {
    seletor.addEventListener("change", () => {
        iframe.src = seletor.value;
    });
}
