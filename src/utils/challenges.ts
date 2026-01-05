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
        title: "Seção Hero com Background Dinâmico",
        difficulty: 'Médio',
        description: "Construa a seção principal de uma landing page (Hero Section) que seja impactante.",
        requirements: [
            "Título (H1) centralizado com sombra suave.",
            "Botão de CTA que muda de cor e aumenta levemente no hover.",
            "Fundo com um gradiente animado ou uma imagem de alta qualidade com overlay escuro."
        ]
    },
    {
        id: 2,
        title: "Menu Sticky com Efeito de Scroll",
        difficulty: 'Fácil',
        description: "Implemente um menu de navegação que acompanhe a rolagem da página.",
        requirements: [
            "O menu deve ser transparente ao carregar a página.",
            "Ao rolar 50px para baixo, o fundo deve ficar sólido (ex: branco) usando JavaScript.",
            "Deve conter links para 'Início', 'Sobre' e 'Serviços' com scroll suave."
        ]
    },
    {
        id: 3,
        title: "Seção de Depoimentos (Testimonials) com Grid",
        difficulty: 'Médio',
        description: "Crie uma seção de prova social para a landing page usando CSS Grid.",
        requirements: [
            "Layout de 3 colunas que vira 1 coluna no mobile.",
            "Cada card deve ter foto do cliente (redonda), nome e o depoimento.",
            "Efeito de 'Glassmorphism' (fundo desfocado) nos cards."
        ]
    }
];