/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  FolderIcon, 
  Award, 
  Calendar, 
  ChevronRight, 
  Search, 
  LogOut, 
  Activity, 
  RotateCcw,
  Sparkles,
  Layers,
  Fingerprint
} from 'lucide-react';
import { Project, User } from '../types';

interface DashboardViewProps {
  user: User;
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onOpenNewProject: () => void;
  onLogout: () => void;
  onResetSeed: () => void;
}

export default function DashboardView({
  user,
  projects,
  onSelectProject,
  onOpenNewProject,
  onLogout,
  onResetSeed
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.objective.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  const getScoreColorAndLabel = (score: number) => {
    if (score >= 90) return { text: 'text-brand-success', bg: 'bg-brand-success/10', border: 'border-brand-success/20', label: 'Excelente' };
    if (score >= 70) return { text: 'text-brand-primary', bg: 'bg-brand-primary/10', border: 'border-brand-primary/20', label: 'Consolidado' };
    if (score >= 40) return { text: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Básico' };
    return { text: 'text-brand-muted', bg: 'bg-brand-muted/10', border: 'border-brand-border', label: 'Incipiente' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col p-6 selection:bg-brand-primary/20" id="dashboard-container">
      {/* Navbar - Premium Purple Theme */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between bg-brand-primary px-6 py-4 rounded-xl text-white shadow-md mb-8" id="dashboard-navbar">
        <div className="flex items-center gap-7">
          <div className="flex items-center gap-2 cursor-pointer" id="logo-brand">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-primary">
              <Fingerprint className="w-4.5 h-4.5 stroke-[1.75]" />
            </div>
            <span className="font-mono text-base font-bold tracking-tight text-white">HUMANTRACE</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[11px] font-mono text-violet-100">
            <Activity className="w-3.5 h-3.5 text-violet-200 animate-pulse" />
            <span>Workspace Ativo • Modo Autônomo</span>
          </div>
        </div>

        <div className="flex items-center gap-4" id="user-controls">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-white">{user.name}</span>
            <span className="text-[10px] text-violet-100/80 font-mono">{user.email}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-xs font-bold font-mono">
            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <button 
            id="btn-logout"
            onClick={onLogout}
            title="Sair da Conta"
            className="p-1.5 text-violet-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Block + Stats */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6" id="welcome-stats-section">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-text">
              Olá, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-brand-secondary text-brand-muted mt-1 leading-relaxed max-w-xl">
              Gerencie e audite o rastreamento das suas decisões de design. Prove a autoria humana dos seus projetos através de fluxos rastreáveis ordenados.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap" id="stats-ribbon">
            <div className="bg-brand-surface border border-brand-border rounded-xl px-5 py-4 min-w-[140px] flex items-center gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-brand-text">{projects.length}</div>
                <div className="text-[11px] font-mono text-brand-muted">Projetos Ativos</div>
              </div>
            </div>

            <button
              id="btn-new-project-top"
              onClick={onOpenNewProject}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-medium py-4 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md h-full min-h-[74px]"
            >
              <Plus className="w-4.5 h-4.5 stroke-[2.25]" />
              <span>Novo Projeto</span>
            </button>
          </div>
        </section>

        {/* Project List Subsection */}
        <section className="space-y-4" id="project-list-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-brand-text">
                Seu histórico de rastreabilidade criativa
              </h2>
              <p className="text-xs text-brand-muted mt-0.5">
                Projetos com evidências processuais documentadas no LocalStorage
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                id="btn-reset-seeds"
                onClick={onResetSeed}
                title="Recarregar dados demonstrativos originais"
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-brand-border hover:bg-brand-surface hover:text-brand-primary rounded-lg text-xs font-mono text-brand-muted transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Seeds</span>
              </button>
            </div>
          </div>

          {/* Filtering and Search Controls */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-brand-muted/70" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar projetos por nome ou objetivo..."
                className="w-full bg-brand-surface border border-brand-border rounded-lg py-2 pl-9 pr-4 text-xs text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" id="category-picker">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono capitalize transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-brand-text text-white border-brand-text font-medium' 
                      : 'bg-brand-surface text-brand-muted border-brand-border hover:bg-brand-bg'
                  }`}
                >
                  {cat === 'all' ? 'Ver Todos' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table-like Portfolio Card Board or Empty State */}
          {filteredProjects.length === 0 ? (
            <div className="w-full bg-brand-surface border border-brand-border rounded-xl p-12 text-center" id="empty-projects-state">
              <FolderIcon className="w-10 h-10 text-brand-muted/40 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-brand-text">Nenhum projeto encontrado</h3>
              <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto leading-relaxed">
                Nenhum projeto coincide com a sua busca ou você ainda não documentou nenhum processo criativo.
              </p>
              <button
                onClick={onOpenNewProject}
                className="mt-4 bg-brand-bg hover:bg-brand-border border border-brand-border text-brand-primary text-xs font-semibold px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Começar Rastreamento</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-4.5" id="projects-grid">
              {filteredProjects.map((project) => {
                const badge = getScoreColorAndLabel(project.score);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => onSelectProject(project.id)}
                    className="group bg-brand-surface border border-brand-border rounded-xl p-5 hover:border-brand-primary flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-sm"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-brand-bg border border-brand-border text-brand-muted capitalize">
                          {project.category}
                        </span>
                        <span className="text-[11px] text-brand-muted flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(project.createdAt)}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold text-brand-text group-hover:text-brand-primary transition-colors">
                        {project.name}
                      </h3>
                      
                      <p className="text-xs text-brand-muted leading-relaxed line-clamp-2 max-w-3xl">
                        {project.objective}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-center">
                      {/* Score Indicator Badge */}
                      <div className="flex items-center gap-3 pr-2 border-r border-brand-border/60">
                        <div className="text-right">
                          <div className="text-[9px] uppercase tracking-wider font-mono font-bold text-brand-muted/80">HumanTrace Index</div>
                          <div className={`text-xs font-semibold ${badge.text}`}>{badge.label}</div>
                        </div>
                        
                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border font-mono ${badge.bg} ${badge.border} ${badge.text}`}>
                          <span className="text-lg font-bold leading-none">{project.score}</span>
                          <span className="text-[8px] opacity-85 mt-0.5">pts</span>
                        </div>
                      </div>

                      {/* Chevron CTA */}
                      <div className="p-2 rounded-lg bg-brand-bg group-hover:bg-brand-primary group-hover:text-white transition-all text-brand-muted duration-150">
                        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Quick Didactic Tip Card */}
        <section className="bg-brand-surface border border-brand-border rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center" id="dashboard-notice">
          <div className="w-10 h-10 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-brand-text uppercase font-mono tracking-wider">Por que o HumanTrace importa?</h4>
            <p className="text-xs text-brand-muted mt-1 leading-relaxed max-w-4xl">
              Nossa filosofia é combater o ruído sintético gerando <strong>rastreabilidade</strong>. Não tentamos provar se seu produto final é perfeito ou original através de filtros estatísticos: documentamos o seu percurso de tentativas, referências estéticas manuais, decisões éticas de UX e as melhorias que só uma mente humana de designer seria capaz de arquitetar.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto border-t border-brand-border/60 mt-16 pt-6 text-[11px] font-mono text-brand-muted text-center sm:text-left flex flex-col sm:flex-row justify-between gap-3">
        <div>HumanTrace Studio © 2026. Design Verificável Baseado em Processos.</div>
        <div className="flex justify-center gap-4">
          <span>Persistência: LocalStorage</span>
          <span>Criptografia de Hash de Processo: SHA-256 Mock</span>
        </div>
      </footer>
    </div>
  );
}
