(() => {
    const form = document.getElementById("contact-form");
    const success = document.getElementById("form-success");

    if (!form || !success) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { Accept: "application/json" }
            });

            if (response.ok) {
                form.reset();
                form.style.display = "none";
                success.hidden = false;
            } else {
                alert("Beim Senden ist etwas schiefgelaufen. Bitte versuche es später erneut.");
            }
        } catch (error) {
            alert("Netzwerkfehler. Bitte überprüfe deine Verbindung.");
        }
    });
})();
