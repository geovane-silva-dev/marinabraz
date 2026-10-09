/**
 * =====================================================
 * MARINA BRAZ - CENTRO DE BELEZA
 * Script Interativo Vanilla JavaScript
 * =====================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. CONFIGURAÇÕES GERAIS
  const WHATSAPP_NUMBER = '554291273841'; // Placeholder WhatsApp
  const DEFAULT_MESSAGE = 'Olá, Marina! Gostaria de agendar uma avaliação capilar no Centro de Beleza.';

  // 2. HEADER SCROLL & SOMBRA SUAVE
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  // 3. MENU MOBILE HAMBÚRGUER
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileNav) {
    const toggleMenu = () => {
      const isOpen = menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    menuToggle.addEventListener('click', toggleMenu);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. SCROLL SUAVE PARA LINKS ÂNCORA COM OFFSET DO HEADER
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 75;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 5. VOLTAR AO TOPO
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. SCROLL REVEAL VIA INTERSECTION OBSERVER
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback caso não suporte observer
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 7. CONTADOR ANIMADO NAS ESTATÍSTICAS
  const statsSection = document.getElementById('statsSection');
  const counterElements = document.querySelectorAll('.stat-counter');
  let countersAnimated = false;

  const animateCounters = () => {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1800;
      const stepTime = 25;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = `${prefix}${target.toLocaleString('pt-BR')}${suffix}`;
          clearInterval(timer);
        } else {
          counter.textContent = `${prefix}${Math.floor(current).toLocaleString('pt-BR')}${suffix}`;
        }
      }, stepTime);
    });
  };

  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  } else {
    animateCounters();
  }

  // 8. ACCORDION NO FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Fecha os outros
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Alterna o atual
        item.classList.toggle('active', !isActive);
        questionBtn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
      });
    }
  });

  // 9. LIGHTBOX SIMPLES PARA GALERIA
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightboxModal && lightboxImg && lightboxClose) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.getAttribute('data-caption') || (img ? img.alt : '');
        const fullSrc = item.getAttribute('data-full') || (img ? img.src : '');

        if (fullSrc) {
          lightboxImg.src = fullSrc;
          lightboxImg.alt = caption;
          if (lightboxCaption) lightboxCaption.textContent = caption;
          lightboxModal.classList.add('active');
          document.body.classList.add('menu-open');
        }
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.classList.remove('menu-open');
      lightboxImg.src = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 10. DIAGNÓSTICO CAPILAR INTERATIVO (QUIZ DE CONVERSÃO)
  const quizSection = document.getElementById('diagnostico');
  const quizStep1 = document.getElementById('quizStep1');
  const quizStep2 = document.getElementById('quizStep2');
  const quizResult = document.getElementById('quizResult');

  const quizOptionHair = document.querySelectorAll('[data-quiz-hair]');
  const quizOptionGoal = document.querySelectorAll('[data-quiz-goal]');

  const quizResultName = document.getElementById('quizResultName');
  const quizResultDesc = document.getElementById('quizResultDesc');
  const quizResultWhatsappBtn = document.getElementById('quizResultWhatsappBtn');
  const quizSummaryTags = document.getElementById('quizSummaryTags');
  const quizRestartBtn = document.getElementById('quizRestartBtn');

  let selectedHair = null;
  let selectedGoal = null;

  const goalLabels = {
    recuperacao: 'Recuperar a saúde e parar a quebra',
    brilho: 'Eliminar frizz e devolver brilho',
    mechas: 'Fazer mechas ou iluminar com segurança',
    noiva: 'Noiva / Evento Especial'
  };

  const treatmentProtocols = {
    recovery: {
      title: 'Protocolo DNA Aneethun - Reconstrução & Terapia Capilar',
      desc: 'Indicado para recuperação profunda da fibra capilar. Repõe massa proteica, sela as cutículas, diminui a quebra em até 95% e devolve a elasticidade natural aos fios sensibilizados.',
      serviceName: 'Terapia Capilar DNA Aneethun'
    },
    nutrition: {
      title: 'Terapia Nutritiva & Selagem Térmica Suave',
      desc: 'Ideal para alinhamento sem agressão química, controle intenso de frizz, brilho espelhado e toque sedoso com ativos botânicos de alta performance.',
      serviceName: 'Terapia Nutritiva e Controle de Frizz'
    },
    mechas: {
      title: 'Iluminação & Mechas Saudáveis com Proteção Capilar',
      desc: 'Técnica de clareamento com preservação total da integridade do fio, incluindo teste de mecha rigoroso e protocolo pós-química imediato.',
      serviceName: 'Mechas e Iluminação Capilar'
    },
    bridal: {
      title: 'Assessoria e Penteado para Noivas e Eventos',
      desc: 'Preparação personalizada dos fios com antecedência, teste prévio detalhado e fixação de alta durabilidade para o seu grande dia.',
      serviceName: 'Pacote Noivas / Debutantes'
    }
  };

  const keepQuizInView = () => {
    if (quizSection) {
      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 75;
      const elementTop = quizSection.getBoundingClientRect().top + window.pageYOffset;
      const targetScroll = elementTop - headerHeight - 12;
      
      // Só rola suavemente se o usuário tiver rolado além do início do quiz no celular
      window.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }
  };

  if (quizStep1 && quizStep2 && quizResult) {
    quizOptionHair.forEach(btn => {
      btn.addEventListener('click', () => {
        quizOptionHair.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedHair = btn.getAttribute('data-quiz-hair');

        // Avança para o passo 2 suavemente
        setTimeout(() => {
          quizStep1.classList.remove('active');
          quizStep2.classList.add('active');
          keepQuizInView();
        }, 180);
      });
    });

    quizOptionGoal.forEach(btn => {
      btn.addEventListener('click', () => {
        quizOptionGoal.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedGoal = btn.getAttribute('data-quiz-goal');

        // Calcula resultado com base nas respostas
        let rec = treatmentProtocols.recovery;
        if (selectedGoal === 'mechas') rec = treatmentProtocols.mechas;
        else if (selectedGoal === 'noiva') rec = treatmentProtocols.bridal;
        else if (selectedGoal === 'brilho') rec = treatmentProtocols.nutrition;

        if (quizResultName) quizResultName.textContent = rec.title;
        if (quizResultDesc) quizResultDesc.textContent = rec.desc;

        const readableGoal = goalLabels[selectedGoal] || selectedGoal;
        const readableHair = selectedHair || 'meu tipo de fio';

        if (quizSummaryTags) {
          quizSummaryTags.innerHTML = `
            <span class="quiz-tag-pill">Cabelo: <strong>${readableHair}</strong></span>
            <span class="quiz-tag-pill">Objetivo: <strong>${readableGoal}</strong></span>
          `;
        }

        if (quizResultWhatsappBtn) {
          const msg = `Olá, Marina! Fiz o Diagnóstico Capilar no seu site. Meu cabelo é: ${readableHair}. Meu objetivo é: ${readableGoal}. Gostaria de agendar o ${rec.serviceName}!`;
          quizResultWhatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
        }

        setTimeout(() => {
          quizStep2.classList.remove('active');
          quizResult.classList.add('active');
          keepQuizInView();
        }, 180);
      });
    });

    if (quizRestartBtn) {
      quizRestartBtn.addEventListener('click', () => {
        selectedHair = null;
        selectedGoal = null;
        quizOptionHair.forEach(b => b.classList.remove('selected'));
        quizOptionGoal.forEach(b => b.classList.remove('selected'));
        if (quizSummaryTags) quizSummaryTags.innerHTML = '';
        quizResult.classList.remove('active');
        quizStep2.classList.remove('active');
        quizStep1.classList.add('active');
        keepQuizInView();
      });
    }
  }

  // 11. LINK DIRETO PARA BOTÕES DE WHATSAPP
  document.querySelectorAll('[data-service-wa]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service-wa');
      const text = `Olá, Marina! Vi o serviço de "${service}" no seu site e gostaria de agendar uma avaliação.`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });
});
