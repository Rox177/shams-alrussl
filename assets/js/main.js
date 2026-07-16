/**
 * Shams Al-Russl General Contracting - Custom Interactive JS
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Page Loader
  const loader = document.querySelector('.loader-wrap');
  if (loader) {
    window.addEventListener('load', () => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    });
    
    // Fallback if load event already fired or is slow
    setTimeout(() => {
      if (loader.style.display !== 'none') {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 600);
      }
    }, 2000);
  }

  // 2. Sticky Navbar Shrink
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // run once on init

  // 3. Mobile Hamburger Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  if (hamburger && mobileNav && mobileOverlay) {
    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      document.body.classList.toggle('overflow-hidden');
    };

    hamburger.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', toggleMenu);
    
    // Close menu when clicking nav links
    const mobileLinks = mobileNav.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', toggleMenu);
    });
  }

  // 4. Scroll Reveal Animations (Intersection Observer Fallback)
  const animatedElements = document.querySelectorAll('.fade-up-init');
  
  // Only use JS animations if the browser does not support CSS scroll-driven animations
  // or for standard trigger-once reveal animations
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up-animate');
        observer.unobserve(entry.target); // trigger only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    revealObserver.observe(el);
  });

  // 5. Dynamic Statistics Counters
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      let count = 0;
      const duration = 2000; // 2 seconds
      const stepTime = Math.max(Math.floor(duration / target), 15);
      
      const timer = setInterval(() => {
        count += Math.ceil(target / (duration / stepTime));
        if (count >= target) {
          stat.textContent = target + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = count + suffix;
        }
      }, stepTime);
    });
  };

  const statsSection = document.querySelector('.stats');
  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          animateStats();
          statsAnimated = true;
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });
    
    statsObserver.observe(statsSection);
  }

  // 6. Portfolio Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 7. Interactive FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all open FAQs
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        });

        // Toggle current FAQ
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // 8. Contact Form Validation and Simulation
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const feedback = contactForm.querySelector('.form-feedback');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic client-side validation
      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const phone = contactForm.querySelector('#phone').value.trim();
      const message = contactForm.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        showFeedback(
          document.documentElement.lang === 'ar' 
            ? 'يرجى ملء جميع الحقول المطلوبة (*).' 
            : 'Please fill in all required fields (*).', 
          'error'
        );
        return;
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFeedback(
          document.documentElement.lang === 'ar' 
            ? 'يرجى إدخال عنوان بريد إلكتروني صالح.' 
            : 'Please enter a valid email address.', 
          'error'
        );
        return;
      }

      // Button loading state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = document.documentElement.lang === 'ar' 
        ? 'جاري الإرسال...' 
        : 'Sending...';

      // Simulate API submit latency
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        contactForm.reset();
        
        showFeedback(
          document.documentElement.lang === 'ar' 
            ? 'شكراً لك! تم إرسال رسالتك بنجاح. وسنتواصل معك قريباً.' 
            : 'Thank you! Your message has been sent successfully. We will contact you soon.', 
          'success'
        );
      }, 1500);
    });

    const showFeedback = (msg, type) => {
      feedback.textContent = msg;
      feedback.className = `form-feedback ${type}`;
      
      // Auto-hide feedback after 5 seconds
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 5000);
    };
  }

  // 9. Active Link Styling on Scroll
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  const highlightNav = () => {
    let scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  
  window.addEventListener('scroll', highlightNav);
  highlightNav(); // run once on init
});
