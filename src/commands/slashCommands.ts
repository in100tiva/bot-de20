import { SlashCommandBuilder } from 'discord.js';

export const commands = [
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
        .setDescription('Mostra informações sobre o agendamento automático')
].map(command => command.toJSON());

