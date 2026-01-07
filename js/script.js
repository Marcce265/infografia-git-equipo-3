// ===================================
// Funciones de Scroll
// ===================================

// Mostrar/ocultar botón de scroll to top
window.addEventListener('scroll', function() {
    const scrollTop = document.getElementById('scrollTop');
    if (window.pageYOffset > 300) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
});

// Función para volver arriba suavemente
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===================================
// Smooth Scroll para los Enlaces de Navegación
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Función para Copiar Comandos
// ===================================

function copyCommand(element) {
    const commandText = element.querySelector('.command').textContent;
    
    // Crear elemento temporal para copiar
    const tempInput = document.createElement('textarea');
    tempInput.value = commandText;
    document.body.appendChild(tempInput);
    tempInput.select();
    
    try {
        document.execCommand('copy');
        
        // Feedback visual
        const copyBtn = element.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓';
        copyBtn.style.color = '#10b981';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.color = '';
        }, 2000);
        
        // Mostrar notificación
        showNotification('Comando copiado al portapapeles!');
    } catch (err) {
        console.error('Error al copiar:', err);
        showNotification('Error al copiar el comando', 'error');
    }
    
    document.body.removeChild(tempInput);
}

// ===================================
// Sistema de Notificaciones
// ===================================

function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        animation: 'slideUp 0.3s ease-out'
    });
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Agregar animaciones CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Animación de Contador para Estadísticas
// ===================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60 FPS
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===================================
// Intersection Observer para Animaciones
// ===================================

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            
            // Si es una sección de estadísticas, animar los números
            if (entry.target.classList.contains('project-stats')) {
                animateProjectStats();
            }
        }
    });
}, observerOptions);

// Observar elementos para animación
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.card, .command-category, .workflow-step, .tip-card, .team-member');
    elementsToAnimate.forEach(el => observer.observe(el));
    
    // Observar sección de estadísticas
    const statsSection = document.querySelector('.project-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// ===================================
// Animar Estadísticas del Proyecto
// ===================================

let statsAnimated = false;

function animateProjectStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    
    // Estos valores deberían ser actualizados con datos reales del repositorio
    const stats = {
        commits: 45,
        pullRequests: 12,
        linesOfCode: 2580,
        days: 7
    };
    
    const commitsElement = document.getElementById('commits-count');
    const prElement = document.getElementById('pr-count');
    const linesElement = document.getElementById('lines-count');
    const daysElement = document.getElementById('days-count');
    
    if (commitsElement) animateCounter(commitsElement, stats.commits);
    if (prElement) animateCounter(prElement, stats.pullRequests);
    if (linesElement) animateCounter(linesElement, stats.linesOfCode);
    if (daysElement) animateCounter(daysElement, stats.days);
}

// ===================================
// Resaltar Sección Activa en Navegación
// ===================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Agregar estilos para enlace activo
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-links a.active {
        color: var(--primary-color);
    }
    
    .nav-links a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeStyle);

// ===================================
// Efecto de Parallax en Hero
// ===================================

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===================================
// Menú Móvil (Hamburguesa)
// ===================================

function createMobileMenu() {
    if (window.innerWidth <= 768) {
        const navbar = document.querySelector('.navbar .container');
        const navLinks = document.querySelector('.nav-links');
        
        // Verificar si ya existe el botón hamburguesa
        if (!document.querySelector('.hamburger')) {
            const hamburger = document.createElement('button');
            hamburger.className = 'hamburger';
            hamburger.innerHTML = '☰';
            hamburger.setAttribute('aria-label', 'Toggle menu');
            
            // Estilos del botón
            Object.assign(hamburger.style, {
                display: 'block',
                fontSize: '1.5rem',
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                cursor: 'pointer',
                padding: '0.5rem'
            });
            
            // Insertar antes de nav-links
            navbar.insertBefore(hamburger, navLinks);
            
            // Toggle menú
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-active');
                hamburger.innerHTML = navLinks.classList.contains('mobile-active') ? '✕' : '☰';
            });
            
            // Cerrar menú al hacer click en un enlace
            const links = navLinks.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('mobile-active');
                    hamburger.innerHTML = '☰';
                });
            });
        }
    }
}

// Estilos para menú móvil
const mobileMenuStyle = document.createElement('style');
mobileMenuStyle.textContent = `
    @media (max-width: 768px) {
        .nav-links {
            display: flex;
            position: fixed;
            top: 60px;
            right: -100%;
            width: 70%;
            height: calc(100vh - 60px);
            background: white;
            flex-direction: column;
            padding: 2rem;
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
            transition: right 0.3s ease-in-out;
            z-index: 999;
        }
        
        .nav-links.mobile-active {
            right: 0;
        }
        
        .nav-links li {
            margin-bottom: 1.5rem;
        }
    }
`;
document.head.appendChild(mobileMenuStyle);

// Ejecutar al cargar y al redimensionar
window.addEventListener('DOMContentLoaded', createMobileMenu);
window.addEventListener('resize', createMobileMenu);

// ===================================
// Easter Egg: Konami Code
// ===================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    showNotification('🎉 ¡Código Konami activado! ¡Eres un verdadero desarrollador!', 'success');
    
    // Añadir efecto visual temporal
    document.body.style.animation = 'rainbow 2s linear';
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

// Animación rainbow
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// ===================================
// Lazy Loading de Imágenes
// ===================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => imageObserver.observe(img));
    });
}

// ===================================
// Modo Oscuro Toggle (Opcional)
// ===================================

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

// Cargar preferencia de modo oscuro
window.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
});

// ===================================
// Función para actualizar estadísticas desde GitHub API (Opcional)
// ===================================

async function fetchGitHubStats(owner, repo) {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        const data = await response.json();
        
        // Actualizar estadísticas reales
        const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`);
        const commits = await commitsResponse.json();
        
        // Actualizar elementos
        document.getElementById('commits-count').textContent = commits.length;
        // Agregar más actualizaciones según necesites
        
    } catch (error) {
        console.log('No se pudieron cargar las estadísticas de GitHub');
    }
}

// Descomentar y configurar con tu repositorio:
// fetchGitHubStats('tu-usuario', 'tu-repositorio');

// ===================================
// Console Message
// ===================================

console.log(
    '%c¡Hola Desarrollador! 👋',
    'color: #6366f1; font-size: 20px; font-weight: bold;'
);
console.log(
    '%cGracias por revisar el código. Si encuentras algún bug, ¡háznoslo saber!',
    'color: #8b5cf6; font-size: 14px;'
);
console.log(
    '%c⭐ No olvides dar star al repositorio en GitHub',
    'color: #f59e0b; font-size: 12px;'
);