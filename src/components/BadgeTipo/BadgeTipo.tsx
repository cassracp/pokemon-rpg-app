// Caminho sugerido no projeto: src/components/BadgeTipo/BadgeTipo.tsx
'use client';

import React from 'react';
import { TipoElementoNome } from '@/app/types/index';
// CORREÇÃO: Revertendo para o alias do Next.js (@/), que é o padrão de projetos escaláveis.
import { getTipoVisual } from '@/data/tipos'; 

interface BadgeTipoProps {
    tipoNome: TipoElementoNome;
    className?: string; // Para permitir classes customizadas do Tailwind
}

/**
 * Componente que exibe uma 'badge' estilizada do Tipo Pokémon, 
 * usando cor e ícone definidos em src/data/tipos.ts.
 * Nota: Como não temos acesso aos seus SVGs, usaremos a tag <img> com o path.
 * Para o ícone aparecer, você precisará copiar os seus SVGs para a pasta /public/icons/
 */
const BadgeTipo: React.FC<BadgeTipoProps> = ({ tipoNome, className = '' }) => {
    // Note: getTipoVisual é uma função que você deve ter em src/data/tipos.ts
    const tipo = getTipoVisual(tipoNome);

    // Estilo dinâmico para a cor de fundo (necessário já que a cor é uma variável HEX)
    const customStyle: React.CSSProperties = {
        backgroundColor: tipo.cor,
        boxShadow: `0 2px 8px -1px ${tipo.cor}80`, // Sombra suave com a cor do tipo
        minWidth: '60px',
    };

    // CORREÇÃO: Assegura que o caminho do ícone comece com '/' (raiz da pasta public)
    const iconPath = tipo.iconePath.startsWith('/') ? tipo.iconePath : `/${tipo.iconePath}`;


    return (
        <div
            className={`flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-full text-white text-xs font-bold uppercase transition-transform hover:scale-[1.02] ${className}`}
            style={customStyle}
            title={tipo.nome} // Título para acessibilidade
        >
            {/* Renderização do Ícone. 
            No Next.js real, se você não usar <Image>, 
            copie os SVGs para a pasta 'public' e use o caminho no atributo 'src'.
            */}
            {tipo.iconePath && (
                 // Usando uma tag img simples para SVG na pasta public (Next.js)
                <img 
                    // CORREÇÃO: Usa a variável iconPath garantindo o caminho correto
                    src={iconPath} 
                    alt={tipo.nome} 
                    className="h-3 w-3 filter brightness-0 invert" 
                />
            )}
            <span>{tipo.nome}</span>
        </div>
    );
};

export default BadgeTipo;
