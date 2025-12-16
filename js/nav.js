(() => {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#site-nav");

    if (!header || !toggle || !nav) return;

    const setOpen = (open) => {
        header.classList.toggle("nav-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    };

    toggle.addEventListener("click", () => {
        const isOpen = header.classList.contains("nav-open");
        setOpen(!isOpen);
    });

    // Close on link click
    nav.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (link) setOpen(false);
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setOpen(false);
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
        if (!header.classList.contains("nav-open")) return;
        if (e.target.closest(".site-header")) return;
        setOpen(false);
    });
})();
