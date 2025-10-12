import { AtributosBase } from '@/app/types';

/**
 * Mapeamento de todas as naturezas do Pokémon RPG.
 * A chave é o nome da Natureza (string).
 * O valor é um objeto que indica o AtributoBase que Aumenta (+1 Saúde, +2 Outros)
 * e o AtributoBase que Diminui (-1 Saúde, -2 Outros).
 * 'null' indica que não há alteração naquele campo.
 */
export const naturezas: { [key: string]: { aumenta: keyof AtributosBase | null, diminui: keyof AtributosBase | null } } = {
  'Neutro': { aumenta: null, diminui: null }, 
  'Comedida': { aumenta: null, diminui: null }, 
  'Chata': { aumenta: null, diminui: null }, 
  'Paciente': { aumenta: null, diminui: null }, 
  'Sensata': { aumenta: null, diminui: null },
  'Estoica': { aumenta: null, diminui: null },

  // Naturezas que aumentam SAÚDE
  'Ousada': { aumenta: 'saude', diminui: 'ataque' },
  'Dócil': { aumenta: 'saude', diminui: 'defesa' },
  'Orgulhosa': { aumenta: 'saude', diminui: 'ataque_especial' },
  'Excêntrica': { aumenta: 'saude', diminui: 'defesa_especial' },
  'Preguiçosa': { aumenta: 'saude', diminui: 'velocidade' },

  // Naturezas que aumentam ATAQUE
  'Desesperada': { aumenta: 'ataque', diminui: 'saude' },
  'Solitária': { aumenta: 'ataque', diminui: 'defesa' },
  'Firme': { aumenta: 'ataque', diminui: 'velocidade' },
  'Travessa': { aumenta: 'ataque', diminui: 'ataque_especial' }, // Originalmente do JS: Brava, mas Travessa é a correta para A.Esp.
  'Brava': { aumenta: 'ataque', diminui: 'defesa_especial' }, 
  'Adamant': { aumenta: 'ataque', diminui: 'ataque_especial' }, // Adicionado o Adamant como exemplo (corresponde a Firme, mas mantido para referência)

  // Naturezas que aumentam DEFESA
  'Rígida': { aumenta: 'defesa', diminui: 'saude' },
  'Arrojada': { aumenta: 'defesa', diminui: 'ataque' },
  'Endiabrada': { aumenta: 'defesa', diminui: 'ataque_especial' },
  'Negligente': { aumenta: 'defesa', diminui: 'defesa_especial' },
  'Relaxada': { aumenta: 'defesa', diminui: 'velocidade' },

  // Naturezas que aumentam ATAQUE ESPECIAL
  'Modesta': { aumenta: 'ataque_especial', diminui: 'ataque' },
  'Amável': { aumenta: 'ataque_especial', diminui: 'defesa' },
  'Imprudente': { aumenta: 'ataque_especial', diminui: 'defesa_especial' },
  'Quieta': { aumenta: 'ataque_especial', diminui: 'velocidade' },
  'Suave': { aumenta: 'ataque_especial', diminui: 'saude' },

  // Naturezas que aumentam DEFESA ESPECIAL
  'Enjoada': { aumenta: 'defesa_especial', diminui: 'saude' },
  'Calma': { aumenta: 'defesa_especial', diminui: 'ataque' },
  'Gentil': { aumenta: 'defesa_especial', diminui: 'defesa' },
  'Cuidadosa': { aumenta: 'defesa_especial', diminui: 'velocidade' },
  'Vaga': { aumenta: 'defesa_especial', diminui: 'ataque_especial' },

  // Naturezas que aumentam VELOCIDADE
  'Apressada': { aumenta: 'velocidade', diminui: 'saude' },
  'Jovial': { aumenta: 'velocidade', diminui: 'ataque' },
  'Aleatória': { aumenta: 'velocidade', diminui: 'defesa' },
  'Tímida': { aumenta: 'velocidade', diminui: 'ataque_especial' },
  'Pressionada': { aumenta: 'velocidade', diminui: 'defesa_especial' },
  'Timid': { aumenta: 'velocidade', diminui: 'ataque' }, // Adicionado Timid como exemplo
};
