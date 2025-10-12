// Caminho sugerido no projeto: src/data/tipos.ts

import { TipoElementoNome } from '@/app/types/index';

// Interface que estende TipoElemento, adicionando as propriedades visuais (Cor e Ícone)
export interface TipoElementoVisual {
    nome: TipoElementoNome;
    cor: string; // Código HEX da cor do tipo (ex: '#A8A77A')
    iconePath: string; // Caminho para o arquivo SVG do ícone (simulação do seu 'src/assets/IconsTypes')
}

// Mapeamento completo dos Tipos, Cores e Caminhos dos Ícones
// Nota: Os caminhos abaixo são placeholders baseados na sua estrutura 'src/assets/IconsTypes'.
// No seu projeto Next.js real, você usará importações de SVG ou caminhos para a pasta 'public'.
export const TIPOS_VISUAIS: Record<TipoElementoNome, TipoElementoVisual> = {
    'Normal': {
        nome: 'Normal',
        cor: '#A8A77A',
        iconePath: '/IconsTypes/normal.svg', 
    },
    'Fogo': {
        nome: 'Fogo',
        cor: '#EE8130',
        iconePath: '/IconsTypes/fire.svg',
    },
    'Água': {
        nome: 'Água',
        cor: '#6390F0',
        iconePath: '/IconsTypes/water.svg',
    },
    'Elétrico': {
        nome: 'Elétrico',
        cor: '#F7D02C',
        iconePath: '/IconsTypes/electric.svg',
    },
    'Planta': { // CORRIGIDO: Usando 'Planta' conforme a tipagem anterior
        nome: 'Planta',
        cor: '#7AC74C',
        iconePath: '/IconsTypes/plant.svg',
    },
    'Grama': { // MANTIDO: Caso seu pokedex use 'Grama'
        nome: 'Grama',
        cor: '#7AC74C',
        iconePath: '/IconsTypes/grass.svg',
    },
    'Gelo': {
        nome: 'Gelo',
        cor: '#96D9D6',
        iconePath: '/IconsTypes/ice.svg',
    },
    'Lutador': {
        nome: 'Lutador',
        cor: '#C22E28',
        iconePath: '/IconsTypes/fighting.svg',
    },
    'Venenoso': {
        nome: 'Venenoso',
        cor: '#A33EA1',
        iconePath: '/IconsTypes/poison.svg',
    },
    'Terra': {
        nome: 'Terra',
        cor: '#E2BF65',
        iconePath: '/IconsTypes/ground.svg',
    },
    'Voador': {
        nome: 'Voador',
        cor: '#A98FF3',
        iconePath: '/IconsTypes/flying.svg',
    },
    'Psíquico': {
        nome: 'Psíquico',
        cor: '#F95587',
        iconePath: '/IconsTypes/psychic.svg',
    },
    'Inseto': {
        nome: 'Inseto',
        cor: '#A6B91A',
        iconePath: '/IconsTypes/bug.svg',
    },
    'Rocha': {
        nome: 'Rocha',
        cor: '#B6A136',
        iconePath: '/IconsTypes/rock.svg',
    },
    'Fantasma': {
        nome: 'Fantasma',
        cor: '#735797',
        iconePath: '/IconsTypes/ghost.svg',
    },
    'Dragão': {
        nome: 'Dragão',
        cor: '#6F35FC',
        iconePath: '/IconsTypes/dragon.svg',
    },
    'Aço': {
        nome: 'Aço',
        cor: '#B7B7CE',
        iconePath: '/IconsTypes/steel.svg',
    },
    'Fada': {
        nome: 'Fada',
        cor: '#D685AD',
        iconePath: '/IconsTypes/fairy.svg',
    },
    'Sombrio': {
        nome: 'Sombrio',
        cor: '#705746',
        iconePath: '/IconsTypes/dark.svg',
    },
};

/**
 * Função utilitária para obter os dados visuais de um TipoElemento
 * @param nome O nome literal do tipo (ex: 'Fogo')
 * @returns Os dados visuais do tipo (cor, íconePath)
 */
export const getTipoVisual = (nome: TipoElementoNome): TipoElementoVisual => {
    return TIPOS_VISUAIS[nome] || TIPOS_VISUAIS['Normal'];
};
