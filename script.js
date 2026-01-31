// Dados da aplicação (agora carregado do JSON externo)
let APP_DATA = {
    pets: [],
    ongs: [],
    fundadores: []
};

// Carregar dados do JSON
async function loadAppData() {
    try {
        const response = await fetch('data.json');
        APP_DATA = await response.json();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Dados de fallback
        APP_DATA = {
            pets: [],
            ongs: [],
            fundadores: []
        };
    }
}

// Utilitários de animação
const AnimationUtils = {
    // Anima elementos quando entram na viewport
    observeElements: (selector, animationClass = 'animate-in') => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add(animationClass);
                        entry.target.style.opacity = '1';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    },

    // Adiciona efeito de ripple aos botões
    addRippleEffect: (button) => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    },

    // Anima contadores
    animateCounter: (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    },

    // Efeito de digitação
    typewriterEffect: (element, text, speed = 50) => {
        let i = 0;
        element.textContent = '';
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    },

    // Shake animation para erros
    shakeElement: (element) => {
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    },

    // Confetti effect
    createConfetti: (x, y) => {
        const colors = ['#FF9C36', '#FFDE59', '#FFB4E2', '#1893F8', '#BE5C3D'];
        const confettiCount = 30;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${x}px;
                top: ${y}px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                pointer-events: none;
                z-index: 9999;
            `;
            
            document.body.appendChild(confetti);
            
            const angle = (Math.PI * 2 * i) / confettiCount;
            const velocity = 100 + Math.random() * 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity - 100;
            
            let posX = x;
            let posY = y;
            let velX = vx;
            let velY = vy;
            let rotation = 0;
            let rotationSpeed = (Math.random() - 0.5) * 20;
            
            const animate = () => {
                velY += 5; // gravity
                posX += velX * 0.016;
                posY += velY * 0.016;
                rotation += rotationSpeed;
                
                confetti.style.left = posX + 'px';
                confetti.style.top = posY + 'px';
                confetti.style.transform = `rotate(${rotation}deg)`;
                confetti.style.opacity = Math.max(0, 1 - (posY - y) / 500);
                
                if (posY < window.innerHeight + 100 && confetti.style.opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
};

// Adicionar keyframes para ripple e shake
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Componentes React-like em JavaScript puro
class PetMatchApp {
    constructor() {
        this.currentPath = window.location.pathname || '/';
        this.state = {
            isLogin: true,
            cep: '',
            cidade: '',
            pets: [],
            filteredPets: [],
            favorites: JSON.parse(localStorage.getItem('petmatch_favorites')) || [],
            recentlyViewed: JSON.parse(localStorage.getItem('petmatch_recently_viewed')) || [],
            darkMode: localStorage.getItem('petmatch_darkmode') === 'true',
            filters: {
                deficiencia: '',
                tipo: '',
                porte: '',
                idade: '',
                cidade: ''
            },
            currentPage: 1,
            petsPerPage: 6,
            isLoading: true
        };
        this.init();
    }

    async init() {
        await loadAppData();
        this.setupRouting();
        this.render();
        this.setupEventListeners();
        this.setState({ 
            pets: APP_DATA.pets,
            filteredPets: APP_DATA.pets,
            isLoading: false 
        });
        
        // Inicializar animações após renderização
        setTimeout(() => this.initAnimations(), 100);
    }

    initAnimations() {
        // Observar elementos para animação de entrada
        AnimationUtils.observeElements('.pet-card', 'animate-in-scale');
        AnimationUtils.observeElements('.info-card', 'animate-in');
        AnimationUtils.observeElements('.ong-card', 'animate-slide');
        AnimationUtils.observeElements('.founder-card', 'animate-in-scale');
        
        // Adicionar efeito ripple aos botões
        document.querySelectorAll('.btn').forEach(btn => {
            AnimationUtils.addRippleEffect(btn);
        });
        
        // Animar contadores de estatísticas
        document.querySelectorAll('.stat-number').forEach(stat => {
            const value = parseInt(stat.textContent);
            if (!isNaN(value)) {
                AnimationUtils.animateCounter(stat, value);
            }
        });
    }

    setupRouting() {
        window.addEventListener('popstate', () => {
            this.currentPath = window.location.pathname;
            this.render();
            setTimeout(() => this.initAnimations(), 100);
        });

        // Intercepta clicks em links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-route]');
            if (link) {
                e.preventDefault();
                const path = link.getAttribute('href');
                this.navigateTo(path);
            }
        });
    }

    navigateTo(path) {
        window.history.pushState({}, '', path);
        this.currentPath = path;
        this.render();
        setTimeout(() => this.initAnimations(), 100);
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    setupEventListeners() {
        // Delegar eventos
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            if (e.target.id === 'auth-form') {
                this.handleAuthSubmit();
            }
            if (e.target.id === 'contact-form') {
                this.handleContactSubmit(e);
            }
        });

        document.addEventListener('click', (e) => {
            // Toggle auth
            if (e.target.closest('#toggle-auth')) {
                this.setState({ isLogin: !this.state.isLogin });
            }

            // Buscar pets
            if (e.target.closest('#search-pets')) {
                this.filterPets();
            }

            // Toggle dark mode
            if (e.target.closest('#theme-toggle')) {
                this.toggleDarkMode();
            }

            // Favoritar pet
            if (e.target.closest('.favorite-btn')) {
                const btn = e.target.closest('.favorite-btn');
                const petId = parseInt(btn.dataset.petId);
                const rect = btn.getBoundingClientRect();
                AnimationUtils.createConfetti(rect.left + rect.width/2, rect.top + rect.height/2);
                this.toggleFavorite(petId);
            }

            // Abrir modal de pet
            if (e.target.closest('.pet-detail-btn')) {
                const petId = parseInt(e.target.closest('.pet-detail-btn').dataset.petId);
                this.showPetModal(petId);
            }

            // Fechar modal
            if (e.target.closest('.modal-close') || e.target.closest('.modal')) {
                if (e.target.classList.contains('modal') || e.target.closest('.modal-close')) {
                    this.closeModal();
                }
            }

            // Abrir filtros
            if (e.target.closest('#open-filters')) {
                this.showFilterModal();
            }

            // Aplicar filtros
            if (e.target.closest('#apply-filters')) {
                this.applyFilters();
            }

            // Limpar filtros
            if (e.target.closest('#clear-filters')) {
                this.clearFilters();
            }

            // Abrir contato
            if (e.target.closest('.contact-btn')) {
                const ongId = parseInt(e.target.closest('.contact-btn').dataset.ongId);
                this.showContactModal(ongId);
            }

            // Paginação
            if (e.target.closest('.pagination-btn')) {
                const btn = e.target.closest('.pagination-btn');
                if (!btn.disabled) {
                    const page = parseInt(btn.dataset.page);
                    this.goToPage(page);
                }
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.id === 'cep-input') {
                this.state.cep = e.target.value;
            }
            if (e.target.id === 'cidade-input') {
                this.state.cidade = e.target.value;
            }
            if (e.target.id === 'filter-deficiencia') {
                this.setState({ filters: { ...this.state.filters, deficiencia: e.target.value } });
            }
            if (e.target.id === 'filter-tipo') {
                this.setState({ filters: { ...this.state.filters, tipo: e.target.value } });
            }
            if (e.target.id === 'filter-porte') {
                this.setState({ filters: { ...this.state.filters, porte: e.target.value } });
            }
            if (e.target.id === 'filter-idade') {
                this.setState({ filters: { ...this.state.filters, idade: e.target.value } });
            }
            if (e.target.id === 'filter-cidade') {
                this.setState({ filters: { ...this.state.filters, cidade: e.target.value } });
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    handleAuthSubmit() {
        // Animação de transição
        const card = document.querySelector('.card');
        if (card) {
            card.style.animation = 'fadeInScale 0.5s ease reverse';
            setTimeout(() => {
                this.navigateTo('/home');
            }, 300);
        } else {
            this.navigateTo('/home');
        }
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Animação de loading no botão
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simular envio
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Confetti effect
        const rect = submitBtn.getBoundingClientRect();
        AnimationUtils.createConfetti(rect.left + rect.width/2, rect.top + rect.height/2);
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
        submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
        
        setTimeout(() => {
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            this.closeModal();
        }, 500);
    }

    toggleDarkMode() {
        const newDarkMode = !this.state.darkMode;
        this.setState({ darkMode: newDarkMode });
        localStorage.setItem('petmatch_darkmode', newDarkMode);
        document.body.classList.toggle('dark-mode', newDarkMode);
        
        // Animação de transição
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        
        // Atualizar ícone com animação
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.style.transform = 'rotate(360deg) scale(0)';
            setTimeout(() => {
                themeIcon.className = `fas ${newDarkMode ? 'fa-sun' : 'fa-moon'}`;
                themeIcon.style.transform = 'rotate(0deg) scale(1)';
            }, 200);
        }
    }

    toggleFavorite(petId) {
        let favorites = [...this.state.favorites];
        const index = favorites.indexOf(petId);
        
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(petId);
        }
        
        this.setState({ favorites });
        localStorage.setItem('petmatch_favorites', JSON.stringify(favorites));
        
        // Feedback visual
        const btn = document.querySelector(`.favorite-btn[data-pet-id="${petId}"]`);
        if (btn) {
            btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            icon.className = favorites.includes(petId) ? 'fas fa-heart' : 'far fa-heart';
            
            // Animação extra
            btn.style.transform = 'scale(1.3)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        }
    }

    addToRecentlyViewed(petId) {
        let recentlyViewed = [...this.state.recentlyViewed];
        const index = recentlyViewed.indexOf(petId);
        
        if (index > -1) {
            recentlyViewed.splice(index, 1);
        }
        
        recentlyViewed.unshift(petId);
        if (recentlyViewed.length > 5) {
            recentlyViewed = recentlyViewed.slice(0, 5);
        }
        
        this.setState({ recentlyViewed });
        localStorage.setItem('petmatch_recently_viewed', JSON.stringify(recentlyViewed));
    }

    applyFilters() {
        const { filters } = this.state;
        let filteredPets = APP_DATA.pets;
        
        if (filters.deficiencia) {
            filteredPets = filteredPets.filter(p => p.deficiencia === filters.deficiencia);
        }
        if (filters.tipo) {
            filteredPets = filteredPets.filter(p => p.tipo === filters.tipo);
        }
        if (filters.porte) {
            filteredPets = filteredPets.filter(p => p.porte === filters.porte);
        }
        if (filters.idade) {
            filteredPets = filteredPets.filter(p => p.idade === filters.idade);
        }
        if (filters.cidade) {
            filteredPets = filteredPets.filter(p => 
                p.cidade.toLowerCase().includes(filters.cidade.toLowerCase())
            );
        }
        
        this.setState({ 
            filteredPets,
            currentPage: 1 
        });
        this.closeModal();
        
        // Animação nos resultados
        setTimeout(() => {
            AnimationUtils.observeElements('.pet-card', 'animate-in-scale');
        }, 100);
    }

    clearFilters() {
        this.setState({ 
            filters: {
                deficiencia: '',
                tipo: '',
                porte: '',
                idade: '',
                cidade: ''
            },
            filteredPets: APP_DATA.pets,
            currentPage: 1
        });
        this.closeModal();
    }

    goToPage(page) {
        this.setState({ currentPage: page });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Animação nos cards
        setTimeout(() => {
            AnimationUtils.observeElements('.pet-card', 'animate-in-scale');
        }, 100);
    }

    showPetModal(petId) {
        const pet = APP_DATA.pets.find(p => p.id === petId);
        if (!pet) return;
        
        this.addToRecentlyViewed(petId);
        
        const modal = document.getElementById('pet-modal');
        const modalBody = document.getElementById('pet-modal-body');
        
        modalBody.innerHTML = `
            <div class="pet-detail-content">
                <img src="${pet.imagem}" class="pet-detail-image" alt="${pet.nome}" loading="eager">
                <div class="pet-detail-info">
                    <div class="flex justify-between items-center">
                        <h3 class="pet-name">${pet.nome}</h3>
                        <span class="pet-tag">${pet.deficiencia}</span>
                    </div>
                    
                    <div class="pet-detail-meta">
                        <span class="pet-meta-item">${pet.tipo}</span>
                        <span class="pet-meta-item">${pet.porte}</span>
                        <span class="pet-meta-item">${pet.idade}</span>
                        <span class="pet-meta-item">${pet.genero}</span>
                    </div>
                    
                    <p class="text-gray-500 font-bold mb-2">
                        <i class="fas fa-map-marker-alt"></i> ${pet.cidade} (CEP ${pet.cep})
                    </p>
                    <p class="text-gray-400 italic font-medium mb-4">
                        <i class="fas fa-hands-helping"></i> ${pet.ong}
                    </p>
                    
                    <p class="pet-detail-description">${pet.descricao}</p>
                    
                    <div class="flex gap-4 mt-6">
                        <button class="btn btn-primary flex-1 adopt-btn">
                            <i class="fas fa-heart"></i> Adotar
                        </button>
                        <button class="btn btn-outline flex-1 contact-btn" data-ong-id="${APP_DATA.ongs.find(o => o.nome === pet.ong)?.id || ''}">
                            <i class="fas fa-phone"></i> Contato
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar evento ao botão de adoção
        const adoptBtn = modalBody.querySelector('.adopt-btn');
        if (adoptBtn) {
            adoptBtn.addEventListener('click', (e) => {
                const rect = adoptBtn.getBoundingClientRect();
                AnimationUtils.createConfetti(rect.left + rect.width/2, rect.top + rect.height/2);
                
                adoptBtn.innerHTML = '<i class="fas fa-check"></i> Solicitação Enviada!';
                adoptBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                
                setTimeout(() => {
                    alert(`Sua solicitação de adoção para ${pet.nome} foi enviada! A ONG entrará em contato em breve.`);
                }, 500);
            });
            AnimationUtils.addRippleEffect(adoptBtn);
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animação de entrada do modal
        setTimeout(() => {
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.transform = 'scale(1) translateY(0)';
                content.style.opacity = '1';
            }
        }, 10);
    }

    showFilterModal() {
        const modal = document.getElementById('filter-modal');
        const modalBody = document.getElementById('filter-modal-body');
        
        // Extrair opções únicas para filtros
        const deficiencias = [...new Set(APP_DATA.pets.map(p => p.deficiencia))];
        const tipos = [...new Set(APP_DATA.pets.map(p => p.tipo))];
        const portes = [...new Set(APP_DATA.pets.map(p => p.porte))];
        const idades = [...new Set(APP_DATA.pets.map(p => p.idade))];
        const cidades = [...new Set(APP_DATA.pets.map(p => p.cidade))];
        
        modalBody.innerHTML = `
            <h3 class="subtitle mb-4">Filtrar Pets</h3>
            
            <div class="grid gap-4">
                <div>
                    <label class="filter-label">Deficiência</label>
                    <select id="filter-deficiencia" class="form-input select-input">
                        <option value="">Todas</option>
                        ${deficiencias.map(d => `
                            <option value="${d}" ${this.state.filters.deficiencia === d ? 'selected' : ''}>${d}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div>
                    <label class="filter-label">Tipo</label>
                    <select id="filter-tipo" class="form-input select-input">
                        <option value="">Todos</option>
                        ${tipos.map(t => `
                            <option value="${t}" ${this.state.filters.tipo === t ? 'selected' : ''}>${t}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div>
                    <label class="filter-label">Porte</label>
                    <select id="filter-porte" class="form-input select-input">
                        <option value="">Todos</option>
                        ${portes.map(p => `
                            <option value="${p}" ${this.state.filters.porte === p ? 'selected' : ''}>${p}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div>
                    <label class="filter-label">Idade</label>
                    <select id="filter-idade" class="form-input select-input">
                        <option value="">Todas</option>
                        ${idades.map(i => `
                            <option value="${i}" ${this.state.filters.idade === i ? 'selected' : ''}>${i}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div>
                    <label class="filter-label">Cidade</label>
                    <select id="filter-cidade" class="form-input select-input">
                        <option value="">Todas</option>
                        ${cidades.map(c => `
                            <option value="${c}" ${this.state.filters.cidade === c ? 'selected' : ''}>${c}</option>
                        `).join('')}
                    </select>
                </div>
            </div>
            
            <div class="flex gap-3 mt-6">
                <button id="apply-filters" class="btn btn-primary flex-1">
                    <i class="fas fa-check"></i> Aplicar Filtros
                </button>
                <button id="clear-filters" class="btn btn-outline flex-1">
                    <i class="fas fa-undo"></i> Limpar Filtros
                </button>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    showContactModal(ongId) {
        const ong = APP_DATA.ongs.find(o => o.id === ongId);
        if (!ong) return;
        
        const modal = document.getElementById('contact-modal');
        const modalBody = document.getElementById('contact-modal-body');
        
        modalBody.innerHTML = `
            <h3 class="subtitle mb-4">Contato: ${ong.nome}</h3>
            
            <div class="mb-6" style="background: var(--neutral-gray-50); padding: 1rem; border-radius: var(--radius-md);">
                <p class="mb-2"><i class="fas fa-map-marker-alt text-primary-orange"></i> <strong>Endereço:</strong> ${ong.endereco}</p>
                <p class="mb-2"><i class="fas fa-phone text-primary-blue"></i> <strong>Telefone:</strong> ${ong.telefone}</p>
                <p class="mb-2"><i class="fas fa-envelope text-primary-pink"></i> <strong>Email:</strong> ${ong.email}</p>
            </div>
            
            <form id="contact-form" class="space-y-4">
                <div>
                    <label class="filter-label">Seu Nome</label>
                    <input type="text" name="nome" class="form-input" required placeholder="Digite seu nome">
                </div>
                
                <div>
                    <label class="filter-label">Seu Email</label>
                    <input type="email" name="email" class="form-input" required placeholder="seu@email.com">
                </div>
                
                <div>
                    <label class="filter-label">Seu Telefone</label>
                    <input type="tel" name="telefone" class="form-input" placeholder="(11) 99999-9999">
                </div>
                
                <div>
                    <label class="filter-label">Mensagem</label>
                    <textarea name="mensagem" class="form-input" rows="4" required placeholder="Escreva sua mensagem..."></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary w-full">
                    <i class="fas fa-paper-plane"></i> Enviar Mensagem
                </button>
            </form>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.transform = 'scale(0.9) translateY(20px)';
                content.style.opacity = '0';
            }
        });
        
        setTimeout(() => {
            modals.forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = 'auto';
        }, 300);
    }

    initMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;
        
        // Inicializar mapa (usando Leaflet)
        const map = L.map('map').setView([-23.550, -46.633], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Adicionar marcadores das ONGs com animação
        APP_DATA.ongs.forEach((ong, index) => {
            if (ong.lat && ong.lng) {
                setTimeout(() => {
                    const marker = L.marker([ong.lat, ong.lng]).addTo(map);
                    marker.bindPopup(`
                        <div style="text-align: center; padding: 10px;">
                            <strong style="font-size: 1.1rem; color: #1893F8;">${ong.nome}</strong><br>
                            <span style="color: #666;">${ong.endereco}</span><br>
                            <span style="color: #999;">${ong.telefone}</span><br>
                            <button class="contact-btn" data-ong-id="${ong.id}" style="margin-top: 10px; padding: 8px 16px; background: linear-gradient(135deg, #1893F8, #FF9C36); color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: bold; transition: all 0.3s ease;">
                                <i class="fas fa-phone"></i> Contatar
                            </button>
                        </div>
                    `);
                    
                    // Animação de bounce no marcador
                    marker.on('add', function() {
                        this._icon.style.animation = 'bounce 0.5s ease';
                    });
                }, index * 200);
            }
        });
    }

    filterPets() {
        const { cep, cidade } = this.state;
        let filteredPets = APP_DATA.pets;

        // Filtro por CEP
        if (cep && cep.length >= 2) {
            const prefix = cep.substring(0, 2);
            if (['01', '02', '03', '04', '05'].includes(prefix)) {
                filteredPets = filteredPets.filter(
                    p => p.cidade.toLowerCase() === 'são paulo'
                );
            } else if (prefix === '06') {
                filteredPets = filteredPets.filter(
                    p => p.cidade.toLowerCase() === 'osasco'
                );
            }
        }

        // Filtro por cidade
        if (cidade) {
            filteredPets = filteredPets.filter(p =>
                p.cidade.toLowerCase().includes(cidade.toLowerCase())
            );
        }

        // Atualiza o estado e renderiza a lista filtrada
        this.setState({ 
            filteredPets,
            currentPage: 1 
        });
        
        // Animação nos resultados
        setTimeout(() => {
            AnimationUtils.observeElements('.pet-card', 'animate-in-scale');
        }, 100);
    }

    render() {
        const root = document.getElementById('root');
        const isAuthPage = this.currentPath === '/';

        document.body.classList.toggle('dark-mode', this.state.darkMode);

        root.innerHTML = `
            <div class="app-container ${isAuthPage ? 'auth-page' : ''}">
                ${this.renderHeader()}
                <main class="app-main">
                    ${this.state.isLoading ? this.renderLoading() : this.renderContent()}
                </main>
                ${!isAuthPage ? this.renderFooter() : ''}
            </div>
        `;

        // Re-vincula eventos específicos da página após o innerHTML
        if (this.currentPath === '/adotar') {
            this.bindAdotarFilters();
        }

        if (this.currentPath === '/locais' && !this.state.isLoading) {
            setTimeout(() => this.initMap(), 100);
        }
        
        // Adicionar efeitos aos botões após renderização
        setTimeout(() => {
            document.querySelectorAll('.btn').forEach(btn => {
                AnimationUtils.addRippleEffect(btn);
            });
        }, 50);
    }

    bindAdotarFilters() {
        const cepInput = document.getElementById('cep-input');
        const cidadeInput = document.getElementById('cidade-input');
        const searchBtn = document.getElementById('search-pets');
        const clearBtn = document.getElementById('clear-filters');

        if (cepInput) {
            cepInput.addEventListener('input', (e) => {
                this.state.cep = e.target.value;
            });
            
            // Máscara de CEP
            cepInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 5) {
                    value = value.substring(0, 5) + '-' + value.substring(5, 8);
                }
                e.target.value = value;
                this.state.cep = value;
            });
        }

        if (cidadeInput) {
            cidadeInput.addEventListener('input', (e) => {
                this.state.cidade = e.target.value;
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                // Animação no botão
                searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
                setTimeout(() => {
                    this.filterPets();
                }, 500);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.setState({ 
                    cep: '',
                    cidade: '',
                    filteredPets: APP_DATA.pets,
                    currentPage: 1
                });
            });
        }
    }

    updateList() {
        const content = document.getElementById('dynamic-content');
        if (!content) return;
        content.innerHTML = this.renderContent();
    }

    renderLoading() {
        return `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Carregando...</p>
            </div>
        `;
    }

    renderHeader() {
        const isAuthPage = this.currentPath === '/';
        const isActive = (path) => this.currentPath === path;
        
        return `
            <header class="app-header">
                <a href="${isAuthPage ? '/' : '/home'}" class="logo-link" data-route>
                    <div class="logo-image">
                        <img src="logo_petmatch.jpeg" alt="PetMatch Logo" style="width: 50px; height: 50px; border-radius: 12px; object-fit: cover;">
                    </div>
                    <span class="logo-text">PetMatch</span>
                </a>

                ${!isAuthPage ? `
                    <div class="nav-container">
                        <nav class="nav-menu">
                            <a href="/home" class="nav-link ${isActive('/home') ? 'active' : ''}" data-route>
                                <i class="fas fa-home"></i>
                                Home
                            </a>
                            <a href="/adotar" class="nav-link ${isActive('/adotar') ? 'active' : ''}" data-route>
                                <i class="fas fa-paw"></i>
                                Adotar
                            </a>
                            <a href="/locais" class="nav-link ${isActive('/locais') ? 'active' : ''}" data-route>
                                <i class="fas fa-map-marker-alt"></i>
                                Locais
                            </a>
                            <a href="/sobre" class="nav-link ${isActive('/sobre') ? 'active' : ''}" data-route>
                                <i class="fas fa-info-circle"></i>
                                Sobre
                            </a>
                            <a href="/favoritos" class="nav-link ${isActive('/favoritos') ? 'active' : ''}" data-route>
                                <i class="fas fa-heart"></i>
                                Favoritos
                            </a>
                        </nav>
                        
                        <button id="theme-toggle" class="theme-toggle" aria-label="Alternar tema">
                            <i class="fas ${this.state.darkMode ? 'fa-sun' : 'fa-moon'}"></i>
                        </button>
                    </div>
                ` : ''}
            </header>
        `;
    }

    renderFooter() {
        return `
            <footer class="app-footer">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>PetMatch</h3>
                        <p>Conectando pets com deficiência a lares amorosos desde 2024.</p>
                        <div class="social-icons">
                            <a href="#" class="social-icon" aria-label="Facebook">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://www.instagram.com/petmatch90" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="#" class="social-icon" aria-label="Twitter">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="#" class="social-icon" aria-label="WhatsApp">
                                <i class="fab fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Links Rápidos</h3>
                        <ul class="footer-links">
                            <li><a href="/home" data-route><i class="fas fa-chevron-right"></i> Home</a></li>
                            <li><a href="/adotar" data-route><i class="fas fa-chevron-right"></i> Adotar</a></li>
                            <li><a href="/locais" data-route><i class="fas fa-chevron-right"></i> ONGs Parceiras</a></li>
                            <li><a href="/sobre" data-route><i class="fas fa-chevron-right"></i> Sobre Nós</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Contato</h3>
                        <ul class="footer-links">
                            <li><a href="mailto:contato@petmatch.org"><i class="fas fa-envelope"></i> contato@petmatch.org</a></li>
                            <li><a href="tel:+5511999999999"><i class="fas fa-phone"></i> (11) 99999-9999</a></li>
                            <li><i class="fas fa-map-marker-alt"></i> São Paulo, SP</li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} PetMatch. Todos os direitos reservados.</p>
                    <p>Desenvolvido com <i class="fas fa-heart" style="color: #FF9C36;"></i> para pets especiais.</p>
                </div>
            </footer>
        `;
    }

    renderContent() {
        switch (this.currentPath) {
            case '/':
                return this.renderAuth();
            case '/home':
                return this.renderHome();
            case '/adotar':
                return this.renderAdotar();
            case '/locais':
                return this.renderLocais();
            case '/sobre':
                return this.renderSobre();
            case '/favoritos':
                return this.renderFavoritos();
            default:
                return this.renderHome();
        }
    }

    renderAuth() {
        const { isLogin } = this.state;
        
        return `
            <div class="card animate-in">
                <h2 class="title">${isLogin ? 'Bem-vindo ao PetMatch!' : 'Crie sua conta'}</h2>
                
                <form id="auth-form" class="space-y-4">
                    ${!isLogin ? `
                        <input type="text" placeholder="Nome Completo" class="form-input" required />
                    ` : ''}
                    
                    <input type="email" placeholder="E-mail" class="form-input" required />
                    
                    ${!isLogin ? `
                        <input type="text" placeholder="CPF" class="form-input" required />
                    ` : ''}
                    
                    <input type="password" placeholder="Senha" class="form-input" required />
                    
                    <button type="submit" class="btn btn-primary w-full">
                        ${isLogin ? '<i class="fas fa-sign-in-alt"></i> Entrar' : '<i class="fas fa-user-plus"></i> Cadastrar'}
                    </button>
                </form>

                <button id="toggle-auth" class="w-full mt-4 text-center font-bold py-2 transition-all cursor-pointer auth-toggle">
                    ${isLogin ? 'Não tem conta? Cadastre-se aqui' : 'Já tem conta? Faça Login'}
                </button>
            </div>
        `;
    }

    renderHome() {
        // Pets vistos recentemente
        const recentlyViewedPets = APP_DATA.pets.filter(pet => 
            this.state.recentlyViewed.includes(pet.id)
        ).slice(0, 3);
        
        // Alguns pets para mostrar na home
        const featuredPets = APP_DATA.pets.slice(0, 3);
        
        return `
            <div class="w-full space-y-10">
                <!-- Hero Section -->
                <div class="hero-section animate-in">
                    <div class="hero-content">
                        <div class="flex justify-center mb-6">
                            <div class="hero-paw-icon">
                                <i class="fas fa-paw"></i>
                            </div>
                        </div>
                        
                        <h1 class="hero-title text-center">
                            Encontre seu novo melhor amigo!
                        </h1>
                        <p class="hero-subtitle text-center mx-auto">
                            Milhares de pets com deficiência estão esperando por um lar cheio de amor. 
                            Faça a diferença na vida de um animal especial hoje!
                        </p>
                        
                        <div class="flex gap-4 justify-center flex-wrap">
                            <a href="/adotar" class="btn btn-primary" data-route>
                                <i class="fas fa-search"></i> Encontrar meu Pet
                            </a>
                            <a href="/sobre" class="btn btn-outline" data-route>
                                <i class="fas fa-info-circle"></i> Saiba Mais
                            </a>
                        </div>
                    </div>
                    
                    <div class="decoration-circle decoration-1"></div>
                    <div class="decoration-circle decoration-2"></div>
                    <div class="decoration-circle decoration-3"></div>
                </div>

                <!-- Pets em Destaque -->
                <div class="animate-in" style="animation-delay: 0.2s;">
                    <h2 class="subtitle mb-6 text-center">Pets Disponíveis</h2>
                    <div class="pets-grid">
                        ${featuredPets.map((pet, index) => this.renderPetCard(pet, index)).join('')}
                    </div>
                    <div class="text-center mt-6">
                        <a href="/adotar" class="btn btn-secondary" data-route>
                            Ver Todos os Pets <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>

                <!-- Info Cards -->
                <div class="grid md:grid-3 gap-6">
                    <div class="info-card" style="animation-delay: 0.1s;">
                        <div class="info-icon">
                            <i class="fas fa-heart"></i>
                        </div>
                        <h3 class="info-title">Adoção Responsável</h3>
                        <p class="text-gray-700">
                            Todos os pets são vacinados, castrados e prontos para um novo lar
                        </p>
                    </div>

                    <div class="info-card" style="animation-delay: 0.2s;">
                        <div class="info-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h3 class="info-title">Processo Seguro</h3>
                        <p class="text-gray-700">
                            Conectamos você diretamente com ONGs confiáveis e verificadas
                        </p>
                    </div>

                    <div class="info-card" style="animation-delay: 0.3s;">
                        <div class="info-icon">
                            <i class="fas fa-hands-helping"></i>
                        </div>
                        <h3 class="info-title">Suporte Completo</h3>
                        <p class="text-gray-700">
                            Acompanhamento pós-adoção e dicas para cuidar do seu novo amigo
                        </p>
                    </div>
                </div>

                <!-- Pets Vistos Recentemente -->
                ${recentlyViewedPets.length > 0 ? `
                    <div class="mt-10 animate-in">
                        <h2 class="subtitle mb-6 text-center">Vistos Recentemente</h2>
                        <div class="pets-grid">
                            ${recentlyViewedPets.map((pet, index) => this.renderPetCard(pet, index)).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Call to Action -->
                <div class="text-center py-10 animate-in" style="background: linear-gradient(135deg, rgba(255,156,54,0.1), rgba(255,180,226,0.1)); border-radius: var(--radius-xl); padding: 3rem;">
                    <h3 class="text-3xl font-bold text-gray-800 mb-4">
                        Pronto para mudar uma vida?
                    </h3>
                    <p class="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
                        Cada adoção transforma duas vidas: a do pet e a sua. Encontre hoje mesmo seu companheiro ideal!
                    </p>
                    <div class="flex gap-4 justify-center flex-wrap">
                        <a href="/adotar" class="btn btn-primary" data-route>
                            <i class="fas fa-paw"></i> Encontrar meu Pet
                        </a>
                        <a href="/locais" class="btn btn-yellow" data-route>
                            <i class="fas fa-map-marker-alt"></i> Encontrar Abrigos
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    renderPetCard(pet, index = 0) {
        const isFavorite = this.state.favorites.includes(pet.id);
        
        return `
            <div class="pet-card" style="animation-delay: ${index * 0.1}s;">
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-pet-id="${pet.id}" aria-label="${isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <img src="${pet.imagem}" class="pet-image" alt="${pet.nome} - ${pet.tipo} ${pet.deficiencia}" loading="lazy">
                <div class="pet-content">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="pet-name">${pet.nome}</h3>
                        <span class="pet-tag">${pet.deficiencia}</span>
                    </div>
                    
                    <div class="pet-meta mb-3">
                        <span class="pet-meta-item">${pet.tipo}</span>
                        <span class="pet-meta-item">${pet.porte}</span>
                        <span class="pet-meta-item">${pet.idade}</span>
                    </div>
                    
                    <p class="text-gray-500 font-bold mb-2">
                        <i class="fas fa-map-marker-alt"></i> ${pet.cidade}
                    </p>
                    <p class="text-gray-400 italic font-medium mb-4">
                        <i class="fas fa-hands-helping"></i> ${pet.ong}
                    </p>
                    
                    <button class="btn btn-primary w-full pet-detail-btn" data-pet-id="${pet.id}">
                        Conhecer ${pet.nome}
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
    }

    renderAdotar() {
        const { filteredPets, currentPage, petsPerPage } = this.state;
        
        // Paginação
        const startIndex = (currentPage - 1) * petsPerPage;
        const endIndex = startIndex + petsPerPage;
        const paginatedPets = filteredPets.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredPets.length / petsPerPage);
        
        return `
            <div class="w-full animate-in">
                <!-- Filtros -->
                <div class="filter-section">
                    <h3 class="subtitle mb-4">Encontre seu pet ideal</h3>
                    
                    <div class="filter-row">
                        <div class="filter-group">
                            <label class="filter-label">CEP</label>
                            <input 
                                type="text"
                                placeholder="Digite seu CEP..."
                                class="form-input"
                                id="cep-input"
                                value="${this.state.cep}"
                                maxlength="9"
                            />
                        </div>
                        
                        <div class="filter-group">
                            <label class="filter-label">Cidade</label>
                            <input 
                                type="text" 
                                placeholder="Digite a cidade..." 
                                class="form-input"
                                id="cidade-input"
                                value="${this.state.cidade}"
                            />
                        </div>
                        
                        <div class="filter-group flex items-end">
                            <button id="search-pets" class="btn btn-primary w-full">
                                <i class="fas fa-search"></i> Buscar
                            </button>
                        </div>
                    </div>
                    
                    <div class="filter-actions">
                        <button id="open-filters" class="btn btn-outline">
                            <i class="fas fa-filter"></i> Mais Filtros
                        </button>
                        <div class="ml-auto">
                            <span class="text-gray-600 font-medium">
                                <i class="fas fa-paw"></i> ${filteredPets.length} pets encontrados
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Lista de Pets -->
                ${filteredPets.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="fas fa-paw"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">Nenhum pet encontrado</h3>
                        <p class="text-gray-500">Tente ajustar os filtros de busca.</p>
                        <button id="clear-filters" class="btn btn-primary mt-4">
                            <i class="fas fa-undo"></i> Limpar Filtros
                        </button>
                    </div>
                ` : `
                    <div class="pets-grid">
                        ${paginatedPets.map((pet, index) => this.renderPetCard(pet, index)).join('')}
                    </div>
                `}

                <!-- Paginação -->
                ${totalPages > 1 ? `
                    <div class="pagination">
                        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                                data-page="${currentPage - 1}" 
                                ${currentPage === 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        
                        ${Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            
                            return `
                                <button class="pagination-btn ${currentPage === pageNum ? 'active' : ''}" 
                                        data-page="${pageNum}">
                                    ${pageNum}
                                </button>
                            `;
                        }).join('')}
                        
                        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                                data-page="${currentPage + 1}" 
                                ${currentPage === totalPages ? 'disabled' : ''}>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderLocais() {
        return `
            <div class="w-full animate-in">
                <div class="large-card mb-6">
                    <h2 class="title">ONGs Parceiras</h2>
                    <p class="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                        Conheça nossas ONGs parceiras que cuidam com amor de pets com deficiência.
                    </p>
                    <div class="mb-8">
                        <h3 class="subtitle mb-4">Localização das ONGs</h3>
                        <div id="map" class="map-container"></div>
                    </div>
                    <div class="space-y-6">
                        ${APP_DATA.ongs.map((ong, index) => `
                            <div class="ong-card" style="animation-delay: ${index * 0.1}s;">
                                <div class="flex items-center gap-5 flex-col md:flex-row">
                                    <div class="ong-icon"><i class="fas fa-hands-helping"></i></div>
                                    <div class="flex-1">
                                        <h4 class="ong-name">${ong.nome}</h4>
                                        <p class="text-gray-500 font-medium"><i class="fas fa-map-marker-alt"></i> ${ong.endereco}</p>
                                        <p class="text-gray-400 text-sm"><i class="fas fa-phone"></i> ${ong.telefone}</p>
                                    </div>
                                </div>
                                <div class="text-center md:text-right">
                                    <button class="btn btn-secondary contact-btn" data-ong-id="${ong.id}">
                                        <i class="fas fa-phone"></i> Contato
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
    }

    renderSobre() {
        return `
            <div class="w-full max-w-5xl">
                <!-- Seção principal: História -->
                <div class="large-card mb-10 animate-in">
                    <div class="flex justify-center mb-6">
                        <div class="hero-paw-icon">
                            <i class="fas fa-paw"></i>
                        </div>
                    </div>
                    
                    <h2 class="title">Sobre o PetMatch</h2>
                    
                    <div class="space-y-6 text-center max-w-3xl mx-auto">
                        <p class="text-xl text-gray-700 leading-relaxed font-medium">
                            O <span class="text-primary-blue font-black">PetMatch</span> surgiu do desejo de transformar a realidade de animais que, muitas vezes, são invisíveis aos olhos da sociedade: 
                            <span class="text-primary-pink font-bold"> os pets com deficiência.</span>
                        </p>
                        
                        <p class="text-lg text-gray-500 leading-relaxed">
                            Nosso propósito social é conectar pessoas que buscam um amor sem barreiras a ONGs responsáveis. 
                            Acreditamos que uma deficiência não define a capacidade de um animal de dar e receber carinho. 
                            Queremos gerar um impacto social onde a inclusão comece também pelo mundo pet.
                        </p>
                    </div>

                    <!-- Cards de missão e impacto -->
                    <div class="grid md:grid-2 gap-6 mt-12">
                        <div class="ong-card">
                            <div class="ong-icon" style="background: linear-gradient(135deg, var(--primary-blue), var(--primary-orange));">
                                <i class="fas fa-bullseye"></i>
                            </div>
                            <div class="flex-1">
                                <h4 class="subtitle">Missão</h4>
                                <p class="text-gray-500 mt-2 font-medium">
                                    Facilitar o encontro entre famílias amorosas e animais especiais através da tecnologia.
                                </p>
                            </div>
                        </div>
                        
                        <div class="ong-card">
                            <div class="ong-icon" style="background: linear-gradient(135deg, var(--primary-pink), var(--primary-yellow));">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="flex-1">
                                <h4 class="subtitle">Impacto</h4>
                                <p class="text-gray-500 mt-2 font-medium">
                                    Reduzir o tempo de espera de animais com deficiência em abrigos e ONGs parceiras.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Seção: Fundadores -->
                <div class="large-card animate-in" style="animation-delay: 0.2s;">
                    <div class="flex items-center justify-center gap-3 mb-10">
                        <i class="fas fa-users text-3xl text-primary-blue"></i>
                        <h3 class="subtitle">Fundadores</h3>
                    </div>

                    <div class="grid md:grid-3 gap-8">
                        ${APP_DATA.fundadores.map((fundador, index) => `
                            <div class="founder-card" style="animation-delay: ${index * 0.1}s;">
                                <div class="founder-avatar">
                                    ${fundador.nome.charAt(0)}
                                </div>
                                <h5 class="founder-name">${fundador.nome}</h5>
                                <p class="founder-role">${fundador.cargo}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Estatísticas -->
                <div class="large-card mt-10 animate-in" style="animation-delay: 0.3s;">
                    <h3 class="subtitle text-center mb-8">Nossos Números</h3>
                    <div class="grid md:grid-4 gap-6">
                        <div class="text-center">
                            <div class="stat-number">${APP_DATA.pets.length}</div>
                            <p class="text-gray-600">Pets para Adoção</p>
                        </div>
                        <div class="text-center">
                            <div class="stat-number">${APP_DATA.ongs.length}</div>
                            <p class="text-gray-600">ONGs Parceiras</p>
                        </div>
                        <div class="text-center">
                            <div class="stat-number">100</div>
                            <p class="text-gray-600">% Gratuito</p>
                        </div>
                        <div class="text-center">
                            <div class="stat-number">24</div>
                            <p class="text-gray-600">/7 Disponível</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderFavoritos() {
        const favoritePets = APP_DATA.pets.filter(pet => 
            this.state.favorites.includes(pet.id)
        );
        
        return `
            <div class="w-full animate-in">
                <h2 class="title mb-8">Meus Favoritos</h2>
                
                ${favoritePets.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="far fa-heart"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">Nenhum pet favoritado</h3>
                        <p class="text-gray-500">Adicione pets aos seus favoritos clicando no ícone de coração.</p>
                        <a href="/adotar" class="btn btn-primary mt-4" data-route>
                            <i class="fas fa-paw"></i> Explorar Pets
                        </a>
                    </div>
                ` : `
                    <div class="pets-grid">
                        ${favoritePets.map((pet, index) => this.renderPetCard(pet, index)).join('')}
                    </div>
                    
                    <div class="text-center mt-8">
                        <a href="/adotar" class="btn btn-outline" data-route>
                            <i class="fas fa-plus"></i> Ver Mais Pets
                        </a>
                    </div>
                `}
            </div>
        `;
    }
}

// Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new PetMatchApp();
});
