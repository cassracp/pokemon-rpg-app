// Caminho sugerido no projeto: src/components/PainelEquipePokemon/PainelEquipePokemon.tsx
'use client';

import React, { useState } from 'react';
// Importa as tipagens core (agora com PokemonBase.tipos definido como TipoElementoNome[])
import { TreinadorFicha, PokemonFicha, PokemonBase, AtributoKey, AtributosBase, TipoElementoNome } from '@/app/types/index';
// Componentes visuais
import BadgeTipo from '@/components/BadgeTipo/BadgeTipo';
// Lógica de cálculo (será usada na próxima fase para calcular status)
// import { calcularStatusPokemon } from '@/utils/calculos'; 

interface PainelEquipePokemonProps {
    ficha: TreinadorFicha;
    onUpdateFicha: (ficha: TreinadorFicha) => void;
}

const PainelEquipePokemon: React.FC<PainelEquipePokemonProps> = ({ ficha, onUpdateFicha }) => {
    // Lista de chaves de atributos para iteração dinâmica
    const atributosKeys: AtributoKey[] = ['saude', 'ataque', 'defesa', 'ataque_especial', 'defesa_especial', 'velocidade'];

    // Cria uma ficha de Pokémon em branco (ou baseada em espécie, que será implementado depois)
    const criarNovaFichaPokemon = (especie: PokemonBase | null = null): PokemonFicha => {
        const id = crypto.randomUUID();

        // Valores padrões para uma ficha "em branco" (preenchimento manual)
        const tiposPadrao: TipoElementoNome[] = ['Normal'];

        // Dados base (usados quando o usuário preenche manualmente)
        const atributos_basais_padrao: AtributosBase = {
            saude: 1, ataque: 1, defesa: 1, ataque_especial: 1, defesa_especial: 1, velocidade: 1
        };

        const basePokemon: PokemonBase = {
            id: especie?.id || 0,
            numero: especie?.numero || '???',
            nome: especie?.nome || 'Pokémon Desconhecido',
            // Corrigido: Agora o tipo está consistente com TipoElementoNome[]
            tipos: especie?.tipos || tiposPadrao, 
            atributos_basais: especie?.atributos_basais || atributos_basais_padrao,
        }

        return {
            id_ficha: id,
            apelido: 'Novo Pokémon',
            natureza: 'Neutro', // Natureza Neutra padrão
            nivel: 1,
            experiencia_atual: 0,
            
            // Usamos a propriedade dados_base completa
            dados_base: basePokemon,
            
            // Pontos alocados pelo jogador (inicialmente zero)
            pontos_disponiveis: 0,
            pontos_aplicados: {
                saude: 5, ataque: 5, defesa: 5, ataque_especial: 5, defesa_especial: 5, velocidade: 5
            },
            hp_maximo: 10,
            hp_atual: 10,
        };
    };

    // Função para adicionar um novo Pokémon à equipe
    const handleAddPokemon = () => {
        if (ficha.equipe_pokemon.length >= 6) {
            console.error("Limite máximo de 6 Pokémons na equipe atingido.");
            // Adicionar um modal ou notificação de erro aqui, em vez de alert()
            return;
        }
        const novoPokemon = criarNovaFichaPokemon();
        onUpdateFicha({ ...ficha, equipe_pokemon: [...ficha.equipe_pokemon, novoPokemon] });
    };

    // Função para remover um Pokémon da equipe
    const handleRemovePokemon = (id: string) => {
        const novaEquipe = ficha.equipe_pokemon.filter(p => p.id_ficha !== id);
        onUpdateFicha({ ...ficha, equipe_pokemon: novaEquipe });
    };

    // Simples função para atualizar um campo no Pokémon
    const handlePokemonChange = (id: string, field: keyof PokemonFicha, value: string | number | PokemonBase | AtributosBase) => {
        const novaEquipe = ficha.equipe_pokemon.map(p => {
            if (p.id_ficha === id) { 
                const updatedPokemon = { ...p };

                // Lógica especial para atributos aninhados (p.pontos_aplicados)
                if (field === 'pontos_aplicados' && typeof value === 'object' && value !== null) {
                    return { ...updatedPokemon, pontos_aplicados: value as AtributosBase };
                }

                // Lógica especial para dados base 
                if (field === 'dados_base' && typeof value === 'object' && value !== null) {
                    return { ...updatedPokemon, dados_base: value as PokemonBase };
                }
                
                // Conversão de valor (apenas se for string, exceto campos de texto)
                const finalValue = (typeof value === 'string' && field !== 'apelido' && field !== 'natureza')
                    ? Number(value) : value;

                // Atualização direta de campo.
                return { ...updatedPokemon, [field]: finalValue };
            }
            return p;
        });
        onUpdateFicha({ ...ficha, equipe_pokemon: novaEquipe });
    };

    // Componente auxiliar para a Ficha individual do Pokémon
    const PokemonCard: React.FC<{ pokemon: PokemonFicha }> = ({ pokemon }) => {
        // const statusCalculado = calcularStatusPokemon(pokemon); // Será implementado na próxima fase

        // Função auxiliar para atualizar pontos_aplicados
        const handlePontoAplicadoChange = (attrKey: AtributoKey, value: number) => {
            const novosPontos = { ...pokemon.pontos_aplicados, [attrKey]: value };
            handlePokemonChange(pokemon.id_ficha, 'pontos_aplicados', novosPontos);
        };

        return (
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                
                {/* Cabeçalho e Dados Básicos */}
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <div className='flex flex-col'>
                         <input
                            type="text"
                            value={pokemon.apelido}
                            onChange={(e) => handlePokemonChange(pokemon.id_ficha, 'apelido', e.target.value)}
                            className="text-xl font-bold text-indigo-700 bg-transparent border-none p-0 focus:ring-0 focus:outline-none"
                            placeholder="Apelido/Nome"
                        />
                        <span className="text-sm text-gray-500">Espécie: {pokemon.dados_base.nome}</span>
                    </div>
                    
                    <button 
                        onClick={() => handleRemovePokemon(pokemon.id_ficha)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full bg-red-50 hover:bg-red-100"
                        title="Remover Pokémon da equipe"
                    >
                        {/* Ícone simples de X */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Linha de Tipos e Nível */}
                <div className='flex justify-between items-center mb-4'>
                    <div className="flex gap-2">
                        {pokemon.dados_base.tipos.map((tipo) => (
                            <BadgeTipo key={tipo} tipoNome={tipo} />
                        ))}
                    </div>
                    
                    <label className='text-sm font-medium text-gray-600 flex items-center gap-2'>
                        Nível:
                        <input
                            type="number"
                            value={pokemon.nivel}
                            min="1"
                            max="100"
                            onChange={(e) => handlePokemonChange(pokemon.id_ficha, 'nivel', e.target.value)}
                            className="w-12 border border-gray-300 rounded-md text-center p-1 text-sm focus:border-indigo-500"
                        />
                    </label>
                </div>

                {/* Seção de Atributos Base e Pontos Alocados */}
                <div className="mt-4">
                    <h4 className="text-md font-semibold mb-2 text-gray-700">Pontos de Atributo (EVs)</h4>
                    <div className="grid grid-cols-5 text-xs font-medium text-gray-500 border-b pb-1">
                        <div className="col-span-2">Atributo</div>
                        <div>Base</div>
                        <div>+ Pts</div>
                        <div>Total</div> {/* Placeholder para o cálculo total */}
                    </div>
                    
                    {atributosKeys.map((key) => (
                        <div key={key} className="grid grid-cols-5 py-1.5 border-b last:border-b-0 items-center">
                            <div className="col-span-2 capitalize font-medium text-gray-800">{key.replace('_', ' ')}</div>
                            
                            {/* Base (fixo, da espécie ou 1) */}
                            <div className="text-center text-sm">
                                {pokemon.dados_base.atributos_basais[key]}
                            </div>

                            {/* Input para Pontos Alocados (EVs) */}
                            <input
                                type="number"
                                value={pokemon.pontos_aplicados[key]}
                                onChange={(e) => handlePontoAplicadoChange(key, Number(e.target.value))}
                                aria-label='Pontos Alocados'
                                min="0"
                                max="200" // Limite de pontos por atributo (Exemplo)
                                className="w-full border rounded-md text-center p-1 text-sm bg-indigo-50/50 focus:border-indigo-500"
                            />

                            {/* Total (Placeholder para o cálculo final) */}
                            <div className="text-center font-bold text-sm text-indigo-600">
                                {/* O cálculo final (Base + Pontos + Nível + Natureza) será exibido aqui */}
                                {pokemon.dados_base.atributos_basais[key] + pokemon.pontos_aplicados[key]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };


    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                Equipe Pokémon ({ficha.equipe_pokemon.length} / 6)
            </h3>

            {/* Painel de Pokémons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {ficha.equipe_pokemon.map(pokemon => (
                    <PokemonCard key={pokemon.id_ficha} pokemon={pokemon} />
                ))}

                {/* Botão Adicionar Pokémon */}
                {ficha.equipe_pokemon.length < 6 && (
                    <div 
                        onClick={handleAddPokemon}
                        className="flex flex-col items-center justify-center p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-600 cursor-pointer hover:border-indigo-500 hover:text-indigo-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                        title="Adicionar Novo Pokémon"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        <span className="mt-2 font-medium">Adicionar Pokémon Manual</span>
                    </div>
                )}
            </div>
            
            {ficha.equipe_pokemon.length === 0 && (
                <div className="text-center p-10 bg-white rounded-lg shadow-md text-gray-500">
                    <p className="text-lg">Sua equipe está vazia. Adicione um Pokémon para começar!</p>
                </div>
            )}
        </div>
    );
};

export default PainelEquipePokemon;
