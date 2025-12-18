document.addEventListener("DOMContentLoaded", () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const line1El = document.getElementById("tw-line1");
    const line2El = document.getElementById("tw-line2");
    const gradEl  = document.getElementById("tw-grad");

    const line1 = "Leiter Produktionsinformatik";
    const line2 = "und Student ";
    const grad  = "Digital Business & AI";

    // Fallback: wenn Motion reduziert ist, direkt alles anzeigen
    if (prefersReduced) {
        line1El.textContent = line1;
        line2El.textContent = line2;
        gradEl.textContent  = grad;
        return;
    }

    // Optional: Start leer (falls SSR / Cache)
    line1El.textContent = "";
    line2El.textContent = "";
    gradEl.textContent  = "";

    const speed = 35;      // Tippgeschwindigkeit (ms)
    const pause = 250;     // Pause zwischen Segmenten

    function typeText(el, text, ms) {
        return new Promise((resolve) => {
            let i = 0;
            const tick = () => {
                el.textContent += text.charAt(i);
                i += 1;
                if (i < text.length) {
                    setTimeout(tick, ms);
                } else {
                    resolve();
                }
            };
            tick();
        });
    }

    (async () => {
        await typeText(line1El, line1, speed);
        await new Promise(r => setTimeout(r, pause));
        await typeText(line2El, line2, speed);
        await typeText(gradEl,  grad,  speed);
    })();
});
