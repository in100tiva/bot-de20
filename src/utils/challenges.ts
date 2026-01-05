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
    }
];