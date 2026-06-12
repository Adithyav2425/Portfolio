document.addEventListener('DOMContentLoaded', () => {

  // --- MOBILE MENU TOGGLE ---
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('mobile-active');
      
      // Animate burger menu bars
      const barTop = document.getElementById('bar-top');
      const barMiddle = document.getElementById('bar-middle');
      const barBottom = document.getElementById('bar-bottom');
      
      if (barTop && barMiddle && barBottom) {
        if (!isExpanded) {
          barTop.style.transform = 'translateY(6px) rotate(45deg)';
          barMiddle.style.opacity = '0';
          barBottom.style.transform = 'translateY(-6px) rotate(-45deg)';
        } else {
          barTop.style.transform = 'none';
          barMiddle.style.opacity = '1';
          barBottom.style.transform = 'none';
        }
      }
    });

    // Close mobile menu when link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('mobile-active');
        const barTop = document.getElementById('bar-top');
        const barMiddle = document.getElementById('bar-middle');
        const barBottom = document.getElementById('bar-bottom');
        if (barTop && barMiddle && barBottom) {
          barTop.style.transform = 'none';
          barMiddle.style.opacity = '1';
          barBottom.style.transform = 'none';
        }
      });
    });
  }

  // --- HERO TYPEWRITER EFFECT ---
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const words = JSON.parse(typewriterElement.getAttribute('data-words'));
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let currentText = '';
    
    const type = () => {
      const fullWord = words[wordIdx];
      
      if (isDeleting) {
        currentText = fullWord.substring(0, charIdx - 1);
        charIdx--;
      } else {
        currentText = fullWord.substring(0, charIdx + 1);
        charIdx++;
      }
      
      typewriterElement.textContent = currentText;
      
      let typeSpeed = isDeleting ? 40 : 100;
      
      if (!isDeleting && currentText === fullWord) {
        typeSpeed = 1500; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        typeSpeed = 400; // Pause before starting new word
      }
      
      setTimeout(type, typeSpeed);
    };
    
    // Start the typewriter loop
    setTimeout(type, 1000);
  }

  // --- INTERACTIVE HERO CARD (3D TILT) ---
  const heroCard = document.getElementById('interactive-hero-card');
  if (heroCard) {
    const handleMove = (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Calculate rotation scale (e.g. max 15 degrees)
      const rotX = (-y / (rect.height / 2)) * 12;
      const rotY = (x / (rect.width / 2)) * 12;
      
      heroCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    };
    
    const handleLeave = () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    };
    
    heroCard.parentNode.addEventListener('mousemove', handleMove);
    heroCard.parentNode.addEventListener('mouseleave', handleLeave);
  }

  // --- VIEWPORT OBSERVERS (REVEAL & SKILLS) ---
  const reveals = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-progress-bar');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // If the entry is a skills block, animate the progress bars
        if (entry.target.id === 'skills') {
          skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-progress');
            bar.style.width = targetWidth;
          });
        }
      }
    });
  }, observerOptions);

  reveals.forEach(el => sectionObserver.observe(el));
  
  // Also observe skills section itself specifically to trigger animation
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    sectionObserver.observe(skillsSection);
  }

  // --- ACTIVE NAVBAR LINKS ON SCROLL ---
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop;
      const sectionHeight = sec.clientHeight;
      if (window.scrollY >= sectionTop - 120) {
        currentId = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  });

  // --- CONTACT FORM SUBMISSION WITH TOASTS ---
  const contactForm = document.getElementById('contact-form');
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message) => {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">✓</span>
      <span class="toast-message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 4000);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('btn-submit');
      const origText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      // Simulate API submit delay
      setTimeout(() => {
        showToast('Message sent successfully, Adithya will connect soon!');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = origText;
        
        // Reset floating label states by forcing layout update
        document.querySelectorAll('.form-input').forEach(input => {
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
      }, 1200);
    });
  }
});
