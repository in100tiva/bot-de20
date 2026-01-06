import { SlashCommandBuilder } from 'discord.js';

export const commands = [
    // === COMANDOS DE DESAFIOS ===
    new SlashCommandBuilder()
        .setName('desafio')
        .setDescription('Envia um desafio manualmente para o canal')
        .addIntegerOption(option =>
            option
                .setName('id')
                .setDescription('ID específico do desafio (opcional)')
                .setRequired(false)
        ),
    
    new SlashCommandBuilder()
        .setName('status')
        .setDescription('Mostra os desafios já enviados'),
    
    new SlashCommandBuilder()
        .setName('adicionar')
        .setDescription('Adiciona um ID de desafio ao histórico de enviados')
        .addIntegerOption(option =>
            option
                .setName('id')
                .setDescription('ID do desafio para marcar como enviado')
                .setRequired(true)
        ),
    
    new SlashCommandBuilder()
        .setName('limpar')
        .setDescription('Limpa o histórico de desafios enviados (CUIDADO!)'),
    
    new SlashCommandBuilder()
        .setName('agenda')
        .setDescription('Mostra informações sobre o agendamento automático'),

    // === COMANDOS DE GAMIFICAÇÃO ===
    new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('Mostra o top 10 usuários com mais pontos'),
    
    new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Mostra estatísticas completas: desafios + atividades GoDevs')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuário para ver o perfil (opcional, padrão: você)')
                .setRequired(false)
        ),
    
    new SlashCommandBuilder()
        .setName('atualizar')
        .setDescription('Sincroniza suas atividades do GoDevs com o bot')
].map(command => command.toJSON());

