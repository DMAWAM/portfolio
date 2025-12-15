const items = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.15 });

items.forEach(item => observer.observe(item));
