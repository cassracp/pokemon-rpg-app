// Caminho sugerido no projeto: src/data/pokedex.ts
import { PokemonBase } from '@/app/types/index';

// Usando o seu conteúdo original de pokedex.js (remodelado para TS)
export const pokedex: PokemonBase[] = [
  {
    "id": 1,
    "numero": "001",
    "nome": "Bulbassauro",
    "tipo": ["Planta", "Venenoso"], // Exemplo baseado no Livro dos Pokemons
    "atributos_basais": {
      "saude": 5,
      "ataque": 5,
      "defesa": 5,
      "ataque_especial": 7,
      "defesa_especial": 7,
      "velocidade": 5
    },
    // Nota: O restante dos dados (habilidades, evolução, golpes)
    // foi omitido aqui para manter o arquivo conciso, mas você pode importá-los
    // do seu pokedex.js original e tipá-los conforme as interfaces da Fase 1.

    // Apenas a estrutura mínima para PokemonBase está inclusa:
    habilidades: { basicas: ["Clorofila"], altas: ["Presente das Flores"] },
    evolucao: [],
    medidas: {
      tamanho: { categoria: 'Pequeno', valor_m: 0.7 },
      categoria_peso: { categoria: 'Muito Leve', valor_kg: 6.9 }
    },
    golpes_por_nivel: [], 
  },
  {
    "id": 2,
    "numero": "002",
    "nome": "Ivyssauro",
    "tipo": ["Planta", "Venenoso"], 
    "atributos_basais": {
      "saude": 6,
      "ataque": 6,
      "defesa": 6,
      "ataque_especial": 8,
      "defesa_especial": 8,
      "velocidade": 6
    },
    habilidades: { basicas: ["Clorofila"], altas: ["Presente das Flores"] },
    evolucao: [],
    medidas: {
        tamanho: { categoria: 'Pequeno', valor_m: 1.0 },
        categoria_peso: { categoria: 'Leve', valor_kg: 13.0 }
    },
    golpes_por_nivel: [], 
  },
  {
    "id": 3,
    "numero": "003",
    "nome": "Venussauro",
    "tipo": ["Planta", "Venenoso"], 
    "atributos_basais": {
      "saude": 8,
      "ataque": 7,
      "defesa": 8,
      "ataque_especial": 10,
      "defesa_especial": 10,
      "velocidade": 8
    },
    habilidades: { basicas: ["Clorofila"], altas: ["Presente das Flores"] },
    evolucao: [],
    medidas: {
        tamanho: { categoria: 'Médio', valor_m: 2.0 },
        categoria_peso: { categoria: 'Normal', valor_kg: 100.0 }
    },
    golpes_por_nivel: [], 
  },
  // ... adicione o restante da sua Pokedex aqui
  {
    "id": 4,
    "numero": "004",
    "nome": "Charmander",
    "tipo": ["Fogo"],
    "atributos_basais": {
      "saude": 4, "ataque": 6, "defesa": 4, "ataque_especial": 6, "defesa_especial": 5, "velocidade": 7
    },
    habilidades: { basicas: ["Chama"], altas: ["Poder Solar"] },
    evolucao: [], medidas: { tamanho: { categoria: 'Pequeno', valor_m: 0.6 }, categoria_peso: { categoria: 'Muito Leve', valor_kg: 8.5 } }, golpes_por_nivel: [],
  },
];

/**
 * Função utilitária para buscar um Pokémon pelo nome.
 * @param nome O nome do Pokémon (não case sensitive).
 * @returns Os dados base do Pokémon ou undefined.
 */
export const getPokemonBaseByName = (nome: string): PokemonBase | undefined => {
    return pokedex.find(p => p.nome.toLowerCase() === nome.toLowerCase());
};
