/**
 * Lei de Ohm - Projeto Educacional
 * Scripts Principais - Versão 2.0
 * Desenvolvido por: Thiago Isley de Medeiros
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos os componentes
    initNavbar();
    initAccordion();
    initTooltips();
    initCalculadora();
    initFormulaToggle();
    initAnimations();
    initInteractiveDemos();
    initScrollSpy();
});

/**
 * Navegação e Responsividade
 */
function initNavbar() {
    // Toggle do menu mobile
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle da navegação
            nav.classList.toggle('nav-active');
            
            // Animação dos links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            
            // Animação do burger
            burger.classList.toggle('toggle');
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });
}

/**
 * Accordion (seções expansíveis)
 */
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = header.nextElementSibling;
            const accordionIcon = header.querySelector('.accordion-icon');
            
            // Toggle do item ativo
            accordionItem.classList.toggle('active');
            
            // Muda o ícone e ajusta a altura do conteúdo
            if (accordionItem.classList.contains('active')) {
                accordionIcon.textContent = '-';
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            } else {
                accordionIcon.textContent = '+';
                accordionContent.style.maxHeight = 0;
            }
        });
    });
}

/**
 * Tooltips e elementos informativos
 */
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', (e) => {
            const tooltipText = e.target.getAttribute('data-tooltip');
            
            const tooltipEl = document.createElement('div');
            tooltipEl.classList.add('tooltip');
            tooltipEl.textContent = tooltipText;
            
            document.body.appendChild(tooltipEl);
            
            const rect = e.target.getBoundingClientRect();
            tooltipEl.style.left = `${rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2}px`;
            tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 10}px`;
            
            setTimeout(() => {
                tooltipEl.classList.add('show');
            }, 10);
        });
        
        tooltip.addEventListener('mouseleave', () => {
            const tooltipEl = document.querySelector('.tooltip');
            if (tooltipEl) {
                tooltipEl.classList.remove('show');
                setTimeout(() => {
                    tooltipEl.remove();
                }, 300);
            }
        });
    });
}

/**
 * Calculadora da Lei de Ohm
 */
function initCalculadora() {
    const calculatorForm = document.getElementById('ohmCalculator');
    if (!calculatorForm) return;
    
    const calculateBtn = document.getElementById('calculateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultDiv = document.getElementById('result');
    
    // Função de cálculo ao clicar no botão
    calculateBtn.addEventListener('click', () => {
        calculate();
    });
    
    // Limpar formulário
    clearBtn.addEventListener('click', () => {
        calculatorForm.reset();
        resultDiv.innerHTML = '<p>Preencha os valores conhecidos e clique em "Calcular"</p>';
    });
    
    // Lógica de cálculo da Lei de Ohm
    function calculate() {
        const voltage = parseFloat(document.getElementById('voltage').value);
        const current = parseFloat(document.getElementById('current').value);
        const resistance = parseFloat(document.getElementById('resistance').value);
        
        // Contar quantos valores foram fornecidos
        const providedValues = [voltage, current, resistance].filter(val => !isNaN(val)).length;
        
        if (providedValues !== 2) {
            resultDiv.innerHTML = '<p class="error">Por favor, forneça exatamente dois valores para calcular o terceiro.</p>';
            return;
        }
        
        let result, formula;
        
        if (isNaN(voltage)) {
            // Calcular tensão: V = R × I
            result = current * resistance;
            formula = `V = R × I = ${resistance.toFixed(2)} Ω × ${current.toFixed(2)} A = ${result.toFixed(2)} V`;
            resultDiv.innerHTML = `
                <h3>Tensão (V)</h3>
                <p class="equation">${result.toFixed(2)} V</p>
                <p class="formula-used">Fórmula: ${formula}</p>
            `;
        } else if (isNaN(current)) {
            // Calcular corrente: I = V ÷ R
            result = voltage / resistance;
            formula = `I = V ÷ R = ${voltage.toFixed(2)} V ÷ ${resistance.toFixed(2)} Ω = ${result.toFixed(2)} A`;
            resultDiv.innerHTML = `
                <h3>Corrente (I)</h3>
                <p class="equation">${result.toFixed(2)} A</p>
                <p class="formula-used">Fórmula: ${formula}</p>
            `;
        } else {
            // Calcular resistência: R = V ÷ I
            result = voltage / current;
            formula = `R = V ÷ I = ${voltage.toFixed(2)} V ÷ ${current.toFixed(2)} A = ${result.toFixed(2)} Ω`;
            resultDiv.innerHTML = `
                <h3>Resistência (R)</h3>
                <p class="equation">${result.toFixed(2)} Ω</p>
                <p class="formula-used">Fórmula: ${formula}</p>
            `;
        }
        
        // Adicionar efeito visual
        resultDiv.classList.add('pulse');
        setTimeout(() => {
            resultDiv.classList.remove('pulse');
        }, 2000);
    }
    
    // Permitir pressionar Enter para calcular
    calculatorForm.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculate();
        }
    });
}

/**
 * Toggle das variações de fórmulas
 */
function initFormulaToggle() {
    const toggleBtn = document.getElementById('show-variations');
    const formulaVariations = document.getElementById('formula-variations');
    
    if (toggleBtn && formulaVariations) {
        toggleBtn.addEventListener('click', () => {
            formulaVariations.classList.toggle('show');
            
            if (formulaVariations.classList.contains('show')) {
                toggleBtn.textContent = 'Ocultar variações';
            } else {
                toggleBtn.textContent = 'Ver variações da fórmula';
            }
        });
    }
}

/**
 * Animações em elementos ao entrar na viewport
 */
function initAnimations() {
    // Elementos que devem animar ao entrar na viewport
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Demonstrações interativas da Lei de Ohm
 */
function initInteractiveDemos() {
    const resistanceSlider = document.getElementById('resistance');
    const currentSlider = document.getElementById('current');
    const rValue = document.getElementById('r-value');
    const iValue = document.getElementById('i-value');
    const voltageResult = document.getElementById('voltage-result');
    
    // Atualiza os valores de acordo com os sliders
    if (resistanceSlider && currentSlider) {
        function updateValues() {
            const resistance = parseFloat(resistanceSlider.value);
            const current = parseFloat(currentSlider.value);
            const voltage = (resistance * current).toFixed(1);
            
            rValue.textContent = resistance;
            iValue.textContent = current.toFixed(3);
            voltageResult.textContent = `${voltage} V`;
        }
        
        resistanceSlider.addEventListener('input', updateValues);
        currentSlider.addEventListener('input', updateValues);
    }
    
    // Demonstração do gráfico da Lei de Ohm, se o elemento existir
    const graphDemo = document.getElementById('ohm-law-graph');
    if (graphDemo) {
        // Implementação do gráfico usando biblioteca como Chart.js
        // Aqui seria o local para inicializar o gráfico
        console.log('Gráfico interativo será implementado aqui');
    }
}

/**
 * Destaca o item de navegação atual com base na seção visível
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
} 