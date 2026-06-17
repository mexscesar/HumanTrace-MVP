/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Target, FolderHeart, Sparkles, PlusCircle, Heart } from 'lucide-react';

interface NewProjectViewProps {
  onClose: () => void;
  onCreateProject: (name: string, objective: string, category: string, motivation: string) => void;
}

const SUGGESTED_CATEGORIES = [
  'UI/UX Design',
  'Brand Identity',
  'Design System',
  'Product Strategy',
  'Peça Gráfica / Social Media',
  'Interactive Media',
  'Editorial Design'
];

export default function NewProjectView({ onClose, onCreateProject }: NewProjectViewProps) {
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [motivation, setMotivation] = useState('');
  const [category, setCategory] = useState(SUGGESTED_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Por favor, informe o nome do projeto.');
      return;
    }
    if (!objective.trim()) {
      setError('Descreva brevemente o objetivo humano do projeto.');
      return;
    }
    if (!motivation.trim()) {
      setError('Descreva qual foi a necessidade humana que motivou este projeto.');
      return;
    }

    const outputCategory = isCustomCategory ? (customCategory.trim() || 'Outro') : category;
    
    onCreateProject(
      name.trim(),
      objective.trim(),
      outputCategory,
      motivation.trim()
    );
  };

  return (
    <div className="fixed inset-0 bg-brand-text/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="new-project-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-brand-surface border border-brand-border rounded-xl shadow-xl overflow-hidden"
        id="new-project-card"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-brand-border/60" id="modal-header">
          <div className="flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-brand-primary" />
            <h2 className="text-sm font-bold text-brand-text font-mono uppercase tracking-wide">Novo Rastreamento de Projeto</h2>
          </div>
          <button 
            id="btn-close-modal"
            onClick={onClose}
            className="p-1 text-brand-muted hover:text-brand-text hover:bg-brand-bg rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5" id="new-project-form">
          {error && (
            <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg p-2.5" id="new-project-error">
              {error}
            </div>
          )}

          <div className="space-y-1.5" id="group-proj-name">
            <label htmlFor="proj-name-input" className="block text-xs font-semibold text-brand-muted">
              Nome do Projeto <span className="text-brand-primary">*</span>
            </label>
            <input
              id="proj-name-input"
              type="text"
              required
              placeholder="Ex: Design System Aurora v1.0, Rebranding EcoFlora..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-brand-bg border border-brand-border rounded-lg py-2.5 px-3.5 text-xs text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div className="space-y-1.5" id="group-proj-category">
            <label className="block text-xs font-semibold text-brand-muted">
              Categoria Principal do Processo <span className="text-brand-primary">*</span>
            </label>
            
            {!isCustomCategory ? (
              <div className="space-y-2">
                <select
                  id="proj-cat-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border rounded-lg py-2.5 px-3 mb-2 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  {SUGGESTED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(true)}
                  className="text-[10px] text-brand-primary font-mono hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Criar categoria customizada...</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  id="proj-cat-custom-input"
                  type="text"
                  placeholder="Digite sua categoria customizada..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border rounded-lg py-2.5 px-3.5 text-xs text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(false)}
                  className="text-[10px] text-brand-muted font-mono hover:underline cursor-pointer"
                >
                  <span>Voltar para lista de sugestões</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1.5" id="group-proj-objective">
            <label htmlFor="proj-objective-input" className="block text-xs font-semibold text-brand-muted">
              Qual é o objetivo humano deste projeto? <span className="text-brand-primary">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-brand-muted pointer-events-none">
                <Target className="w-4 h-4" />
              </span>
              <textarea
                id="proj-objective-input"
                rows={3}
                required
                placeholder="Qual problema específico você está resolvendo e qual impacto humano estratégico você pretende atingir? Descreva brevemente o escopo."
                value={objective}
                onChange={(e) => {
                  setObjective(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-brand-bg border border-brand-border rounded-lg py-2.5 pl-9 pr-3.5 text-xs text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-1 focus:ring-brand-primary leading-relaxed resize-none"
              />
            </div>
            <p className="text-[10px] text-brand-muted leading-relaxed">
              Dica: O HumanTrace analisará a consistência das suas decisões registradas com base neste objetivo original.
            </p>
          </div>

          <div className="space-y-1.5" id="group-proj-motivation">
            <label htmlFor="proj-motivation-input" className="block text-xs font-semibold text-brand-muted">
              Qual necessidade humana motivou este projeto? <span className="text-brand-primary">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-brand-muted pointer-events-none">
                <Heart className="w-4 h-4" />
              </span>
              <textarea
                id="proj-motivation-input"
                rows={3}
                required
                placeholder="Ex: A necessidade de apoiar criadores locais que perdem visibilidade frente a algoritmos de postagens automatizadas."
                value={motivation}
                onChange={(e) => {
                  setMotivation(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-brand-bg border border-brand-border rounded-lg py-2.5 pl-9 pr-3.5 text-xs text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-1 focus:ring-brand-primary leading-relaxed resize-none"
              />
            </div>
            <p className="text-[10px] text-brand-muted leading-relaxed">
              Dica: Estabelecer a empatia profunda ou fricção social primária serve como barreira de validação humana essencial.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border/60" id="modal-actions">
            <button
              id="btn-cancel-project"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-brand-muted hover:text-brand-text hover:bg-brand-bg rounded-lg border border-transparent hover:border-brand-border transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="btn-create-project-submit"
              type="submit"
              className="bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Criar Projeto</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
