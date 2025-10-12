'use client';

import React, { useState, useEffect } from 'react';
import { TreinadorFicha, FICHA_TREINADOR_INICIAL } from './types';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// COMPONENTES
import Login from '@/components/Auth/Login';
import FichaTreinador from '@/components/FichaTreinador/FichaTreinador';

const TreinadorHub: React.FC = () => {
    // 1. Estados do Aplicativo
    const [db, setDb] = useState<Firestore | null>(null);
    const [auth, setAuth] = useState<Auth | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [ficha, setFicha] = useState<TreinadorFicha>(FICHA_TREINADOR_INICIAL);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 2. Inicialização do Firebase e Autenticação
    useEffect(() => {
        // NOVO: A verificação impede que o Firebase seja inicializado mais de uma vez
        if (!getApps().length) {
            try {
                const firebaseConfig = {
                    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
                    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
                };

                const app = initializeApp(firebaseConfig);
                const authInstance = getAuth(app);
                const dbInstance = getFirestore(app);

                setAuth(authInstance);
                setDb(dbInstance);

                // --- A PARTE MAIS IMPORTANTE ---
                // NOVO: Criamos o "vigia" que ouve as mudanças de login
                const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
                    setUser(currentUser); // Guarda o usuário logado (ou null)
                    
                    // NOVO: Este é o "sinal verde"!
                    // Avisamos a aplicação que a verificação inicial terminou.
                    setIsAuthReady(true);
                    setLoading(false); // Também paramos o estado de loading geral
                });

                // NOVO: Função de limpeza que remove o "vigia" quando o componente sai da tela
                return () => unsubscribe();
                // --- FIM DA PARTE IMPORTANTE ---

            } catch (err) {
                console.error("Falha ao inicializar o Firebase:", err);
                setError("Não foi possível conectar ao servidor.");
                setLoading(false);
                setIsAuthReady(true); // NOVO: Se der erro, também paramos de carregar
            }
        }
    }, []);

    // 3. Carregamento de Dados do Treinador (RASCUNHO - será ativado depois)
    // useEffect(() => {
    //     if (db && user) {
    //         // Aqui virá a lógica para carregar a ficha do treinador do Firestore
    //     }
    // }, [db, user]);

    // Função para passar para os componentes filhos atualizarem a ficha
    const handleUpdateFicha = (novaFicha: TreinadorFicha) => {
        setFicha(novaFicha);
        // Aqui virá a lógica para salvar a ficha no Firestore
    };

    // 4. Renderização Condicional
    if (!isAuthReady || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    {/* Você pode adicionar um ícone de spinner animado aqui */}
                    <h1 className="text-2xl font-semibold text-gray-700">Carregando hub de treinadores...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    // MUDANÇA: Agora a decisão é baseada no objeto 'user'
    return (
        <main className="min-h-screen bg-gray-100">
            {user && db ? (
                // Se o usuário está logado E o db está pronto, mostramos a ficha
                <FichaTreinador
                    initialFicha={ficha} // <-- DEVE ser 'ficha'
                    onSave={handleUpdateFicha} // <-- DEVE ser 'onUpdateFicha'
                />
            ) : (
                // Se não há usuário, mostramos a tela de Login
                <Login auth={auth} />
            )}
        </main>
    );
};

export default TreinadorHub;