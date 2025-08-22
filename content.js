// content.js - Versão Revisada e Fortalecida

const atributosParaVerificar = ['title', 'alt', 'placeholder'];

/**
 * Função debounce: Evita que uma função seja chamada excessivamente.
 * Ela só executa a função depois que um certo tempo de "calma" tenha passado.
 * @param {Function} func A função a ser executada.
 * @param {number} delay O tempo de espera em milissegundos.
 */
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * A função principal que faz a substituição.
 * @param {Node} noRaiz - O nó para iniciar a varredura.
 */
function substituirTextoEmTudo(noRaiz) {
  if (!noRaiz || typeof noRaiz.getElementsByTagName === 'undefined') {
    // Garante que o nó seja um elemento válido antes de continuar
    return;
  }
  
  // Usamos getElementsByTagName('*') que é muito rápido para pegar todos os descendentes
  const todosOsElementos = [noRaiz, ...noRaiz.getElementsByTagName('*')];
  
  for (const elemento of todosOsElementos) {
    // 1. Processa os atributos do elemento
    const parentName = elemento.tagName.toLowerCase();
    if (parentName === 'script' || parentName === 'style' || parentName === 'textarea') {
      continue;
    }
    for (const attr of atributosParaVerificar) {
      if (elemento.hasAttribute(attr)) {
        const valorOriginal = elemento.getAttribute(attr);
        const valorModificado = valorOriginal.replace(/rr/gi, 'l').replace(/r(?=\w)/gi, 'l');
        if (valorOriginal !== valorModificado) {
          elemento.setAttribute(attr, valorModificado);
        }
      }
    }

    // 2. Processa os nós de texto que são filhos diretos do elemento atual
    for (const noFilho of elemento.childNodes) {
      if (noFilho.nodeType === Node.TEXT_NODE) {
        const valorOriginal = noFilho.nodeValue;
        const valorModificado = valorOriginal.replace(/rr/gi, 'l').replace(/r(?=\w)/gi, 'l');
        if (valorOriginal !== valorModificado) {
          noFilho.nodeValue = valorModificado;
        }
      }
    }
  }
}

// --- CONFIGURAÇÃO DA ESTRATÉGIA DE DEFESA ---

// 1. Criamos uma versão "debounce" da nossa função principal.
//    Ela só vai rodar 100ms depois da ÚLTIMA mudança detectada.
const executarSubstituicaoDebounced = debounce(() => {
  substituirTextoEmTudo(document.documentElement);
}, 100);


// 2. O MutationObserver (Nossa linha de frente, agora mais inteligente)
//    Ele chama a versão debounced para evitar execuções excessivas.
const observer = new MutationObserver(() => {
  executarSubstituicaoDebounced();
});


// --- EXECUÇÃO E ATIVAÇÃO ---

// 1. Executa a função uma vez no início.
substituirTextoEmTudo(document.documentElement);

// 2. Inicia o observador.
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true,
  attributes: true // Monitora também mudanças de atributos
});

// 3. A Rede de Segurança: Re-verifica tudo a cada 2 segundos.
//    Isso garante a correção de elementos que o observer possa ter perdido.
setInterval(() => {
  substituirTextoEmTudo(document.documentElement);
}, 2000);

console.log("Extensão fortalecida rodou e está vigiando a página com múltiplas camadas.");