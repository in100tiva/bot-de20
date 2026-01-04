# 🎲 Bot D20 - Sistema de Rolagem de Dados para Discord

Um bot de Discord especializado em rolagens de dado D20, perfeito para sessões de RPG! Com interface visual moderna, histórico de rolagens e feedback interativo.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Discord.js](https://img.shields.io/badge/discord.js-v14-7289DA.svg)

## ✨ Características

- 🎯 **Rolagem de D20** - Sistema completo de rolagem de dados d20
- 🌟 **Feedback Visual** - Embeds coloridos com emojis baseados no resultado
- 📜 **Histórico** - Acompanhe suas últimas 5 rolagens
- 🔥 **Críticos Especiais** - Animações especiais para 20 (crítico) e 1 (falha crítica)
- 🔄 **Botão Interativo** - Role novamente com um clique
- 👤 **Personalizado** - Exibe avatar e nome do jogador

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Uma conta no [Discord Developer Portal](https://discord.com/developers/applications)
- Git (para clonar o repositório)

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/in100tiva/bot-de20.git
cd bot-de20
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure o Token do Bot

1. Crie um arquivo `.env` na raiz do projeto:

```bash
DISCORD_TOKEN=seu_token_aqui
```

2. Obtenha seu token:
   - Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
   - Crie uma nova aplicação (ou use uma existente)
   - Vá em **Bot** → Copie o **Token**
   - Cole no arquivo `.env`

⚠️ **IMPORTANTE:** Nunca compartilhe seu token! O arquivo `.env` já está no `.gitignore`.

### 4. Execute o Bot

**Desenvolvimento (com hot-reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm run build
npm start
```

## 🤖 Adicionar o Bot ao Seu Servidor

### Método 1: Link Direto (Recomendado)

Use este link para adicionar o bot ao seu servidor:

👉 [**CLIQUE AQUI PARA ADICIONAR O BOT**](https://discord.com/oauth2/authorize?client_id=1457450454865940511&permissions=18432&integration_type=0&scope=bot+applications.commands)

### Método 2: Gerar Seu Próprio Link

1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
2. Selecione sua aplicação
3. Vá em **OAuth2** → **URL Generator**
4. Marque os seguintes **SCOPES:**
   - `bot`
   - `applications.commands`
5. Marque as seguintes **PERMISSIONS:**
   - `Send Messages` (Enviar Mensagens)
   - `Embed Links` (Incorporar Links)
6. Copie o URL gerado e abra no navegador
7. Selecione o servidor e autorize

## 📊 Status e Monitoramento em Tempo Real

Acompanhe o status do bot e seu tempo de atividade em tempo real:

🟢 **[Status do Bot em Tempo Real](https://stats.uptimerobot.com/NWYvcHmpYB)**

Esta página mostra:
- ✅ Status atual do bot (Online/Offline)
- ⏱️ Tempo de uptime
- 📈 Histórico de disponibilidade
- 🔔 Incidentes e manutenções

## 📖 Comandos de Uso

### Comando Principal

```
d20
```

Rola um dado de 20 lados (D20) e exibe o resultado em um embed estilizado.

### 🎯 Tipos de Resultado

| Valor | Tipo | Cor | Descrição |
|-------|------|-----|-----------|
| **20** | 🌟 SUCESSO CRÍTICO | Dourado | Acerto perfeito! |
| **15-19** | ✅ Ótimo Resultado | Verde | Rolagem alta |
| **2-14** | 🎲 Rolagem Normal | Azul | Rolagem padrão |
| **1** | 💀 FALHA CRÍTICA | Vermelho | Erro crítico! |

### 🔄 Botão Interativo

Após cada rolagem, um botão **"Rolar Novamente"** aparece:
- Clique para fazer uma nova rolagem
- O histórico é atualizado automaticamente
- A mensagem é atualizada (não cria spam no chat)

### 📜 Histórico de Rolagens

Cada embed mostra seus últimos 5 resultados:
```
📜 Histórico Recente (Últimos 5)
12 → 7 → 18 → 20 → 3
```

## 🏗️ Estrutura do Projeto

```
d20/
├── src/
│   ├── commands/
│   │   └── d20.ts          # Lógica do comando de rolagem
│   ├── utils/
│   │   └── dice.ts         # Funções utilitárias de dados
│   └── index.ts            # Arquivo principal do bot
├── .env                     # Variáveis de ambiente (não commitado)
├── .gitignore              # Arquivos ignorados pelo Git
├── package.json            # Dependências e scripts
├── tsconfig.json           # Configuração do TypeScript
└── README.md               # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **[Discord.js v14](https://discord.js.org/)** - Biblioteca para interagir com a API do Discord
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem
- **[Node.js](https://nodejs.org/)** - Ambiente de execução JavaScript
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Gerenciamento de variáveis de ambiente

## 📦 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Dev** | `npm run dev` | Executa em modo desenvolvimento com tsx |
| **Build** | `npm run build` | Compila TypeScript para JavaScript |
| **Start** | `npm start` | Inicia o bot compilado em produção |

## 🌐 Deploy em Produção (Render)

### 1. Configure o Repositório

O projeto já está configurado para deploy! Os scripts necessários estão no `package.json`.

### 2. Configure no Render

1. Crie uma conta em [Render.com](https://render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** bot-d20
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

### 3. Adicione Variáveis de Ambiente

No painel do Render, vá em **Environment** e adicione:

```
DISCORD_TOKEN=seu_token_aqui
```

### 4. Deploy

Clique em **"Create Web Service"** e aguarde o deploy!

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/in100tiva/bot-de20/issues) com:
- Descrição do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)

## 📝 Licença

Este projeto está sob a licença ISC.

## 👤 Autor

Desenvolvido com ❤️ por **in100tiva**

---

## 📸 Screenshots

### Rolagem Normal
```
🎲 Rolagem de Dado
Dado: 1d20
Resultado: ✨ 12
📜 Histórico Recente: 7 → 18 → 20
```

### Sucesso Crítico (20)
```
🌟 SUCESSO CRÍTICO!
Os deuses sorriem para você!
Dado: 1d20
Resultado: 🔥 20
```

### Falha Crítica (1)
```
💀 FALHA CRÍTICA!
Dado: 1d20
Resultado: ⚠️ 1
```

---

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!

🎲 **Boas aventuras e boas rolagens!** 🎲
