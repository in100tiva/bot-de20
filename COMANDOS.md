# 🎯 Comandos Slash Implementados

## ⚡ Como Ativar os Comandos

**IMPORTANTE:** Execute este comando UMA VEZ para registrar os comandos no Discord:

```bash
npm run register
```

Isso vai registrar todos os comandos slash no Discord. Pode levar alguns minutos para aparecerem.

---

## 📋 Comandos de Desafios

### `/desafio [id?]`
Envia um desafio manualmente para o canal #desafio

**Parâmetros:**
- `id` (opcional): ID específico do desafio (1-15)

**Exemplos:**
- `/desafio` - Envia um desafio aleatório não utilizado
- `/desafio id:5` - Envia o desafio #5

---

### `/status`
Mostra o status do sistema de desafios

**Informações exibidas:**
- Total de desafios disponíveis
- Quantos já foram enviados
- Quantos faltam
- Lista de IDs já enviados

---

### `/adicionar id:`
Adiciona manualmente um ID ao histórico de desafios enviados

**Parâmetros:**
- `id` (obrigatório): ID do desafio (1-15)

**Uso:**
- `/adicionar id:3` - Marca o desafio #3 como enviado

**Útil quando:**
- Você enviou um desafio fora do sistema
- Quer pular um desafio específico
- Precisa corrigir o histórico

---

### `/limpar`
**⚠️ CUIDADO!** Limpa TODO o histórico de desafios

**O que faz:**
- Remove todos os IDs do arquivo `sorteio.json`
- Todos os desafios ficam disponíveis novamente
- Útil para resetar o sistema

---

### `/agenda`
Mostra informações sobre o agendamento automático

**Informações exibidas:**
- Horário configurado (02:40 Brasília)
- Timezone
- Frequência
- Tempo até próxima execução
- Como funciona o sistema

---

## 🤖 Sistema Automático

### Configuração Atual
- **Horário:** 02:40 (Horário de Brasília)
- **Timezone:** America/Sao_Paulo
- **Frequência:** Todos os dias
- **Formato Cron:** `0 40 2 * * *`

### Como Funciona
1. Todos os dias às 02:40, o bot seleciona automaticamente um desafio
2. Ele escolhe apenas desafios que ainda não foram enviados
3. Quando todos os 15 desafios forem enviados, o histórico reseta automaticamente
4. O desafio é postado no canal #desafio

### Alterar Horário
Edite `src/utils/scheduler.ts` linha 108:

```typescript
cron.schedule('0 40 2 * * *', async () => {
    // 0 40 2 = 02:40
    // Formato: segundo minuto hora dia mês dia-da-semana
})
```

**Exemplos:**
- `0 0 9 * * *` = 09:00 todos os dias
- `0 30 18 * * *` = 18:30 todos os dias
- `0 0 12 * * 1` = 12:00 toda segunda-feira

---

## 🎮 Comandos de Gamificação

### `/entregar desafio_id: url:`
Entrega a solução de um desafio

**Parâmetros:**
- `desafio_id` (obrigatório): ID do desafio (1-15)
- `url` (obrigatório): Link do repositório GitHub com sua solução

**Exemplos:**
- `/entregar desafio_id:5 url:https://github.com/usuario/meu-projeto`

**Validações:**
- ✅ URL deve ser do GitHub
- ✅ Desafio deve existir
- ✅ Cria submissão com status "Pendente"

---

### `/ranking`
Mostra o top 10 usuários com mais pontos

**Informações exibidas:**
- Posição no ranking (🥇🥈🥉 para top 3)
- Nome do usuário
- Pontos totais
- Streak de dias ativos
- Total de atividades (Discord + GoDevs)

---

### `/perfil [usuario?]`
Mostra estatísticas completas do usuário

**Parâmetros:**
- `usuario` (opcional): Usuário para ver o perfil (padrão: você mesmo)

**Informações exibidas:**
- ⭐ Pontos totais
- 🔥 Streak de dias
- ⏳ Entregas pendentes
- 🎯 Desafios Discord (aprovados)
- 💻 Atividades GoDevs (sincronizadas)
- 📊 Total unificado
- 🏆 Badges conquistadas

**Exemplos:**
- `/perfil` - Ver seu próprio perfil
- `/perfil usuario:@JohnDoe` - Ver perfil de outro usuário

---

### `/atualizar`
Sincroniza suas atividades do GoDevs com o bot

**O que faz:**
1. Busca atividades no portal GoDevs (via Supabase)
2. Armazena no cache local (Prisma)
3. Atualiza contador de atividades
4. Mostra as 5 atividades mais recentes

**Requisitos:**
- Seu Discord ID deve estar cadastrado no perfil do GoDevs
- Acesse [godevs.in100tiva.com](https://godevs.in100tiva.com) para vincular

**Dica:** Use após enviar atividades no GoDevs para atualizar seu perfil!

---

## 📊 Banco de Dados Prisma

O histórico agora é armazenado no banco de dados PostgreSQL (via Prisma Accelerate):

**Tabelas utilizadas:**
- `users` - Usuários e estatísticas
- `submissions` - Entregas de desafios
- `daily_posts` - Histórico de desafios postados
- `godevs_activities` - Cache de atividades do GoDevs

**Não existe mais o arquivo `sorteio.json`!** Tudo está no banco.

---

## ✅ Checklist de Implementação

- [x] Comandos slash de desafios
- [x] Handler de comandos implementado
- [x] Sistema de histórico (Prisma)
- [x] Integração com Supabase GoDevs
- [x] Comando `/entregar`
- [x] Comando `/ranking`
- [x] Comando `/perfil`
- [x] Comando `/atualizar`
- [x] Logs detalhados do cron
- [x] Tratamento de erros melhorado
- [x] Script de registro de comandos
- [ ] **Registrar comandos no Discord** (execute `npm run register`)

---

## 🚀 Próximos Passos

1. **Registre os comandos:**
   ```bash
   npm run register
   ```

2. **Aguarde o deploy no Render** (automático após push)

3. **Teste no Discord:**
   - Digite `/` no canal
   - Os comandos devem aparecer
   - Teste cada um

4. **Verifique os logs do Render:**
   - Deve aparecer: "⏰ Agendador inicializado"
   - Deve aparecer: "✅ Cron job ativo"

5. **Resolva o problema de permissões do canal #desafio**
   - Converta de News Channel para Text Channel
   - Ou dê as permissões corretas

---

## 🎯 Status da Postagem Automática

O cron job está configurado e ativo! Ele vai disparar às **02:40 da manhã** (horário de Brasília) todos os dias.

**Para verificar se está funcionando:**
- Cheque os logs do Render às 02:40
- Ou use `/agenda` para ver o próximo disparo

**Para testar agora:**
- Use `/desafio` para enviar manualmente

---

Dúvidas? Os comandos estão todos comentados no código! 🎉

