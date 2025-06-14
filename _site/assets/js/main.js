document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('aside a');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px', // Adjust the intersection area
    threshold: 0,
  };

  const observer = new window.IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to corresponding link
        const activeLink = document.querySelector(
          `aside a[href="#${entry.target.id}"]`
        );
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Handle click events on navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        // Update URL without jumping
        window.history.pushState(null, null, `#${targetId}`);
      }
    });
  });
});
