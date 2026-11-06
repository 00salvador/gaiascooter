// Update these sample business details before publishing.
const SITE_CONFIG = {
  name: "GAIA SCOOTER REPAIR",
  location: "Vila Nova de Gaia, Portugal",
  whatsapp: "351910000000",
  phoneDisplay: "+351 910 000 000",
  email: "ola@volt.pt",
  address: "Vila Nova de Gaia, Portugal",
  hours: "Seg–Sex, 09:00–18:00"
};

const whatsappMessage = "Olá! Gostaria de solicitar um orçamento para reparar a minha trotinete elétrica.";
const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
const nav = document.querySelector(".primary-nav");
const menuToggle = document.querySelector(".menu-toggle");
const quoteForm = document.querySelector("#quote-form");
const feedback = document.querySelector("#form-feedback");

document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector(".whatsapp-float").href = whatsappUrl;

document.querySelectorAll("[data-config]").forEach((element) => {
  const key = element.dataset.config;
  if (SITE_CONFIG[key]) element.textContent = SITE_CONFIG[key];
});
document.querySelectorAll(`a[href^="tel:"]`).forEach((link) => {
  link.href = `tel:${SITE_CONFIG.whatsapp}`;
});
document.querySelectorAll(`a[href^="mailto:"]`).forEach((link) => {
  link.href = `mailto:${SITE_CONFIG.email}`;
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  nav.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}));

const serviceIssues = {
  "Reparação de baterias": "Bateria / autonomia",
  "Reparação de pneus": "Pneu / furo",
  "Reparação de motores": "Motor",
  "Reparação de travões": "Travões",
  "Problemas elétricos": "Problema elétrico",
  "Reparação de ecrãs": "Ecrã / comandos",
  "Manutenção geral": "Manutenção geral",
  "Diagnóstico técnico": "Outro / não sei"
};
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const issue = quoteForm.elements.issue;
    issue.value = serviceIssues[link.dataset.service] || "";
  });
});

const photoInput = quoteForm.elements.photos;
photoInput.addEventListener("change", () => {
  const files = [...photoInput.files];
  const name = files.length ? `${files.length} imagem${files.length === 1 ? "" : "s"} selecionada${files.length === 1 ? "" : "s"}` : "Nenhuma imagem selecionada";
  quoteForm.querySelector(".file-names").textContent = name;
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  feedback.classList.remove("error");
  if (quoteForm.elements.website.value) return;
  if (!quoteForm.reportValidity()) return;

  const data = new FormData(quoteForm);
  const text = [
    "Olá! Gostaria de solicitar um orçamento para reparar a minha trotinete elétrica.",
    "",
    `Nome: ${data.get("name")}`,
    `Telemóvel: ${data.get("phone")}`,
    `Email: ${data.get("email") || "Não indicado"}`,
    `Marca: ${data.get("brand")}`,
    `Modelo: ${data.get("model") || "Não indicado"}`,
    `Avaria: ${data.get("issue")}`,
    `Descrição: ${data.get("description")}`,
    `Contacto preferido: ${data.get("contact")}`,
    photoInput.files.length ? `Fotografias: vou anexar ${photoInput.files.length} imagem(ns) nesta conversa.` : ""
  ].filter(Boolean).join("\n");

  feedback.textContent = "A abrir o WhatsApp com o teu pedido. Confirma e envia a mensagem para concluir.";
  const url = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  const popup = window.open(url, "_blank");
  if (!popup) {
    feedback.classList.add("error");
    feedback.textContent = "O navegador bloqueou a nova janela. ";
    const fallbackLink = document.createElement("a");
    fallbackLink.href = url;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    fallbackLink.textContent = "Abre o WhatsApp aqui ↗";
    feedback.append(fallbackLink);
  } else {
    popup.opener = null;
  }
});

const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.querySelector("img").alt;
    lightbox.showModal();
    document.body.classList.add("dialog-open");
  });
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => document.body.classList.remove("dialog-open"));

const policies = {
  privacy: {
    title: "Privacidade",
    body: "<p>Esta página é um modelo inicial e não envia dados para uma base de dados. Ao preencher o pedido, os dados são colocados numa mensagem do WhatsApp e só serão partilhados se confirmares o envio na aplicação.</p><p>Não introduzas informação sensível. Antes de publicar o site, substitui este texto por uma política de privacidade adaptada à empresa e aos serviços que vieres a configurar.</p>"
  },
  cookies: {
    title: "Cookies",
    body: "<p>Este modelo não utiliza cookies de análise ou publicidade. Os serviços externos carregados nesta página, como Google Fonts, imagens e o mapa, podem ter as suas próprias políticas de privacidade.</p><p>Atualiza esta informação se adicionares ferramentas de análise, publicidade ou outras tecnologias de rastreio.</p>"
  },
  terms: {
    title: "Termos e condições",
    body: "<p>Os pedidos de orçamento não constituem uma proposta vinculativa. A reparação só deverá avançar após diagnóstico, apresentação do orçamento e aprovação do cliente.</p><p>Este texto é indicativo e deverá ser revisto para refletir as condições reais da empresa antes da publicação.</p>"
  }
};
const policyDialog = document.querySelector("#policy-dialog");
document.querySelectorAll("[data-policy]").forEach((button) => {
  button.addEventListener("click", () => {
    const policy = policies[button.dataset.policy];
    policyDialog.querySelector("h2").textContent = policy.title;
    policyDialog.querySelector(".policy-content").innerHTML = policy.body;
    policyDialog.showModal();
    document.body.classList.add("dialog-open");
  });
});
policyDialog.querySelector(".lightbox-close").addEventListener("click", () => policyDialog.close());
policyDialog.addEventListener("click", (event) => {
  if (event.target === policyDialog) policyDialog.close();
});
policyDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
