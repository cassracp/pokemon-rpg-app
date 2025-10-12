// Caminho sugerido no projeto: src/components/FichaTreinador/FichaTreinador.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TreinadorFicha, FICHA_TREINADOR_INICIAL, AtributoKey, PericiaPersonalizada } from '@/app/types/index';
import { calcularStatusTreinador, calculateTotalPoints } from '@/utils/calculos';
import PainelEquipePokemon from '@/components/PainelEquipePokemon/PainelEquipePokemon';
import debounce from 'lodash-es/debounce'; // Assumindo que lodash está instalado ou será instalado

interface FichaTreinadorProps {
    initialFicha: TreinadorFicha;
    onSave: (ficha: TreinadorFicha) => void;
}

// ----------------------------------------------------------------------
// Treinador Componente
// ----------------------------------------------------------------------

const FichaTreinador: React.FC<FichaTreinadorProps> = ({ initialFicha, onSave }) => {
    const [ficha, setFicha] = useState<TreinadorFicha>(initialFicha);
    const [saved, setSaved] = useState(true);
    const [activeTab, setActiveTab] = useState<'treinador' | 'equipe'>('treinador');

    // Estado para a criação de nova perícia personalizada
    const [novaPericia, setNovaPericia] = useState<Omit<PericiaPersonalizada, 'id' | 'rank'>>({
        nome: '',
        atributo_base: 'saude', // Default para evitar erro de inicialização
    });

    // Calcula os atributos totais, modificadores e fases em tempo real
    const atributosCalculados = useMemo(() => calcularStatusTreinador(ficha), [ficha]);
    const pontosGastos = calculateTotalPoints(ficha.pontos_alocados);
    
    // ----------------------------------------------------------------------
    // Lógica de Persistência (Debounce)
    // ----------------------------------------------------------------------
    
    // Função debounce para salvar automaticamente após 1 segundo de inatividade
    const debouncedSave = useCallback(
        debounce((currentFicha: TreinadorFicha) => {
            onSave(currentFicha);
            setSaved(true);
        }, 1000),
        [onSave]
    );

    // Efeito para chamar o debounce sempre que a ficha mudar (e não estiver sendo salva)
    useEffect(() => {
        if (!saved) {
            debouncedSave(ficha);
            // Cleanup function para cancelar o timer ao desmontar ou antes de um novo call
            return () => debouncedSave.cancel();
        }
    }, [ficha, saved, debouncedSave]);

    // Atualiza a ficha interna quando a ficha inicial muda (ex: o hub seleciona outro treinador)
    useEffect(() => {
        setFicha(initialFicha);
        setSaved(true);
    }, [initialFicha]);


    // ----------------------------------------------------------------------
    // Handlers
    // ----------------------------------------------------------------------
    
    // Handler genérico para campos de string (Nome, Jogador, Sexo, etc.)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFicha(prev => ({
            ...prev,
            [name]: value
        }));
        setSaved(false);
    };

    // Handler para alocação de pontos (Atributos)
    const handleAlocarPonto = (key: AtributoKey, value: number) => {
        const oldValue = ficha.pontos_alocados[key];
        const newPontosAlocados = { ...ficha.pontos_alocados, [key]: value };
        const newPontosGastos = calculateTotalPoints(newPontosAlocados);

        // Verifica se o novo gasto total excede o limite (pontos_totais)
        if (newPontosGastos > ficha.pontos_totais) {
            // Se exceder, reverte a mudança para o valor máximo permitido
            const excesso = newPontosGastos - ficha.pontos_totais;
            const valorCorrigido = value - excesso;
            
            if (valorCorrigido >= 0) {
                const finalPontosAlocados = { ...ficha.pontos_alocados, [key]: valorCorrigido };
                setFicha(prev => ({
                    ...prev,
                    pontos_alocados: finalPontosAlocados,
                    pontos_atuais: ficha.pontos_totais - calculateTotalPoints(finalPontosAlocados)
                }));
            }
            return;
        }

        setFicha(prev => ({
            ...prev,
            pontos_alocados: newPontosAlocados,
            pontos_atuais: ficha.pontos_totais - newPontosGastos
        }));
        setSaved(false);
    };

    // Handler para Perícias Fixas
    const handleUpdatePericiaFixedChange = (pericia: keyof TreinadorFicha['pericias_fixas'], value: number) => {
        setFicha(prev => ({
            ...prev,
            pericias_fixas: {
                ...prev.pericias_fixas,
                [pericia]: value,
            },
        }));
        setSaved(false);
    };

    // Lógica para Perícias Personalizadas
    const handleNovaPericiaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // O campo atributo_base precisa ser tipado como AtributoKey
        if (name === 'atributo_base') {
            setNovaPericia(prev => ({
                ...prev,
                atributo_base: value as AtributoKey, // Tipagem explícita aqui
            }));
        } else {
            setNovaPericia(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAddPericiaPersonalizada = () => {
        if (!novaPericia.nome.trim()) return;

        const newPericia: PericiaPersonalizada = {
            id: crypto.randomUUID(),
            nome: novaPericia.nome.trim(),
            atributo_base: novaPericia.atributo_base,
            rank: 1, // Começa com Rank 1
        };

        setFicha(prev => ({
            ...prev,
            pericias_personalizadas: [...prev.pericias_personalizadas, newPericia]
        }));
        setNovaPericia({ nome: '', atributo_base: 'saude' }); // Reseta o formulário
        setSaved(false);
    };

    const handlePericiaPersonalizadaRankChange = (id: string, newRank: number) => {
        setFicha(prevFicha => {
            const updatedPericias = prevFicha.pericias_personalizadas.map(p => 
                p.id === id ? { ...p, rank: newRank } : p
            );
            setSaved(false);
            return { ...prevFicha, pericias_personalizadas: updatedPericias };
        });
    };

    const handleDeletePericiaPersonalizada = (id: string) => {
        const updatedPericias = ficha.pericias_personalizadas.filter(p => p.id !== id);
        setFicha(prevFicha => ({ ...prevFicha, pericias_personalizadas: updatedPericias }));
        setSaved(false);
    };

    // ----------------------------------------------------------------------
    // Renderização
    // ----------------------------------------------------------------------

    return (
        <div className="mx-auto max-w-5xl bg-white shadow-2xl rounded-xl mt-4">
            {/* Cabeçalho e Abas */}
            <header className="p-6 pb-0 border-b border-gray-200">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                    Ficha de Treinador: {ficha.nome || 'Novo Personagem'}
                </h1>
                <div className="flex justify-between items-end">
                    <nav className="flex space-x-2">
                        <TabButton name="treinador" activeTab={activeTab} onClick={setActiveTab}>
                            Treinador
                        </TabButton>
                        <TabButton name="equipe" activeTab={activeTab} onClick={setActiveTab}>
                            Equipe Pokémon ({ficha.equipe_pokemon.length})
                        </TabButton>
                    </nav>
                    <div className={`text-sm font-medium ${saved ? 'text-green-600' : 'text-yellow-600'}`}>
                        {saved ? 'Salvo' : 'Salvando...'}
                    </div>
                </div>
            </header>

            <main className="p-6">
                {activeTab === 'treinador' && (
                    <div className="space-y-8">
                        {/* SEÇÃO 1: DADOS PESSOAIS */}
                        <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-semibold text-indigo-700 mb-4">Dados Pessoais</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <InputField label="Nome" name="nome" value={ficha.nome} onChange={handleChange} type="text" />
                                <InputField label="Jogador" name="jogador" value={ficha.jogador} onChange={handleChange} type="text" />
                                <InputField label="Nível" name="nivel" value={ficha.nivel} onChange={handleChange} type="number" min="0" />
                                <InputField label="Idade" name="idade" value={ficha.idade} onChange={handleChange} type="number" min="10" />
                                <InputField label="Sexo" name="sexo" value={ficha.sexo} onChange={handleChange} type="text" />
                                <InputField label="Altura" name="altura" value={ficha.altura} onChange={handleChange} type="text" />
                                <InputField label="Peso" name="peso" value={ficha.peso} onChange={handleChange} type="text" />
                                <InputField label="Origem" name="origem" value={ficha.origem} onChange={handleChange} type="text" />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Classes (Separadas por vírgula)</label>
                                <input
                                    type="text"
                                    value={ficha.classes.join(', ')}
                                    onChange={(e) => setFicha(prev => ({ ...prev, classes: e.target.value.split(',').map(c => c.trim()).filter(c => c) }))}
                                    aria-label='Classes'
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </section>

                        {/* SEÇÃO 2: ATRIBUTOS */}
                        <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-semibold text-indigo-700 mb-4">
                                Atributos Principais 
                                <span className="ml-3 text-sm font-medium text-gray-600">
                                    Pontos Livres: {ficha.pontos_atuais - pontosGastos} / {ficha.pontos_totais}
                                </span>
                            </h2>
                            <div className="grid grid-cols-6 text-sm font-medium text-gray-600 border-b border-indigo-300 bg-indigo-100/50 rounded-t-lg">
                                <div className="p-2 col-span-2">Atributo</div>
                                <div className="p-2 text-center">Basal</div>
                                <div className="p-2 text-center">Alocado (+)</div>
                                <div className="p-2 text-center">Total (=)</div>
                                <div className="p-2 text-center">Fases</div>
                            </div>
                            
                            {/* Mapeando os atributos */}
                            {(Object.keys(ficha.atributos_basais) as Array<AtributoKey>).map(key => (
                                <div key={key} className="grid grid-cols-6 border-b border-gray-200 hover:bg-white">
                                    <div className="p-2 col-span-2 capitalize font-medium text-gray-800">{key.replace('_', ' ')}</div>
                                    <div className="p-2 text-center">{ficha.atributos_basais[key]}</div>
                                    <div className="p-2 flex justify-center">
                                        {/* Input para Pontos Alocados */}
                                        <input type="number" 
                                            name={key}
                                            min="0"
                                            max={ficha.pontos_alocados[key] + (ficha.pontos_atuais - pontosGastos)} // Máximo é o que já tem + o que sobrou
                                            value={ficha.pontos_alocados[key]} 
                                            // Tipagem explícita no evento de onChange para evitar o erro 'any'
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAlocarPonto(key, e.target.valueAsNumber || 0)}
                                            aria-label='Pontos Alocados'
                                            className="w-16 border rounded-md text-center bg-gray-50"
                                        />
                                    </div>
                                    <div className="p-2 text-center font-bold text-indigo-600">{atributosCalculados.total[key]}</div>
                                    <div className="p-2 text-center text-gray-500">{atributosCalculados.fases[key]}</div>
                                </div>
                            ))}
                        </section>

                        {/* SEÇÃO 3: PERÍCIAS */}
                        <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-semibold text-indigo-700 mb-4">Perícias Fixas</h2>
                            <div className="grid grid-cols-4 text-sm font-medium text-gray-600 border-b border-indigo-300 bg-indigo-100/50 rounded-t-lg">
                                <div className="p-2">Perícia</div>
                                <div className="p-2 text-center">Rank</div>
                                <div className="p-2">Atributo Base</div>
                                <div className="p-2 text-center">Total (Rank + Atributo)</div>
                            </div>
                            
                            {/* Mapeando Perícias Fixas */}
                            {(Object.keys(ficha.pericias_fixas) as Array<keyof TreinadorFicha['pericias_fixas']>).map(key => (
                                <div key={key} className="grid grid-cols-4 border-b border-gray-200 hover:bg-white text-sm">
                                    <div className="p-2 capitalize text-gray-800">{key}</div>
                                    <div className="p-2 flex justify-center">
                                        <input type="number"
                                            min="0"
                                            value={ficha.pericias_fixas[key]}
                                            // Tipagem explícita no evento de onChange
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdatePericiaFixedChange(key, e.target.valueAsNumber || 0)}
                                            aria-label='Perícias'
                                            className="w-10 border rounded-md text-center"
                                        />
                                    </div>
                                    {/* Mapeamento de Perícia para Atributo Base (A ser implementado com uma tabela de regras) */}
                                    <div className="p-2 text-gray-500">?</div>
                                    <div className="p-2 text-center font-bold text-gray-700">?</div>
                                </div>
                            ))}

                            <h2 className="text-xl font-semibold text-indigo-700 mt-8 mb-4">Perícias Personalizadas</h2>
                            
                            {/* Formulário de Adição */}
                            <div className="flex space-x-2 mb-4 p-3 bg-white rounded-lg border">
                                <input
                                    type="text"
                                    name="nome"
                                    placeholder="Nome da Perícia (Ex: Treinamento Avançado)"
                                    value={novaPericia.nome}
                                    onChange={handleNovaPericiaChange}
                                    className="flex-grow border border-gray-300 rounded-md p-2"
                                />
                                <select
                                    name="atributo_base"
                                    aria-label='Atributo Base'
                                    value={novaPericia.atributo_base}
                                    onChange={handleNovaPericiaChange}
                                    className="border border-gray-300 rounded-md p-2"
                                >
                                    {(Object.keys(ficha.atributos_basais) as Array<AtributoKey>).map(key => (
                                        <option key={key} value={key}>{key.replace('_', ' ')}</option>
                                    ))}
                                </select>
                                <button onClick={handleAddPericiaPersonalizada} 
                                        className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition">
                                    Adicionar
                                </button>
                            </div>
                            
                            {/* Lista de Perícias Personalizadas */}
                            {ficha.pericias_personalizadas.map(pericia => (
                                <div key={pericia.id} className="grid grid-cols-4 border-b border-gray-200 hover:bg-white text-sm">
                                    <div className="p-2 capitalize text-gray-800">{pericia.nome}</div>
                                    <div className="p-2 flex justify-center">
                                        <input type="number"
                                            min="0"
                                            value={pericia.rank}
                                            // Tipagem explícita no evento de onChange
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePericiaPersonalizadaRankChange(pericia.id, e.target.valueAsNumber || 0)}
                                            aria-label='Perícia Personalizada'
                                            className="w-10 border rounded-md text-center"
                                        />
                                    </div>
                                    <div className="p-2 text-gray-500 capitalize">{pericia.atributo_base.replace('_', ' ')}</div>
                                    <div className="p-2 text-center font-bold text-gray-700 flex justify-center items-center">
                                        {/* Total = Rank + Atributo Total */}
                                        {pericia.rank + atributosCalculados.total[pericia.atributo_base]}
                                        <button onClick={() => handleDeletePericiaPersonalizada(pericia.id)} className="ml-4 text-red-400 hover:text-red-600">
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>
                )}
                
                {activeTab === 'equipe' && (
                    <PainelEquipePokemon ficha={ficha} onUpdateFicha={setFicha} />
                )}
            </main>
        </div>
    );
};

export default FichaTreinador;

// ----------------------------------------------------------------------
// Componentes Auxiliares
// ----------------------------------------------------------------------

interface InputFieldProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    type: 'text' | 'number';
    min?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type, min }) => (
    <label className="block">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <input 
            type={type} 
            name={name} 
            value={value} 
            onChange={onChange}
            min={min}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500" 
        />
    </label>
);

interface TabButtonProps {
    name: string;
    activeTab: 'treinador' | 'equipe';
    onClick: (tab: 'treinador' | 'equipe') => void;
    children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ name, activeTab, onClick, children }) => {
    const isActive = activeTab === name;
    return (
        <button
            onClick={() => onClick(name as 'treinador' | 'equipe')}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors duration-150 ${
                isActive 
                    ? 'bg-white text-indigo-600 border-t border-x border-gray-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
            {children}
        </button>
    );
};
