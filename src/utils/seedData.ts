/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Evidence } from '../types';

export const SEED_PROJECTS: Project[] = [
  {
    id: 'seed-project-1',
    name: 'Design System Aurora v1.0',
    objective: 'Criar uma biblioteca de componentes flexível, acessível e inspirada na natureza para o ecossistema de softwares aplicados à agricultura regenerativa.',
    motivation: 'A necessidade de apoiar produtores rurais locais com ferramentas que não requeiram treinamento prévio e que combatam a fadiga ocular sob o sol direto do campo.',
    category: 'Design System',
    createdAt: '2026-05-10T14:32:00.000Z',
    score: 98
  },
  {
    id: 'seed-project-2',
    name: 'Identidade e Portal EcoFlora',
    objective: 'Modernizar a identidade visual e o canal digital do e-commerce EcoFlora para conectar o público jovem urbano ao cultivo doméstico consciente de botânica silvestre.',
    motivation: 'Aumentar a conscientização e o bem-estar mental de jovens moradores de grandes metrópoles através do contato diário simplificado com a botânica viva no lar.',
    category: 'Brand Identity',
    createdAt: '2026-06-01T09:12:00.000Z',
    score: 72
  }
];

export const SEED_EVIDENCES: Evidence[] = [
  // Evidences for Project 1 (Design System Aurora v1.0)
  {
    id: 'seed-ev-1',
    projectId: 'seed-project-1',
    type: 'reference',
    title: 'Estudo de Legibilidade do Sistema Atlassian e WCAG 2.2',
    description: 'Análise aprofundada de contraste de cores sob luz solar direta. Mapeamento de padrões de contraste para usuários operando software de campo sob condições adversas de iluminação.',
    timestamp: '2026-05-10T15:00:00.000Z'
  },
  {
    id: 'seed-ev-2',
    projectId: 'seed-project-1',
    type: 'decision',
    title: 'Substituição de Escala Pura Cinza por Tons Terrosos Quentes',
    description: 'Decidimos fundamentadamente adotar tons terrosos quentes (#1A1613 no Slate escuro, #FAF6F0 no Slate claro) em vez do cinza puro neutro. Isso gerou conexões psicológicas imediatas com o ambiente do campo, além de reduzir em 18% o cansaço ocular medido nos testes preliminares.',
    timestamp: '2026-05-12T10:15:00.000Z'
  },
  {
    id: 'seed-ev-3',
    projectId: 'seed-project-1',
    type: 'version',
    title: 'Figma Typography Hierarchy & Tokens v0.4',
    description: 'Definição dos tokens tipográficos baseados na fonte Open Source "Inter" com escala modular de 1.250 (Major Third) para garantir hierarquia estruturada nas telas densas do App.',
    timestamp: '2026-05-14T11:40:00.000Z'
  },
  {
    id: 'seed-ev-4',
    projectId: 'seed-project-1',
    type: 'reflection',
    title: 'Retrospectiva pós-testes com agrônomos de campo',
    description: 'Observamos que menus em abas flutuantes eram de difícil toque com luvas. A decisão técnica agora é manter uma barra de navegação maior e mais robusta no rodapé fixo do rodado principal. Isso contradiz os padrões estéticos formais de minimalismo absoluto, mas otimiza a sobrevivência ergonômica em campo.',
    timestamp: '2026-05-19T16:22:00.000Z'
  },
  {
    id: 'seed-ev-5',
    projectId: 'seed-project-1',
    type: 'decision',
    title: 'Exclusão de Microinterações de Carregamento Distrativas',
    description: 'Decidimos remover loaders dinâmicos hiper-estilizados e usar layouts cinzentos estruturais (skeletons) estáticos. A ausência de suspense cinético reduz a ansiedade do operador em redes agrícolas intermitentes.',
    timestamp: '2026-05-22T09:05:00.000Z'
  },
  {
    id: 'seed-ev-6',
    projectId: 'seed-project-1',
    type: 'version',
    title: 'Biblioteca de Componentes Core v1.0.0-Beta (CSS & Tokens)',
    description: 'Consolidação e exportação dos tokens em arquivos JSON empacotados via Style Dictionary para os desenvolvedores parceiros da cooperativa técnica de campo.',
    timestamp: '2026-05-24T18:00:00.000Z'
  },

  // Evidences for Project 2 (Identidade e Portal EcoFlora)
  {
    id: 'seed-ev-7',
    projectId: 'seed-project-2',
    type: 'reference',
    title: 'Moodboard de Herbários Clássicos Europeus do Século XIX',
    description: 'Mapeamento estético focado em gravuras, ilustrações científicas hachuradas e tipografia serifada com serifas longas e elegantes. Uma fuga deliberada dos gradientes sintéticos comuns e das formas neomórficas sem alma.',
    timestamp: '2026-06-01T10:00:00.000Z'
  },
  {
    id: 'seed-ev-8',
    projectId: 'seed-project-2',
    type: 'decision',
    title: 'Adoção da Fonte Display Editorial Bricolage Grotesque',
    description: 'Definido o uso da Bricolage para os títulos de marketing digital. Seu desenho experimental conecta as referências antigas à cultura punk do "faça você mesmo" dos novos terrários urbanos.',
    timestamp: '2026-06-03T14:30:00.000Z'
  },
  {
    id: 'seed-ev-9',
    projectId: 'seed-project-2',
    type: 'version',
    title: 'Color Specs & Manual Provisório de Aplicação',
    description: 'Primeira exportação de ativos vetoriais contendo as 4 cores base: Oliva Profundo, Areia, Argila Queimada, e Sálvia. Definição matemática de contrastes de tela seguros.',
    timestamp: '2026-06-08T17:15:00.000Z'
  }
];

export const DEFAULT_USER = {
  name: 'Mariana Vasconcelos',
  email: 'mariana.vasco@humantracers.io'
};
