const CONFIG = {
  telegram: "https://t.me/Shavkatov_Sultonbek_722",
  instagram: "https://www.instagram.com/bizning_class?utm_source=ig_web_button_share_sheet&vrfl=ZDNlZDc0MzIxNw=="
};
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("#menuToggle");
  const navLinks = document.querySelector("#navLinks");
  const navItems = document.querySelectorAll(".nav-link");

  // 1. Mobil menyu
  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Menyuni ochish");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Menyuni yopish" : "Menyuni ochish"
    );
  });

  navItems.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (
      navLinks.classList.contains("open") &&
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // 2. Sahifa bo'limlarining animatsiyasi
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // 3. Navigatsiyada faol bo'limni ko'rsatish
  const sections = document.querySelectorAll(
    "#top, #about, #services, #location, #contact"
  );

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navItems.forEach((link) => {
            const active =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", active);
          });
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // 4. Yilni avtomatik chiqarish
  document.querySelector("#currentYear").textContent =
    new Date().getFullYear();

  // 5. Ijtimoiy tarmoqlar
  document.querySelectorAll("[data-social]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const platform = link.dataset.social;
      const profile = CONFIG[platform];

      if (profile && /^https:\/\/(t\.me|telegram\.me|www\.instagram\.com|instagram\.com)\//i.test(profile)) {
        return;
      }

      event.preventDefault();

      alert(
        platform === "telegram"
          ? "Telegram profilingiz havolasini js/script.js faylidagi CONFIG.telegram qismiga kiriting."
          : "Instagram profilingiz havolasini js/script.js faylidagi CONFIG.instagram qismiga kiriting."
      );
    });
  });

  // 6. Xizmat tugmasi bosilganda formadagi xizmatni tanlash
  const serviceSelect = document.querySelector("#serviceType");

  document.querySelectorAll("[data-service]").forEach((button) => {
    button.addEventListener("click", () => {
      const service = button.dataset.service;

      const matchingOption = [...serviceSelect.options].find(
        (option) => option.textContent.trim() === service
      );

      if (matchingOption) {
        serviceSelect.value = matchingOption.value;
      }

      document.querySelector("#contact-form").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      setTimeout(() => serviceSelect.focus({ preventScroll: true }), 400);
    });
  });

  // 7. Telegram orqali so'rov matnini tayyorlash
  const form = document.querySelector("#serviceForm");
  const formNote = document.querySelector("#formNote");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const name = document.querySelector("#customerName").value.trim();
    const contact = document.querySelector("#customerContact").value.trim();
    const service = serviceSelect.value;
    const message = document.querySelector("#customerMessage").value.trim();

    const text = [
      "LASER LUXE — xizmat so'rovi",
      "",
      `Ism: ${name}`,
      `Aloqa: ${contact || "Ko'rsatilmagan"}`,
      `Xizmat: ${service}`,
      `Qo'shimcha ma'lumot: ${message || "Yo'q"}`,
      "",
      "Hudud: Jiydakapa, Namangan viloyati"
    ].join("\n");

    const telegramUrl = CONFIG.telegram;

    if (telegramUrl) {
      // Egasi ko'rsatgan Telegram bot yoki profilga o'tish.
      const url = new URL(telegramUrl);

      if (url.protocol !== "https:") {
        formNote.textContent =
          "Telegram havolasi HTTPS formatida bo'lishi kerak.";
        return;
      }

      // Profilga oddiy o'tish so'rovni avtomatik yubormaydi.
      // Shuning uchun matnni clipboardga nusxalaymiz.
      navigator.clipboard?.writeText(text).catch(() => {});

      window.open(url.href, "_blank", "noopener,noreferrer");

      formNote.textContent =
        "Telegram ochildi. Xabar matnini nusxalab, suhbatga yuboring.";
      return;
    }

    // Profil hali kiritilmagan bo'lsa, Telegram ulashish oynasi.
    const shareUrl = new URL("https://t.me/Shavkatov_Sultonbek_722");
    shareUrl.searchParams.set("url", window.location.href);
    shareUrl.searchParams.set("text", text);

    window.open(shareUrl.href, "_blank", "noopener,noreferrer");

    formNote.textContent =
      "Telegramda suhbatni tanlang. Bu ulashish oynasi xabarni egasiga avtomatik yubormaydi.";
  });
});
