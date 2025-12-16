const openBtn = document.getElementById('openProjectModal');
const dialog = document.getElementById('projectModal');
const closeBtn = document.getElementById('closeProjectModal');

openBtn?.addEventListener('click', (e) => {
    e.preventDefault(); // verhindert Link-Navigation
    dialog.showModal();
});

closeBtn?.addEventListener('click', () => {
    dialog.close();
});

// Klick ausserhalb schliesst Modal
dialog?.addEventListener('click', (e) => {
    const panel = dialog.querySelector('.modal__panel');
    if (!panel.contains(e.target)) dialog.close();
});
