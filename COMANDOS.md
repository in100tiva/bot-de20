# 🎯 Comandos Slash Implementados

## ⚡ Como Ativar os Comandos

**IMPORTANTE:** Execute este comando UMA VEZ para registrar os comandos no Discord:

```bash
npm run register
```

Isso vai registrar todos os comandos slash no Discord. Pode levar alguns minutos para aparecerem.

---

## 📋 Comandos Disponíveis

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

## 📊 Arquivo sorteio.json

Estrutura do arquivo que guarda o histórico:

```json
{
  "usados": [1, 3, 5, 7]
}
```

**Localização:** Raiz do projeto (`sorteio.json`)

**Você pode editar manualmente se precisar!**

---

## 🔧 Comandos Legados

O comando `!desafio` ainda funciona para compatibilidade:
- `!desafio` - Desafio aleatório
- `!desafio 5` - Desafio #5

**Mas recomendamos usar os comandos slash (/)!**

---

## ✅ Checklist de Implementação

- [x] Comandos slash criados
- [x] Handler de comandos implementado
- [x] Sistema de histórico (sorteio.json)
- [x] Funções de manipulação do JSON
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

