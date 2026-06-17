/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Fingerprint, ShieldCheck, User as UserIcon, Mail, ArrowRight } from 'lucide-react';
import { User } from '../types';
import { DEFAULT_USER } from '../utils/seedData';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, insira o seu nome.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
    setError('');
    onLogin({ name: name.trim(), email: email.trim() });
  };

  const handleUseSeed = () => {
    setName(DEFAULT_USER.name);
    setEmail(DEFAULT_USER.email);
    setTimeout(() => {
      onLogin(DEFAULT_USER);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between p-6 md:p-12 selection:bg-brand-primary/20" id="login-container">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2" id="login-logo-group">
          <div className="w-9 h-9 rounded-lg bg-brand-primary flex items-center justify-center text-white" id="logo-icon-container">
            <Fingerprint className="w-5 h-5 stroke-[1.75]" />
          </div>
          <span className="font-mono text-lg font-bold tracking-tight text-brand-text">HUMANTRACE</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-brand-muted font-mono" id="system-status">
          <ShieldCheck className="w-4 h-4 text-brand-success" />
          <span>PROCESSO CRIATIVO VERIFICÁVEL</span>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex items-center justify-center py-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md bg-brand-surface border border-brand-border rounded-xl p-8 shadow-sm transition-shadow hover:shadow-md"
          id="login-card"
        >
          <div className="mb-8 text-center" id="login-card-header">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider bg-brand-primary/10 text-brand-primary mb-2">
              Ano 2036 • O Grande Vazio Digital
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-brand-text mt-1">Bem-vindo ao HumanTrace</h1>
            <p className="text-sm text-brand-muted mt-2 leading-relaxed">
              Diferencie seu trabalho em um mundo saturado por IA. Documente seu processo criativo humano e gere certificados verificáveis de autoria.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            <div className="space-y-1.5" id="field-name">
              <label htmlFor="name-input" className="block text-xs font-medium text-brand-muted">
                Nome do Designer
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-brand-muted pointer-events-none">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input
                  id="name-input"
                  type="text"
                  placeholder="Ex: Mariana Vasconcelos"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-brand-bg border border-brand-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5" id="field-email">
              <label htmlFor="email-input" className="block text-xs font-medium text-brand-muted">
                E-mail Corporativo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-brand-muted pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email-input"
                  type="email"
                  placeholder="Ex: mariana@studio.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-brand-bg border border-brand-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all font-sans"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg p-2.5"
                id="login-error-message"
              >
                {error}
              </motion.div>
            )}

            <button
              id="btn-login-submit"
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
            >
              <span>Entrar no Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="relative my-6" id="login-separator">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-border"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
              <span className="px-3 bg-brand-surface text-brand-muted">Ou avalie rápido</span>
            </div>
          </div>

          <button
            id="btn-login-seed"
            type="button"
            onClick={handleUseSeed}
            className="w-full bg-brand-bg hover:bg-brand-border border border-brand-border text-brand-text text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
            <span>Entrar com Portfólio Demonstrativo (Seed)</span>
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-brand-border/60 pt-6 text-[11px] font-mono text-brand-muted">
        <div>HumanTrace Studio © 2026. Design Rastreável para Startups.</div>
        <div className="flex gap-4">
          <span className="hover:text-brand-primary transition-colors cursor-help">Documentação</span>
          <span className="hover:text-brand-primary transition-colors cursor-help">Manifesto Rastreável</span>
          <span className="hover:text-brand-primary transition-colors cursor-help">SaaS v1.4.0</span>
        </div>
      </div>
    </div>
  );
}
