# 🚀 GoDevs Daily Challenge Bot

Um bot para Discord desenvolvido em TypeScript focado em impulsionar o aprendizado de alunos de programação. O bot envia missões diárias de construção de componentes para Landing Pages, focando em habilidades de HTML, CSS e JavaScript.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Discord.js](https://img.shields.io/badge/discord.js-v14-7289DA.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)

## 📌 Funcionalidades

- ⏰ **Desafios Diários**: Postagem automática todos os dias às **09:00** (Horário de Brasília).
- 🎮 **Comando Manual**: Use o comando `!desafio` para disparar uma missão instantaneamente no canal de anúncios.
- 💻 **Foco em Front-end**: Desafios baseados em requisitos reais de mercado para Landing Pages.
- 🔗 **Integração com Portal**: Instruções diretas para submissão de código no [Portal GoDevs](https://godevs.in100tiva.com).
- 🌐 **Sistema Anti-Sleep**: Servidor HTTP integrado para manter o bot online 24h em plataformas como Render e Koyeb.
- 🎨 **Embeds Estilizados**: Mensagens visuais profissionais com informações detalhadas de cada desafio.

## 📂 Estrutura do Projeto

```
src/
├── utils/
│   ├── challenges.ts   # Banco de dados de missões (descrições e requisitos)
│   └── scheduler.ts    # Lógica do agendador cron e função de postagem
└── index.ts            # Ponto de entrada, servidor HTTP e listeners de comandos
```

## 🛠️ Tecnologias Utilizadas

- **[Discord.js v14](https://discord.js.org/)** - API oficial do Discord
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem segura
- **[Node-Cron](https://www.npmjs.com/package/node-cron)** - Agendador de tarefas automáticas
- **[TSX](https://github.com/privatenumber/tsx)** - Executor de TypeScript rápido para desenvolvimento
- **[Node.js HTTP](https://nodejs.org/)** - Servidor HTTP integrado para manter o bot ativo

## 🚀 Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- Uma aplicação de Bot criada no [Discord Developer Portal](https://discord.com/developers/applications)
- Um canal no seu servidor chamado exatamente `desafio`

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/in100tiva/bot-de20.git
cd bot-de20
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz e adicione seu token:

```env
DISCORD_TOKEN=seu_token_aqui
PORT=8080
```

⚠️ **IMPORTANTE:** Nunca compartilhe seu token! O arquivo `.env` já está no `.gitignore`.

### Desenvolvimento

Para rodar o bot localmente com reinicialização automática (hot-reload):

```bash
npm run dev
```

### Produção (Build)

Para compilar e iniciar o bot:

```bash
npm run build
npm start
```

## 🤖 Adicionar o Bot ao Seu Servidor

### Link de Convite

Use este link para adicionar o bot ao seu servidor:

👉 [**CLIQUE AQUI PARA ADICIONAR O BOT**](https://discord.com/oauth2/authorize?client_id=1457450454865940511&permissions=18432&integration_type=0&scope=bot+applications.commands)

### Configuração do Servidor

1. Certifique-se de ter um canal chamado **`desafio`** no seu servidor
2. O bot precisa das seguintes permissões:
   - `Send Messages` (Enviar Mensagens)
   - `Embed Links` (Incorporar Links)
   - `Manage Messages` (Gerenciar Mensagens - para deletar comandos)

## 📖 Comandos

### Comando Manual

```
!desafio
```

Dispara um desafio aleatório imediatamente no canal `desafio`. O comando é deletado automaticamente após o uso para manter o canal limpo.

### Postagem Automática

O bot posta automaticamente um desafio todos os dias às **09:00** (horário de Brasília) no canal `desafio`.

## 🎯 Exemplo de Desafio

Quando um desafio é postado, ele aparece assim:

```
📢 ATENÇÃO GODEVS!
Novo desafio de construção liberado. Quem aceita a missão?

🚀 Missão do Dia: Seção Hero com Background Dinâmico
Construa a seção principal de uma landing page (Hero Section) que seja impactante.

🛠️ Requisitos Técnicos:
• Título (H1) centralizado com sombra suave.
• Botão de CTA que muda de cor e aumenta levemente no hover.
• Fundo com um gradiente animado ou uma imagem de alta qualidade com overlay escuro.

📊 Dificuldade: Médio
🔗 Entrega: Portal GoDevs

Daily Challenge • Foco em Landing Pages
```

## ☁️ Hospedagem (Render / Koyeb)

### Deploy no Render

1. Crie uma conta em [Render.com](https://render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** godevs-challenge-bot
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

### Variáveis de Ambiente

No painel do Render/Koyeb, adicione:

| Variável | Valor | Obrigatório |
|----------|-------|-------------|
| `DISCORD_TOKEN` | Seu token do bot | ✅ Sim |
| `PORT` | 8080 | ⚠️ Opcional (definido automaticamente) |

### Dica: Monitoramento 24h

Utilize o [UptimeRobot](https://uptimerobot.com/) para monitorar a URL gerada pela hospedagem e evitar que o bot entre em modo de suspensão.

## 📊 Status e Monitoramento em Tempo Real

Acompanhe o status do bot e seu tempo de atividade em tempo real:

🟢 **[Status do Bot em Tempo Real](https://stats.uptimerobot.com/NWYvcHmpYB)**

Esta página mostra:
- ✅ Status atual do bot (Online/Offline)
- ⏱️ Tempo de uptime
- 📈 Histórico de disponibilidade
- 🔔 Incidentes e manutenções

## 🎓 Desafios Disponíveis

O bot atualmente possui os seguintes desafios (mais serão adicionados):

1. **Seção Hero com Background Dinâmico** (Médio)
2. **Menu Sticky com Efeito de Scroll** (Fácil)
3. **Seção de Depoimentos com Grid** (Médio)

### Adicionar Novos Desafios

Para adicionar novos desafios, edite o arquivo `src/utils/challenges.ts`:

```typescript
{
    id: 4,
    title: "Seu Novo Desafio",
    difficulty: 'Fácil', // ou 'Médio' ou 'Difícil'
    description: "Descrição do desafio aqui",
    requirements: [
        "Requisito 1",
        "Requisito 2",
        "Requisito 3"
    ]
}
```

## 📦 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Dev** | `npm run dev` | Executa em modo desenvolvimento com watch mode |
| **Build** | `npm run build` | Compila TypeScript para JavaScript |
| **Start** | `npm start` | Inicia o bot compilado em produção |

## 🔧 Configuração do Cron

O agendador está configurado em `src/utils/scheduler.ts`:

```typescript
cron.schedule('0 0 9 * * *', async () => {
    // Executa todos os dias às 09:00
    await postarDesafio(client);
}, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
});
```

Para alterar o horário, modifique a expressão cron:
- `0 0 9 * * *` = 09:00 todos os dias
- `0 0 18 * * *` = 18:00 todos os dias
- `0 0 12 * * 1` = 12:00 toda segunda-feira

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovoDesafio`)
3. Commit suas mudanças (`git commit -m 'Adiciona novo desafio'`)
4. Push para a branch (`git push origin feature/NovoDesafio`)
5. Abrir um Pull Request

### Como Contribuir com Novos Desafios

1. Edite `src/utils/challenges.ts`
2. Adicione um novo objeto `Challenge` seguindo o padrão existente
3. Teste localmente com `!desafio`
4. Envie um Pull Request com descrição detalhada

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/in100tiva/bot-de20/issues) com:
- Descrição do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Logs do console (se aplicável)

## 📝 Licença

Este projeto está sob a licença ISC.

## 👤 Autor

Desenvolvido com ❤️ por **in100tiva**

---

## 🎯 Roadmap

- [ ] Adicionar mais desafios (meta: 30+ desafios)
- [ ] Sistema de votação para desafios mais populares
- [ ] Comando `!stats` para ver estatísticas de participação
- [ ] Integração com banco de dados para histórico
- [ ] Sistema de badges/conquistas para participantes
- [ ] Webhook para notificações de entregas no portal

---

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!

💻 **Bora codar e evoluir juntos!** 🚀
