export interface Challenge {
    id: number;
    title: string;
    description: string;
    requirements: string[];
    difficulty: 'Fácil' | 'Médio' | 'Difícil';
}

export const dailyChallenges: Challenge[] = [
    {
        id: 1,
        title: "Banner de Aceite de Cookies",
        difficulty: 'Fácil',
        description: "Implemente um aviso de privacidade que aparece no rodapé da página.",
        requirements: [
            "O banner deve aparecer assim que a página carregar.",
            "Deve conter um botão 'Aceitar'.",
            "Ao clicar no botão, o banner deve desaparecer usando JS."
        ]
    },
    {
        id: 2,
        title: "FAQ Accordion (Perguntas Frequentes)",
        difficulty: 'Fácil',
        description: "Crie uma seção onde as respostas das perguntas só aparecem ao clicar na pergunta.",
        requirements: [
            "Use addEventListener em cada título de pergunta.",
            "Alterne a visibilidade da resposta (toggle) ao clicar.",
            "Apenas uma resposta deve estar aberta por vez."
        ]
    },
    {
        id: 3,
        title: "Botão Voltar ao Topo",
        difficulty: 'Fácil',
        description: "Adicione um botão flutuante que ajuda o usuário a retornar ao início da página.",
        requirements: [
            "O botão deve iniciar escondido.",
            "Use o evento window.onscroll para mostrar o botão após 300px.",
            "Ao clicar, use scrollTo com behavior: 'smooth'."
        ]
    },
    {
        id: 4,
        title: "Validação Simples de Formulário",
        difficulty: 'Fácil',
        description: "Evite o envio de formulários com campos vazios na seção de contato.",
        requirements: [
            "Intercepte o evento submit do formulário.",
            "Verifique se o campo de nome e e-mail não estão vazios.",
            "Exiba uma mensagem de erro visual caso falte algo."
        ]
    },
    {
        id: 5,
        title: "Galeria de Miniaturas (Thumbnail Switcher)",
        difficulty: 'Fácil',
        description: "Crie uma seção de fotos onde a imagem principal muda ao clicar nas pequenas.",
        requirements: [
            "Tenha uma imagem grande e 3 miniaturas.",
            "Ao clicar em uma pequena, o src da grande deve ser atualizado."
        ]
    },
    {
        id: 6,
        title: "Calculadora de Orçamento em Tempo Real",
        difficulty: 'Médio',
        description: "Permita que o cliente veja o valor total dos serviços selecionados.",
        requirements: [
            "Crie 3 checkboxes com valores diferentes.",
            "Sempre que mudar um checkbox, atualize o total na tela.",
            "Formate o número como moeda brasileira (R$)."
        ]
    },
    {
        id: 7,
        title: "Filtro Dinâmico de Portfólio",
        difficulty: 'Médio',
        description: "Crie botões para filtrar projetos por categoria (Web, Mobile, Design).",
        requirements: [
            "Adicione data-category nos cards de projeto.",
            "Esconda os cards que não pertencem à categoria clicada.",
            "O botão 'Todos' deve mostrar todos os itens."
        ]
    },
    {
        id: 8,
        title: "Sistema de Abas (Tabs) de Conteúdo",
        difficulty: 'Médio',
        description: "Troque o conteúdo visível de 'Nossos Serviços' sem mudar de página.",
        requirements: [
            "Crie botões e áreas de conteúdo correspondentes.",
            "Use classes CSS para alternar a visibilidade.",
            "Garanta que a aba ativa tenha destaque visual."
        ]
    },
    {
        id: 9,
        title: "Verificador de Newsletter",
        difficulty: 'Médio',
        description: "Melhore a experiência do campo de e-mail com feedback visual.",
        requirements: [
            "Valide o e-mail enquanto o usuário digita (evento input).",
            "Mude a cor da borda baseado na validade.",
            "Use Regex para validar o formato do e-mail."
        ]
    },
    {
        id: 10,
        title: "Contagem Regressiva de Oferta",
        difficulty: 'Médio',
        description: "Crie urgência com um cronômetro decrescente para uma promoção.",
        requirements: [
            "Defina uma data final fixa.",
            "Atualize a tela a cada 1 segundo com setInterval.",
            "Exiba Dias, Horas, Minutos e Segundos."
        ]
    },
    {
        id: 11,
        title: "Barra de Progresso de Leitura",
        difficulty: 'Difícil',
        description: "Crie uma barra no topo que indica quanto falta para ler a página.",
        requirements: [
            "Calcule a porcentagem de rolagem via scroll progress.",
            "Atualize o width de uma div fixa no topo conforme o scroll."
        ]
    },
    {
        id: 12,
        title: "Busca 'Live' em Lista de Benefícios",
        difficulty: 'Difícil',
        description: "Implemente um campo de busca que filtra itens na tela instantaneamente.",
        requirements: [
            "Tenha uma lista de ao menos 10 itens.",
            "Filtre os itens usando textContent.includes() enquanto digita.",
            "Esconda os que não combinam com o termo."
        ]
    },
    {
        id: 13,
        title: "DarkMode com LocalStorage",
        difficulty: 'Difícil',
        description: "Implemente a troca de temas e salve a escolha do usuário.",
        requirements: [
            "Crie um botão de alternância Sol/Lua.",
            "Mude variáveis CSS ou classes no body.",
            "Salve a preferência no localStorage."
        ]
    },
    {
        id: 14,
        title: "Slider de Depoimentos Automático",
        difficulty: 'Difícil',
        description: "Crie um carrossel que passa os feedbacks sozinho.",
        requirements: [
            "Troque o depoimento a cada 5 segundos automaticamente.",
            "Adicione botões de navegação manual.",
            "Crie um loop infinito (do último volta para o primeiro)."
        ]
    },
    {
        id: 15,
        title: "Modal de Saída (Exit Intent Popup)",
        difficulty: 'Difícil',
        description: "Detecte quando o usuário vai fechar a aba e mostre um modal.",
        requirements: [
            "Monitore o evento mouseleave no document.",
            "Mostre o modal apenas se o mouse sair por cima da página.",
            "Apareça apenas uma vez por sessão."
        ]
    },
    // ========== DESAFIOS COM FOCO EM JAVASCRIPT (16-30) ==========
    // Fáceis (16-20): Conceitos básicos de JS
    {
        id: 16,
        title: "Calculadora de Desconto com Try/Catch",
        difficulty: 'Fácil',
        description: "Crie uma seção de calculadora de desconto que trata erros de entrada inválida.",
        requirements: [
            "Crie campos para valor original e porcentagem de desconto.",
            "Use try/catch para capturar erros quando o usuário digitar texto inválido.",
            "No bloco catch, exiba uma mensagem de erro amigável na tela.",
            "Use throw new Error() para lançar erro quando o valor for negativo."
        ]
    },
    {
        id: 17,
        title: "Seletor de Planos com Switch",
        difficulty: 'Fácil',
        description: "Crie uma seção de planos (Básico/Pro/Premium) que muda dinamicamente com switch.",
        requirements: [
            "Crie 3 botões para selecionar o plano.",
            "Use switch/case para definir preço e benefícios de cada plano.",
            "Atualize o conteúdo da seção baseado no case selecionado.",
            "Inclua um case default para plano não reconhecido."
        ]
    },
    {
        id: 18,
        title: "Validador de Força de Senha com If/Else",
        difficulty: 'Fácil',
        description: "Crie um campo de senha com indicador visual de força usando estruturas condicionais.",
        requirements: [
            "Use if/else if/else para classificar: fraca (<6), média (6-10), forte (>10).",
            "Mude a cor de uma barra de progresso (vermelho/amarelo/verde).",
            "Exiba mensagem descritiva para cada nível de força.",
            "Valide em tempo real com evento input."
        ]
    },
    {
        id: 19,
        title: "Badges Dinâmicos com Operador Ternário",
        difficulty: 'Fácil',
        description: "Crie cards de produtos com badges que mudam dinamicamente usando operador ternário.",
        requirements: [
            "Crie cards com data-attributes (data-novo, data-popular, data-oferta).",
            "Use operador ternário para decidir qual badge exibir.",
            "Encadeie ternários para múltiplas condições.",
            "Aplique cores diferentes para cada tipo de badge."
        ]
    },
    {
        id: 20,
        title: "Gerador de Bio com Template Literals",
        difficulty: 'Fácil',
        description: "Crie uma seção 'Sobre Nós' com gerador de biografia usando template literals.",
        requirements: [
            "Crie inputs para nome, profissão e cidade.",
            "Use template literals com ${} para interpolar as variáveis.",
            "Gere um parágrafo formatado em tempo real conforme digita.",
            "Inclua template literal multilinha com quebras de linha."
        ]
    },
    // Médios (21-25): APIs e manipulação de arrays
    {
        id: 21,
        title: "Busca de CEP com Fetch API",
        difficulty: 'Médio',
        description: "Crie uma seção de contato que preenche o endereço automaticamente ao digitar o CEP.",
        requirements: [
            "Use fetch() para consultar a API ViaCEP (viacep.com.br/ws/CEP/json).",
            "Preencha automaticamente os campos de rua, bairro e cidade.",
            "Use .then() e .catch() para tratar a Promise.",
            "Exiba mensagem de erro se o CEP não for encontrado."
        ]
    },
    {
        id: 22,
        title: "Conversor de Moeda com Axios",
        difficulty: 'Médio',
        description: "Crie uma seção de preços com conversor de moeda em tempo real usando Axios.",
        requirements: [
            "Importe e use axios para fazer a requisição HTTP.",
            "Consulte uma API de cotação (ex: economia.awesomeapi.com.br).",
            "Exiba um loading spinner enquanto a requisição está em andamento.",
            "Converta e exiba o valor em pelo menos 2 moedas diferentes."
        ]
    },
    {
        id: 23,
        title: "Cards de Serviços com Array.map()",
        difficulty: 'Médio',
        description: "Crie uma seção de serviços onde os cards são gerados dinamicamente a partir de um array.",
        requirements: [
            "Crie um array de objetos com {id, titulo, descricao, icone}.",
            "Use .map() para transformar cada objeto em HTML de card.",
            "Insira o resultado no DOM usando innerHTML ou insertAdjacentHTML.",
            "Cada card deve ter um botão funcional."
        ]
    },
    {
        id: 24,
        title: "Filtro de Produtos por Preço com Array.filter()",
        difficulty: 'Médio',
        description: "Crie uma seção de produtos com filtro de faixa de preço usando filter().",
        requirements: [
            "Crie um array de produtos com {nome, preco, imagem}.",
            "Adicione inputs de preço mínimo e máximo.",
            "Use .filter() para mostrar apenas produtos dentro do range.",
            "Atualize a exibição em tempo real ao mudar os valores."
        ]
    },
    {
        id: 25,
        title: "Resumo de Pedido com Destructuring",
        difficulty: 'Médio',
        description: "Crie uma seção de checkout que exibe resumo do pedido usando destructuring.",
        requirements: [
            "Crie um objeto complexo com dados do pedido (cliente, itens, endereço).",
            "Use destructuring de objetos para extrair {nome, email} do cliente.",
            "Use destructuring de arrays para pegar o primeiro e último item.",
            "Exiba o resumo formatado usando os valores extraídos."
        ]
    },
    // Difíceis (26-30): Conceitos avançados de JS
    {
        id: 26,
        title: "Galeria de Fotos com Async/Await",
        difficulty: 'Difícil',
        description: "Crie uma galeria que carrega imagens de uma API externa usando async/await.",
        requirements: [
            "Crie uma função async para buscar dados da API.",
            "Use await com fetch para aguardar a resposta.",
            "Implemente try/catch dentro da função async para erros.",
            "Exiba loading spinner e substitua pelas imagens quando carregar."
        ]
    },
    {
        id: 27,
        title: "Dashboard com Promise.all()",
        difficulty: 'Difícil',
        description: "Crie uma seção de dashboard que carrega múltiplos dados simultaneamente.",
        requirements: [
            "Faça pelo menos 3 requisições fetch para endpoints diferentes.",
            "Use Promise.all() para executar todas em paralelo.",
            "Renderize todos os dados apenas quando TODAS as promises resolverem.",
            "Implemente tratamento de erro com Promise.allSettled() como fallback."
        ]
    },
    {
        id: 28,
        title: "Carrinho de Compras com Array.reduce()",
        difficulty: 'Difícil',
        description: "Crie uma seção de carrinho que calcula totais usando reduce().",
        requirements: [
            "Crie array de itens com {nome, preco, quantidade}.",
            "Use .reduce() para calcular o subtotal (soma de preco * quantidade).",
            "Aplique desconto percentual usando outro reduce.",
            "Exiba subtotal, desconto e total final formatados como moeda."
        ]
    },
    {
        id: 29,
        title: "Sistema de Favoritos com Closures",
        difficulty: 'Difícil',
        description: "Crie uma seção de produtos com sistema de favoritos usando closures.",
        requirements: [
            "Crie uma função factory que retorna um objeto com métodos.",
            "Use closure para manter o array de favoritos privado.",
            "Implemente métodos add(id), remove(id), getAll() e has(id).",
            "Os botões de coração devem usar esses métodos para gerenciar favoritos."
        ]
    },
    {
        id: 30,
        title: "Sistema de Notificações com Classes ES6",
        difficulty: 'Difícil',
        description: "Crie um sistema de toast notifications usando Classes e herança.",
        requirements: [
            "Crie uma classe base Notification com constructor(message, duration).",
            "Implemente métodos show(), hide() e auto-dismiss com setTimeout.",
            "Crie classes filhas SuccessNotification, ErrorNotification, WarningNotification.",
            "Cada tipo deve ter estilo visual diferente usando herança e super()."
        ]
    },
    // ========== DESAFIOS 31-40 (Acessibilidade, Performance, Formulários avançados) ==========
    {
        id: 31,
        title: "Máscara de Telefone e CPF em Input",
        difficulty: 'Fácil',
        description: "Aplique máscara em tempo real em campos de telefone e CPF na seção de contato.",
        requirements: [
            "Use o evento input nos campos de telefone e CPF.",
            "Formate telefone como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX conforme a quantidade de dígitos.",
            "Formate CPF como XXX.XXX.XXX-XX.",
            "Armazene ou valide apenas os números (sem formatação).",
            "Use regex ou substituição de strings para aplicar as máscaras."
        ]
    },
    {
        id: 32,
        title: "Menu Mobile (Hamburger) com JS",
        difficulty: 'Fácil',
        description: "Crie um ícone hamburger que abre e fecha o menu em viewport pequena.",
        requirements: [
            "Exiba o botão hamburger apenas em mobile (media query ou classe).",
            "Ao clicar no hamburger, alterne uma classe no menu (ex.: open) para mostrar/ocultar.",
            "Use animação ou transição CSS na abertura e fechamento.",
            "Opcional: feche o menu ao clicar em um link do menu."
        ]
    },
    {
        id: 33,
        title: "Skip Link e Foco por Teclado",
        difficulty: 'Fácil',
        description: "Implemente um link 'Pular para o conteúdo' e indicador visual de foco para navegação por teclado.",
        requirements: [
            "Crie um link skip no início da página, visível apenas ao receber foco.",
            "Ao ativar o link, mova o foco para o conteúdo principal com focus().",
            "Aplique estilos :focus-visible em botões e links para destacar o elemento focado."
        ]
    },
    {
        id: 34,
        title: "Busca com Debounce",
        difficulty: 'Médio',
        description: "Crie um campo de busca que dispara a filtragem apenas após o usuário parar de digitar.",
        requirements: [
            "Use setTimeout (ou uma função debounce) para atrasar a execução da busca.",
            "Cancele o timeout anterior a cada nova tecla digitada.",
            "Sugestão de tempo de espera: 300 a 500 ms.",
            "Aplique a busca em uma lista existente (ex.: benefícios ou produtos)."
        ]
    },
    {
        id: 35,
        title: "Formulário Multi-Step (Etapas)",
        difficulty: 'Médio',
        description: "Crie um formulário dividido em 2 ou 3 etapas com botões Próximo e Voltar.",
        requirements: [
            "Exiba apenas uma etapa por vez (oculte as demais com CSS ou JS).",
            "O botão Próximo valide os campos da etapa atual antes de avançar.",
            "O botão Voltar não precisa validar, apenas retorna à etapa anterior.",
            "Mostre indicador visual de progresso (ex.: Etapa 1 de 3)."
        ]
    },
    {
        id: 36,
        title: "Lazy Loading de Imagens com Intersection Observer",
        difficulty: 'Médio',
        description: "Carregue imagens apenas quando entrarem na área visível da tela (viewport).",
        requirements: [
            "Use IntersectionObserver para detectar quando a imagem entra no viewport.",
            "Armazene a URL real em data-src e deixe src vazio ou com placeholder.",
            "Ao entrar no viewport, copie data-src para src para disparar o carregamento.",
            "Opcional: use unobserve após carregar para parar de observar."
        ]
    },
    {
        id: 37,
        title: "Breadcrumb Dinâmico conforme Rota/Seção",
        difficulty: 'Médio',
        description: "Crie um breadcrumb que reflete a seção ou 'rota' atual da página (single-page).",
        requirements: [
            "Defina um array ou objeto com a estrutura da página (ex.: Início > Serviços > Web).",
            "Ao rolar ou clicar em seções, atualize o breadcrumb no DOM.",
            "O último item pode ser texto apenas (sem link) ou com estilo diferente."
        ]
    },
    {
        id: 38,
        title: "Quiz de Múltipla Escolha com Contador de Acertos",
        difficulty: 'Difícil',
        description: "Crie um quiz com várias perguntas, alternativas e feedback ao final.",
        requirements: [
            "Tenha um array de perguntas com pergunta, opcoes e indice ou valor da opção correta.",
            "Renderize uma pergunta por vez ou todas; ao submeter, conte os acertos.",
            "Exiba o resultado final (ex.: X de Y acertos) e opção de reiniciar o quiz."
        ]
    },
    {
        id: 39,
        title: "Envio de Formulário de Contato com Fetch (POST)",
        difficulty: 'Difícil',
        description: "Crie um formulário de contato que envia os dados via fetch para uma API ou endpoint de teste.",
        requirements: [
            "Intercepte o submit e use preventDefault().",
            "Use fetch com método POST, header Content-Type: application/json e body JSON.stringify(dados).",
            "Exiba um estado de loading durante o envio.",
            "Trate resposta de sucesso e erro exibindo mensagem na tela.",
            "Use endpoint de teste (ex.: JSONPlaceholder) se não tiver backend."
        ]
    },
    {
        id: 40,
        title: "Carrinho Persistente com localStorage",
        difficulty: 'Difícil',
        description: "Crie um carrinho que mantém os itens ao recarregar a página usando localStorage.",
        requirements: [
            "Ao adicionar ou remover item, atualize o array no localStorage.",
            "Ao carregar a página, leia do localStorage e renderize o carrinho.",
            "Calcule e exiba o total (subtotal ou total geral).",
            "Sugestão de estrutura do item: { id, nome, preco, quantidade }."
        ]
    }
];

