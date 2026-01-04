export interface RollResult {
    value: number;
    type: 'CRITICO' | 'ALTO' | 'NORMAL' | 'FALHA';
}

// Histórico temporário (limpa se o bot reiniciar)
export const rollHistory: number[] = [];

export const rollDice = (sides: number): RollResult => {
    const value = Math.floor(Math.random() * sides) + 1;
    
    // Adiciona ao início do histórico e mantém apenas os últimos 5
    rollHistory.unshift(value);
    if (rollHistory.length > 5) rollHistory.pop();

    let type: RollResult['type'] = 'NORMAL';
    if (value === 20) type = 'CRITICO';
    else if (value === 1) type = 'FALHA';
    else if (value >= 15) type = 'ALTO';

    return { value, type };
};

export const getVisualData = (result: RollResult) => {
    switch (result.type) {
        case 'CRITICO': 
            return { color: 0xFFD700, title: '🌟 SUCESSO CRÍTICO!', emoji: '🔥' };
        case 'FALHA': 
            return { color: 0xFF0000, title: '💀 FALHA CRÍTICA!', emoji: '⚠️' };
        case 'ALTO': 
            return { color: 0x2ECC71, title: '✅ Ótimo Resultado!', emoji: '✔️' };
        default: 
            return { color: 0x5865F2, title: '🎲 Rolagem de Dado', emoji: '✨' };
    }
};