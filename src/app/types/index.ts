// Caminho sugerido no projeto: src/types/index.ts

// ----------------------------------------------------
// TIPOS CORE
// ----------------------------------------------------

// Tipo para as 6 chaves de Atributos: Saúde, Ataque, Defesa, etc.
export type AtributoKey = 'saude' | 'ataque' | 'defesa' | 'ataque_especial' | 'defesa_especial' | 'velocidade';

// Tipos Literais para Elementos (Baseado nos livros de regras)
export type TipoElementoNome = 
    'Normal' | 'Fogo' | 'Água' | 'Grama' | 'Elétrico' | 'Gelo' |
    'Lutador' | 'Venenoso' | 'Terra' | 'Voador' | 'Psíquico' | 
    'Inseto' | 'Rocha' | 'Fantasma' | 'Dragão' | 'Aço' | 'Fada' | 
    'Sombrio' | 'Planta';

// IMPORTANTE: Esta interface não deve ser usada para o atributo 'tipos' do Pokémon,
// pois o Pokémon armazena apenas o NOME do tipo.
export interface TipoElemento {
    nome: TipoElementoNome;
    icone: string; // Ex: '🔥' para Fogo, '🍃' para Grama/Planta
}

// ----------------------------------------------------
// ESTRUTURAS DE ATRIBUTOS
// ----------------------------------------------------

// Valores de Atributos (usado em Treinador, Pokémon Base e Pontos Aplicados)
export interface AtributosBase {
    saude: number;
    ataque: number;
    defesa: number;
    ataque_especial: number;
    defesa_especial: number;
    velocidade: number;
}

// Resultados calculados dos atributos do Treinador
export interface AtributosCalculados extends AtributosBase {
    modificador: number; // Mod. (Treinador)
    fases: number;
    total: number;
}

// ----------------------------------------------------
// POKÉMON - DEFINIÇÕES DA POKEDEX (Base de Dados)
// ----------------------------------------------------

export interface GolpesPorNivel {
    nivel: number;
    nome: string;
}

export interface Habilidade {
    basicas: string[];
    altas: string[];
}

export interface Evolucao {
    nivel: number;
    para: string;
    item: string;
    condicao: string;
    descricao_evolucao: string;
}

export interface Medida {
    tamanho: {
        categoria: string;
        valor_m: number;
    };
    categoria_peso: {
        categoria: string;
        valor_kg: number;
    };
}

// O Pokémon como definido na Pokedex (dados imutáveis da espécie)
export interface PokemonBase {
    id: number;
    numero: string;
    nome: string;
    tipos: TipoElementoNome[];
    atributos_basais: AtributosBase; 
    habilidades?: Habilidade;
    evolucao?: Evolucao[];
    medidas?: Medida;
    golpes_por_nivel?: GolpesPorNivel[];
    // Adicionar outros campos conforme necessário (Procriação, etc.)
}

// ----------------------------------------------------
// POKÉMON - FICHA DO JOGADOR (Dados Mutáveis)
// ----------------------------------------------------

export interface Deslocamentos {
    terrestre?: number;
    natacao?: number;
    voo?: number;
    escavacao?: number;
    subaquatico: number;
}

export interface Evasoes {
    fisica: number;
    especial: number;
    veloz: number;
}

export interface GolpeAtivo {
    nome: string;
    usos: number; // Ex: 5/5
    tipo: TipoElemento;
}

export interface PokemonFicha {
    id_ficha: string; // ID único para a instância na equipe
    pokedex_id?: number; // Referência à entrada da pokedex
    apelido?: string;
    natureza?: string;
    nivel?: number;
    experiencia_atual?: number;
    
    // Referência aos dados da Pokedex (será preenchido na seleção)
    dados_base: PokemonBase;
    
    // Status do combate (dinâmico)
    hp_atual: number;
    hp_maximo: number;
    
    // Pontos de Atributos/EVs aplicados pelo jogador
    pontos_disponiveis: number;
    pontos_aplicados: AtributosBase; 
    
    // Detalhes em combate
    golpes_ativos?: GolpeAtivo[];
    deslocamentos?: Deslocamentos;
    evasoes?: Evasoes;
    
    // Propriedades calculadas podem ser adicionadas aqui se não forem calculadas em tempo real
}

// ----------------------------------------------------
// TREINADOR - FICHA DO JOGADOR (Dados Mutáveis)
// ----------------------------------------------------

export interface PericiaPersonalizada {
    id: string;
    nome: string;
    atributo_base: AtributoKey; // O atributo que define a perícia (saude, ataque, etc.)
    rank: number; // Nível/Rank da perícia
}

export interface TreinadorFicha {
    id: string; // Para identificar o Treinador no "hub"
    nome: string;
    jogador: string;
    nivel: number;
    // Dados Pessoais
    idade: number;
    sexo: string;
    altura: string;
    peso: string;
    origem: string;
    classes: string[]; // Classes: [Guardião, Cozinheiro, etc.]
    
    // Pontos e Atributos
    pontos_atuais: number; // Ex: 60 (do 60/66)
    pontos_totais: number; // Ex: 66
    atributos_basais: AtributosBase; // Geralmente todos 10
    pontos_alocados: AtributosBase; // Pontos do jogador
    
    // Saúde
    hp_maximo: number; 
    hp_atual: number; 

    // Perícias: Mapeamos dinamicamente as perícias
    pericias_fixas: {
        [key: string]: number; // Ex: { "Acrobacia": 0, "Apneia": 0 }
    }
    pericias_personalizadas: PericiaPersonalizada[];
    
    // A Equipe de Pokémon (máximo de 6)
    equipe_pokemon: PokemonFicha[];
}

// ----------------------------------------------------
// VALORES INICIAIS
// ----------------------------------------------------

const PERICIAS_INICIAIS: TreinadorFicha['pericias_fixas'] = {
    "Acrobacia": 0, "Apneia": 0, "Concentração": 0, "Corrida": 0, 
    "Deflexão": 0, "Empatia": 0, "Engenharia": 0, "Força": 0, 
    "Furtividade": 0, "História": 0, "Imunidade": 0, "Incansável": 0,
    // ADICIONE O RESTANTE DAS PERÍCIAS FIXAS AQUI
};

export const FICHA_TREINADOR_INICIAL: TreinadorFicha = {
    id: 'novo-treinador',
    nome: '',
    jogador: '',
    nivel: 0,
    idade: 10, 
    sexo: '',
    altura: '',
    peso: '',
    origem: '',
    classes: [],
    pontos_atuais: 60,
    pontos_totais: 66,
    atributos_basais: {
        saude: 10, ataque: 10, defesa: 10, ataque_especial: 10, defesa_especial: 10, velocidade: 10
    },
    pontos_alocados: {
        saude: 0, ataque: 0, defesa: 0, ataque_especial: 0, defesa_especial: 0, velocidade: 0
    },
    hp_maximo: 10,
    hp_atual: 10,
    pericias_fixas: PERICIAS_INICIAIS,
    pericias_personalizadas: [],
    equipe_pokemon: [],
};