// ========== CATEGORIAS DE DESAFIOS PARA BADGES ==========
// Mapeamento de IDs de desafios por categoria (usado para badges SPECIAL)
export const challengeCategories = {
    // Desafios simples (DOM e interatividade)
    dom: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 32, 33, 37],
    
    // Desafios JavaScript (conceitos específicos)
    javascript: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    
    // Categorias temáticas para badges SPECIAL
    tryCatch: [16, 26],              // Error Handler - desafios com try/catch
    api: [21, 22, 26, 27, 39],      // API Explorer - desafios com consumo/envio de API
    arrayMethods: [23, 24, 28],     // Array Master - desafios com map/filter/reduce
    async: [26, 27],                // Async Ninja - desafios com async/await ou Promises
    classes: [30],                  // OOP Architect - desafios com Classes ES6
    accessibility: [33],            // Acessibilidade - skip link, foco teclado
    performance: [34, 36],          // Performance - debounce, lazy loading
    forms: [31, 35],                // Formulários avançados - máscara, multi-step
    storage: [40],                  // Estado persistente - localStorage
};

// Função auxiliar para verificar se um desafio pertence a uma categoria
export function isChallengeInCategory(challengeId: number, category: keyof typeof challengeCategories): boolean {
    return challengeCategories[category].includes(challengeId);
}

// Função para obter todas as categorias de um desafio
export function getChallengeCategories(challengeId: number): string[] {
    const categories: string[] = [];
    for (const [category, ids] of Object.entries(challengeCategories)) {
        if (ids.includes(challengeId)) {
            categories.push(category);
        }
    }
    return categories;
}