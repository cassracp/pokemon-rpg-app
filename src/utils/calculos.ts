

import { TreinadorFicha, AtributosBase, AtributosCalculados, AtributoKey, PokemonBase, PokemonFicha } from '@/app/types/index';
import { naturezas } from '@/data/naturezas'; 

// ====================================================================
// CONSTANTES E DADOS DO JOGO (Movidos de calculos.js)
// ====================================================================

// Tabela de Experiência (Ponto de Corte de Nível - Total de Exp. Necessária)
export const tabelaExperiencia: number[] = [
  0, 0, 25, 50, 100, 150, 200, 400, 600, 800, 1000, 
  1500, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 
  11500, 13000, 14500, 16000, 17500, 19000, 20500, 22000, 23500, 25000, 
  27500, 30000, 32500, 35000, 37500, 40000, 42500, 45000, 47500, 50000, 
  55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 
  110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000, 
  210000, 220000, 230000, 240000, 250000, 260000, 270000, 280000, 290000, 300000, 
  310000, 320000, 330000, 340000, 350000, 360000, 370000, 380000, 390000, 400000, 
  410000, 420000, 430000, 440000, 450000, 460000, 470000, 480000, 490000, 500000, 
  510000, 520000, 530000, 540000, 550000, 560000, 570000, 580000, 590000, 600000
];


// ====================================================================
// FUNÇÕES DE UTILIDADE E CÁLCULO DE POKÉMON
// ====================================================================

/**
 * Tipo de retorno para os resultados detalhados do status de um Pokémon.
 */
export interface PokemonStatusCalculado {
    hp_maximo: number;
    // Resultados de Atributos com Fases e Extra
    atributos_de_combate: { 
        [key in Exclude<AtributoKey, 'saude'>]: { total: number, fases: number, extra: number } 
    };
    // Outros resultados (Evasão, Deslocamento, Bônus Elemental, etc. - a serem adicionados depois)
}

/**
 * Obtém os atributos base puros de um Pokémon Base (da Pokedex).
 * @param pokemonBase Dados estáticos do Pokémon.
 * @returns Um objeto AtributosBase.
 */
export const getAtributosBasePuros = (pokemonBase: PokemonBase): AtributosBase => {
  // Nota: O seu JS tinha uma função getBaseStat para lidar com estrutura aninhada, 
  // mas aqui assumimos que PokemonBase já tem AtributosBase diretamente.
  return pokemonBase.atributos_basais || { saude: 0, ataque: 0, defesa: 0, ataque_especial: 0, defesa_especial: 0, velocidade: 0 };
};

/**
 * Calcula todos os status de combate de um Pokémon (HP, Atributos Finais, Evasão, etc.).
 * Esta é uma implementação parcial, focada em resolver o erro de tipagem.
 * @param pokemon Ficha completa do Pokémon com dados base e pontos aplicados.
 */
export function calcularStatusPokemon(pokemon: PokemonFicha): PokemonStatusCalculado {
    
    // Simulação da lógica de cálculo (Para fins de tipagem, vamos inicializar o objeto de combate)
    const atributosCombate: AtributosBase = {
        saude: pokemon.dados_base.atributos_basais.saude + pokemon.pontos_aplicados.saude,
        ataque: pokemon.dados_base.atributos_basais.ataque + pokemon.pontos_aplicados.ataque,
        defesa: pokemon.dados_base.atributos_basais.defesa + pokemon.pontos_aplicados.defesa,
        ataque_especial: pokemon.dados_base.atributos_basais.ataque_especial + pokemon.pontos_aplicados.ataque_especial,
        defesa_especial: pokemon.dados_base.atributos_basais.defesa_especial + pokemon.pontos_aplicados.defesa_especial,
        velocidade: pokemon.dados_base.atributos_basais.velocidade + pokemon.pontos_aplicados.velocidade,
    };
    
    // Inicialização segura e tipada para evitar 'as any' e 'any'
    const resultadosCombate: PokemonStatusCalculado['atributos_de_combate'] = {
        ataque: { total: 0, fases: 0, extra: 0 },
        defesa: { total: 0, fases: 0, extra: 0 },
        ataque_especial: { total: 0, fases: 0, extra: 0 },
        defesa_especial: { total: 0, fases: 0, extra: 0 },
        velocidade: { total: 0, fases: 0, extra: 0 },
    };
    
    // Iterar sobre os atributos de combate (exceto Saúde)
    // Usamos um array de chaves do tipo correto, excluindo 'saude'
    const atributosCombateKeys: Exclude<AtributoKey, 'saude'>[] = ['ataque', 'defesa', 'ataque_especial', 'defesa_especial', 'velocidade'];

    atributosCombateKeys
        .forEach(key => {
            const total = atributosCombate[key];
            resultadosCombate[key] = {
                total,
                fases: Math.floor(total / 10),
                extra: total % 10,
            };
        });
        
    // Cálculo do HP (simplificado)
    const hp_maximo = (atributosCombate.saude * 2) + 10;

    return {
        hp_maximo: hp_maximo,
        atributos_de_combate: resultadosCombate,
    };
}

// ====================================================================
// FUNÇÕES DE CÁLCULO DE TREINADOR
// ====================================================================

/**
 * Calcula o total de pontos alocados pelo Treinador em todos os atributos.
 * @param pontosAlocados Objeto AtributosBase com os pontos investidos.
 * @returns O somatório total dos pontos.
 */
export function calculateTotalPoints(pontosAlocados: AtributosBase): number {
    return (
        pontosAlocados.saude +
        pontosAlocados.ataque +
        pontosAlocados.defesa +
        pontosAlocados.ataque_especial +
        pontosAlocados.defesa_especial +
        pontosAlocados.velocidade
    );
}

/**
 * Calcula os Atributos Totais, Modificadores e Fases do Treinador.
 * (Baseado na Ficha Treinador 3.0)
 * @param ficha Ficha completa do treinador.
 * @returns Objeto com resultados de Total, Modificador e Fases para cada atributo.
 */
export function calcularStatusTreinador(ficha: TreinadorFicha) {
    const atributos: AtributoKey[] = ['saude', 'ataque', 'defesa', 'ataque_especial', 'defesa_especial', 'velocidade'];

    const resultados: {
        total: AtributosBase;
        modificador: AtributosBase;
        fases: AtributosBase;
    } = {
        total: { saude: 0, ataque: 0, defesa: 0, ataque_especial: 0, defesa_especial: 0, velocidade: 0 },
        modificador: { saude: 0, ataque: 0, defesa: 0, ataque_especial: 0, defesa_especial: 0, velocidade: 0 },
        fases: { saude: 0, ataque: 0, defesa: 0, ataque_especial: 0, defesa_especial: 0, velocidade: 0 },
    };

    atributos.forEach(key => {
        // [Basal] + [Pontos Alocados]
        const total = ficha.atributos_basais[key] + ficha.pontos_alocados[key];
        resultados.total[key] = total;

        // Modificador = floor(Total / 2) - 5
        const modificador = Math.floor(total / 2) - 5;
        resultados.modificador[key] = modificador;

        // Fases = floor(Modificador / 2)
        const fases = Math.floor(modificador / 2);
        resultados.fases[key] = fases;
    });

    return resultados;
}