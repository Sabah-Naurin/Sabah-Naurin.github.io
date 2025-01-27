document.addEventListener('DOMContentLoaded', () => {
    // Fetch the sidebar HTML file
    fetch('sidebar.html')
      .then(response => response.text())
      .then(data => {
        // Insert the sidebar HTML into the placeholder div
        document.getElementById('sidebar').innerHTML = data;
  
        // Set the active class based on the current page
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === currentPage) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      })
      .catch(error => console.error('Error loading sidebar:', error));
  });
  