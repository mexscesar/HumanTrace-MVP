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
    <div className="min-h-screen bg-gradient-to-br from-[#1a1340] via-[#6D5EF5] to-[#0d0926] flex flex-col justify-between p-6 md:p-12 relative overflow-hidden selection:bg-white/20" id="login-container">
      {/* Subtle organic light effect in the background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-[#818cf8]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4f46e5]/20 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto z-10" id="login-header-wrapper">
        <div className="flex items-center gap-2" id="login-logo-group">
          <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-xs" id="logo-icon-container">
            <Fingerprint className="w-5 h-5 stroke-[1.75]" />
          </div>
          <span className="font-mono text-lg font-bold tracking-tight text-white">HUMANTRACE</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs text-violet-100 font-mono backdrop-blur-xs" id="system-status">
          <ShieldCheck className="w-4 h-4 text-[#34d399]" />
          <span>PROCESSO CRIATIVO VERIFICÁVEL</span>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex items-center justify-center py-10 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md bg-white border border-[#e2e8f0]/40 rounded-2xl p-8 md:p-10 shadow-2xl"
          id="login-card"
        >
          <div className="mb-8 text-center" id="login-card-header">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#1a1340] via-[#6D5EF5] to-[#4F46E5] bg-clip-text text-transparent py-1">
              Bem-vindo ao HumanTrace
            </h1>
            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
              Diferencie seu trabalho em um mundo saturado por IA. Documente seu processo criativo humano e gere certificados verificáveis de autoria.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            <div className="space-y-1.5" id="field-name">
              <label htmlFor="name-input" className="block text-xs font-semibold text-slate-600">
                Nome do Designer
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6D5EF5] focus:border-[#6D5EF5] transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5" id="field-email">
              <label htmlFor="email-input" className="block text-xs font-semibold text-slate-600">
                E-mail Corporativo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6D5EF5] focus:border-[#6D5EF5] transition-all font-sans"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-red-600 bg-red-50/70 border border-red-100 rounded-lg p-2.5"
                id="login-error-message"
              >
                {error}
              </motion.div>
            )}

            <button
              id="btn-login-submit"
              type="submit"
              className="w-full bg-[#6D5EF5] hover:bg-[#5849df] text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer group shadow-sm"
            >
              <span>Entrar no Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="relative my-6" id="login-separator">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
              <span className="px-3 bg-white text-slate-450">Ou avalie rápido</span>
            </div>
          </div>

          <button
            id="btn-login-seed"
            type="button"
            onClick={handleUseSeed}
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 text-slate-700 text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Entrar com Portfólio Demonstrativo (Seed)</span>
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-white/10 pt-6 text-[10px] font-mono text-violet-200/70 z-10">
        <div>HumanTrace Studio © 2026. Design Rastreável para Startups.</div>
        <div className="flex gap-4">
          <span className="hover:text-white transition-colors cursor-help">Documentação</span>
          <span className="hover:text-white transition-colors cursor-help">Manifesto Rastreável</span>
          <span className="hover:text-white transition-colors cursor-help">SaaS v1.4.0</span>
        </div>
      </div>
    </div>
  );
}
