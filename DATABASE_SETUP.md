# 🗄️ Configuração do Banco de Dados Prisma

## 📋 Pré-requisitos

Você precisa de uma das opções:
1. **Prisma Postgres** (Recomendado - Gratuito)
2. **Supabase**
3. **PostgreSQL local**
4. **Outro provedor PostgreSQL**

---

## 🚀 Opção 1: Prisma Postgres (Mais Fácil)

### Passo 1: Criar Conta
1. Acesse: https://console.prisma.io
2. Faça login com GitHub
3. Crie um novo workspace (se necessário)

### Passo 2: Criar Database
```bash
# Via MCP do Prisma (se disponível)
npx prisma db push
```

Ou manualmente no console:
1. Clique em "New Database"
2. Nome: `godevs-bot`
3. Região: `us-east-1` (ou mais próxima)
4. Clique em "Create"

### Passo 3: Obter Connection String
1. Clique no database criado
2. Copie a **Prisma Connection String**
3. Adicione no arquivo `.env`:

```env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=SEU_API_KEY_AQUI"
```

---

## 🗃️ Opção 2: Supabase (Alternativa Gratuita)

### Passo 1: Criar Projeto
1. Acesse: https://supabase.com
2. Crie uma conta
3. Clique em "New Project"
4. Nome: `godevs-bot`
5. Senha do banco (salve em local seguro!)
6. Região: `East US` ou mais próxima
7. Aguarde ~2min para criar

### Passo 2: Obter Connection String
1. Vá em **Settings** → **Database**
2. Role até "Connection String"
3. Copie a **Connection Pooling** (recomendado) ou **Direct Connection**
4. Adicione no `.env`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
```

---

## 💻 Opção 3: PostgreSQL Local

### Instalar PostgreSQL
**Windows:**
```bash
# Via Chocolatey
choco install postgresql

# Ou baixe em: https://www.postgresql.org/download/windows/
```

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### Criar Database
```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar database
CREATE DATABASE godevs_bot;

# Sair
\q
```

### Connection String
```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/godevs_bot"
```

---

## 🔧 Configurar o Projeto

### 1. Adicionar DATABASE_URL ao .env

Crie ou edite o arquivo `.env` na raiz:

```env
DISCORD_TOKEN=seu_token_aqui
PORT=8080
DATABASE_URL="sua_connection_string_aqui"
```

⚠️ **IMPORTANTE:** O `.env` já está no `.gitignore`, nunca commite esta connection string!

### 2. Gerar Cliente Prisma

```bash
npm run db:generate
```

Este comando cria os tipos TypeScript baseados no schema.

### 3. Criar Tabelas no Banco

```bash
npm run db:push
```

Este comando aplica o schema ao banco de dados.

### 4. Popular com Dados Iniciais

```bash
npm run db:seed
```

Isso vai criar:
- ✅ 15 desafios do GoDevs
- ✅ 6 badges (Iniciante, Dedicado, Expert, Mestre, Streak 7, Perfeccionista)

---

## 📊 Verificar o Banco

### Prisma Studio (Interface Visual)

```bash
npm run db:studio
```

Abre em `http://localhost:5555` uma interface visual para:
- Ver todas as tabelas
- Editar dados manualmente
- Testar queries

---

## 🔄 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run db:generate` | Gera o Prisma Client |
| `npm run db:push` | Aplica schema ao banco |
| `npm run db:seed` | Popula com dados iniciais |
| `npm run db:studio` | Abre interface visual |

---

## 📋 Schema do Banco

### Tabelas Criadas:

1. **users** - Usuários do Discord
   - discordId, username, points, streak
   
2. **challenges** - Desafios disponíveis
   - title, description, difficulty, requirements

3. **submissions** - Entregas dos usuários
   - url, status, points, feedback

4. **daily_posts** - Histórico de postagens
   - challengeId, channelId, messageId, postedAt

5. **badges** - Conquistas disponíveis
   - name, description, icon, requirement

6. **user_badges** - Badges conquistados por usuários

---

## 🚨 Troubleshooting

### Erro: "Can't reach database server"
- Verifique se a DATABASE_URL está correta
- Teste a conexão com `npx prisma db push`

### Erro: "Environment variable not found: DATABASE_URL"
- Certifique-se que o `.env` existe
- Verifique se DATABASE_URL está definido no `.env`

### Erro ao fazer seed
```bash
# Limpe o banco e tente novamente
npx prisma db push --force-reset
npm run db:seed
```

### Ver logs detalhados
```bash
# Linux/Mac
DATABASE_URL="..." npx prisma db push --preview-feature

# Windows PowerShell
$env:DATABASE_URL="..."; npx prisma db push
```

---

## 🎯 Próximos Passos

Após configurar o banco:

1. ✅ Execute `npm run build` para compilar
2. ✅ Execute `npm run register` para registrar comandos
3. ✅ Execute `npm run dev` para testar localmente
4. ✅ Adicione DATABASE_URL nas variáveis de ambiente do Render

**No Render:**
1. Vá em "Environment"
2. Adicione: `DATABASE_URL` = sua connection string
3. Salve e faça redeploy

---

## 📚 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Dúvidas?** Consulte os logs ou abra uma issue! 🚀

