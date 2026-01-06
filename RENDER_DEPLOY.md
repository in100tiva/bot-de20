# 🚀 Deploy no Render - Checklist Completo

## ✅ CONFIGURAÇÕES OBRIGATÓRIAS

### 1. Build Command
```
npm install && npm run build
```

### 2. Start Command
```
npm start
```

### 3. Environment (Versão Node)
- Node Version: `18.x` ou superior
- O Render detecta automaticamente via `package.json`

---

## 🔐 VARIÁVEIS DE AMBIENTE OBRIGATÓRIAS

Adicione em **Environment** → **Environment Variables**:

### DISCORD_TOKEN
```
Seu token do Discord Bot
Exemplo: MTQ1NzQ1MDQ1NDg2NTk0MDUxMQ.GXXXxX.XXXXXXXXXXXXXXXXXXXXXXXXXX
```

### DATABASE_URL (Prisma Accelerate)
```
prisma+postgres://accelerate.prisma-data.net/?api_key=sua_api_key_aqui
```

### SUPABASE_URL (Integração GoDevs)
```
https://seu-projeto.supabase.co
```
⚠️ URL do projeto Supabase GoDevs (Settings > API > Project URL)

### SUPABASE_ANON_KEY (Integração GoDevs)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx...
```
⚠️ Chave anon/public do Supabase (Settings > API > anon public)

### PORT (Opcional)
```
8080
```
⚠️ O Render define automaticamente, mas podemos fixar em 8080

---

## 📋 DEPENDÊNCIAS VERIFICADAS

### ✅ Dependencies (Produção)
- `@prisma/client` - ✅ Cliente Prisma (OBRIGATÓRIO em prod)
- `@prisma/extension-accelerate` - ✅ Cache e performance
- `discord.js` - ✅ Biblioteca Discord
- `dotenv` - ✅ Variáveis de ambiente
- `node-cron` - ✅ Agendador de tarefas

### ✅ DevDependencies (Build apenas)
- `prisma` - ✅ CLI do Prisma (usado no build)
- `typescript` - ✅ Compilador
- `tsx` - ✅ Dev runner
- `@types/*` - ✅ Tipos TypeScript

---

## 🔍 VERIFICAÇÕES PRÉ-DEPLOY

### ✅ Build Local
```bash
npm run build
```
**Status:** ✅ Funcionando

### ✅ Prisma Generate
```bash
npm run db:generate
```
**Status:** ✅ Funcionando

### ✅ Variáveis de Ambiente
- ✅ DISCORD_TOKEN configurado
- ✅ DATABASE_URL configurado
- ✅ SUPABASE_URL configurado (integração GoDevs)
- ✅ SUPABASE_ANON_KEY configurado (integração GoDevs)
- ✅ PORT configurado (opcional)

### ✅ Scripts de Build
- `build`: ✅ `prisma generate && tsc`
- `start`: ✅ `node dist/index.js`

---

## ⚙️ CONFIGURAÇÃO DO RENDER

### Tipo de Serviço
- **Web Service** (não Background Worker)

### Branch
- `main`

### Root Directory
- ` ` (deixe vazio, usa raiz do repo)

### Build Command
```
npm install && npm run build
```

### Start Command
```
npm start
```

### Auto-Deploy
- ✅ Habilitado (deploy automático no push)

---

## 🗄️ BANCO DE DADOS

### Prisma Accelerate
- ✅ Connection pooling ativo
- ✅ Cache global habilitado
- ✅ Edge network otimizada

### Tabelas Criadas
- ✅ users (com campos goDevsActivitiesCount e lastSyncedAt)
- ✅ challenges (15 desafios)
- ✅ submissions
- ✅ daily_posts
- ✅ badges (6 badges)
- ✅ user_badges
- ✅ godevs_activities (cache de atividades do Supabase)

⚠️ **NÃO execute `db:push` ou `db:seed` no Render!**
O banco já está configurado e populado.

---

## 📊 LOGS ESPERADOS NO DEPLOY

### Build (✅ Sucesso):
```
Running 'npm install && npm run build'
✔ Generated Prisma Client
Build successful 🎉
```

### Start (✅ Funcionando):
```
Running 'npm start'
✅ Logado como Desafio#3124
🎯 Servidores: 1
⏰ Agendador inicializado:
   📅 Horário: 02:40 (Horário de Brasília)
   🌍 Timezone: America/Sao_Paulo
   🔄 Frequência: Todos os dias
✅ Cron job ativo e aguardando próxima execução!
Your service is live 🎉
```

---

## 🚨 POSSÍVEIS ERROS E SOLUÇÕES

### Erro: "Missing Permissions" (50013)
**Causa:** Bot sem permissões no canal #desafio
**Solução:** 
1. Converter canal de "News Channel" para "Text Channel"
2. Ou dar permissões específicas ao bot

### Erro: "Cannot find module @prisma/client"
**Causa:** @prisma/client em devDependencies
**Solução:** ✅ JÁ CORRIGIDO (movido para dependencies)

### Erro: "DATABASE_URL not found"
**Causa:** Variável de ambiente não configurada
**Solução:** Adicionar DATABASE_URL nas env vars do Render

### Erro: "Prisma schema validation"
**Causa:** Schema desatualizado
**Solução:** ✅ JÁ RESOLVIDO (build regenera automaticamente)

---

## ✅ COMPATIBILIDADE CONFIRMADA

### Node.js
- ✅ v18.x ou superior (Render suporta)
- ✅ ES Modules (`"type": "module"`)

### Prisma
- ✅ v5.22.0 (estável)
- ✅ Accelerate habilitado
- ✅ PostgreSQL via connection string

### Discord.js
- ✅ v14.17.3 (estável)
- ✅ Intents configurados
- ✅ Slash commands registrados

### Dependências
- ✅ Todas compatíveis com Node 18+
- ✅ Sem vulnerabilidades (npm audit)

---

## 🎯 PRÓXIMOS PASSOS APÓS DEPLOY

1. ✅ Verificar logs do Render
2. ✅ Testar comandos no Discord:
   - `/desafio` - Envia desafio manualmente
   - `/status` - Ver desafios enviados
   - `/agenda` - Info do agendamento
   - `/entregar` - Entregar solução de desafio
   - `/ranking` - Ver top 10 usuários
   - `/perfil` - Ver estatísticas completas
   - `/atualizar` - Sincronizar atividades do GoDevs
3. ✅ Resolver permissões do canal #desafio
4. ✅ Monitorar com UptimeRobot

## 🔗 INTEGRAÇÃO GODEVS

O bot sincroniza atividades do portal GoDevs (https://godevs.in100tiva.com) com o banco local do Discord.

### Como funciona:
1. Usuário usa `/atualizar` no Discord
2. Bot busca atividades no Supabase via REST API (timeout 2s)
3. Atividades são cacheadas no Prisma local
4. `/perfil` mostra estatísticas unificadas (Discord + GoDevs)

### Requisitos para sincronização:
- Usuário deve ter `discord_id` cadastrado no perfil GoDevs
- Variáveis `SUPABASE_URL` e `SUPABASE_ANON_KEY` configuradas no Render

---

## 📞 SUPORTE

- **Logs:** https://dashboard.render.com → Seu serviço → Logs
- **Prisma Console:** https://console.prisma.io
- **Discord Developer:** https://discord.com/developers/applications

---

✅ **TUDO VERIFICADO E PRONTO PARA DEPLOY!**

