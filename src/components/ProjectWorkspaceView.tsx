/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  BrainCircuit, 
  BookOpen, 
  Lightbulb, 
  GitCommit, 
  Plus, 
  Trash2, 
  Award, 
  Calendar,
  FileBadge,
  Sparkles,
  Printer,
  Download,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { Project, Evidence, EvidenceType, User } from '../types';
import { calculateHumanTraceScore } from '../utils/scoreCalculator';

interface ProjectWorkspaceViewProps {
  user: User;
  project: Project;
  evidences: Evidence[];
  onAddEvidence: (type: EvidenceType, title: string, description: string) => void;
  onDeleteEvidence: (evidenceId: string) => void;
  onBackToDashboard: () => void;
  onUpdateProjectScore: (projectId: string, newScore: number) => void;
}

type TabType = 'timeline' | 'analysis' | 'certificate';

export default function ProjectWorkspaceView({
  user,
  project,
  evidences,
  onAddEvidence,
  onDeleteEvidence,
  onBackToDashboard,
  onUpdateProjectScore
}: ProjectWorkspaceViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('timeline');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingEvidenceId, setDeletingEvidenceId] = useState<string | null>(null);
  
  // Evidence form state
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('decision');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // UI helpers
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const projectEvidences = evidences.filter(e => e.projectId === project.id);
  const scoreBreakdown = calculateHumanTraceScore(projectEvidences);

  // Sync calculated score back to parent project state if mutated
  React.useEffect(() => {
    if (project.score !== scoreBreakdown.score) {
      onUpdateProjectScore(project.id, scoreBreakdown.score);
    }
  }, [scoreBreakdown.score, project.id, project.score, onUpdateProjectScore]);

  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe um título descritivo.');
      return;
    }
    if (!description.trim()) {
      setError('Por favor, detalhe esta evidência para auditação humana.');
      return;
    }

    onAddEvidence(evidenceType, title.trim(), description.trim());
    
    // Clear form
    setTitle('');
    setDescription('');
    setError('');
    setSuccess('Evidência computada com sucesso e hash estático gerado!');
    
    setTimeout(() => {
      setSuccess('');
      setIsAdding(false);
    }, 1500);
  };

  const getTypeStyle = (type: EvidenceType) => {
    switch (type) {
      case 'decision':
        return {
          icon: BrainCircuit,
          label: 'Decisão de Design',
          color: 'text-violet-600',
          bg: 'bg-violet-50 border-violet-100',
          indicator: 'bg-violet-500'
        };
      case 'reference':
        return {
          icon: BookOpen,
          label: 'Referência',
          color: 'text-cyan-600',
          bg: 'bg-cyan-50 border-cyan-100',
          indicator: 'bg-cyan-500'
        };
      case 'reflection':
        return {
          icon: Lightbulb,
          label: 'Reflexão',
          color: 'text-amber-600',
          bg: 'bg-amber-50 border-amber-100',
          indicator: 'bg-amber-500'
        };
      case 'version':
        return {
          icon: GitCommit,
          label: 'Versão do Projeto',
          color: 'text-emerald-600',
          bg: 'bg-emerald-50 border-emerald-100',
          indicator: 'bg-emerald-500'
        };
    }
  };

  const getScoreBadgeText = (score: number) => {
    if (score >= 90) return { label: 'Rastreabilidade Ótima', color: 'text-brand-success', rating: 'Selo Ouro A+' };
    if (score >= 70) return { label: 'Rastreabilidade Robusta', color: 'text-brand-primary', rating: 'Selo Prata A' };
    if (score >= 40) return { label: 'Rastreabilidade Inicial', color: 'text-amber-600', rating: 'Selo Bronze B' };
    return { label: 'Rastreabilidade Insuficiente', color: 'text-brand-muted', rating: 'Sem Selo' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  // Canvas Certificate Generation
  const handleDownloadCertificateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load custom fonts and dimensions
    canvas.width = 1000;
    canvas.height = 700;

    // Background Color
    ctx.fillStyle = '#FCFCFA'; // Off-white/cream luxury
    ctx.fillRect(0, 0, 1000, 700);

    // Administrative dotted background mesh
    ctx.fillStyle = 'rgba(30, 41, 59, 0.02)';
    for (let x = 12; x < 1000; x += 24) {
      for (let y = 12; y < 700; y += 24) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Outer Thick Charcoal Border
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 14;
    ctx.strokeRect(15, 15, 970, 670);

    // Inner gold borders
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(26, 26, 948, 648);

    ctx.strokeStyle = 'rgba(180, 83, 9, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, 936, 636);

    // Draw beautiful corner decorative brackets
    const drawCorners = () => {
      ctx.strokeStyle = '#B45309'; // Gold
      ctx.lineWidth = 2;
      const size = 30;
      const offset = 42;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(offset, offset + size);
      ctx.lineTo(offset, offset);
      ctx.lineTo(offset + size, offset);
      ctx.stroke();
      // Top-Right
      ctx.beginPath();
      ctx.moveTo(1000 - offset, offset + size);
      ctx.lineTo(1000 - offset, offset);
      ctx.lineTo(1000 - offset - size, offset);
      ctx.stroke();
      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(offset, 700 - offset - size);
      ctx.lineTo(offset, 700 - offset);
      ctx.lineTo(offset + size, 700 - offset);
      ctx.stroke();
      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(1000 - offset, 700 - offset - size);
      ctx.lineTo(1000 - offset, 700 - offset);
      ctx.lineTo(1000 - offset - size, 700 - offset);
      ctx.stroke();
    };
    drawCorners();

    // Guilloché concentric safety watermark (faint)
    ctx.strokeStyle = '#B45309';
    ctx.globalAlpha = 0.03;
    ctx.lineWidth = 1.2;
    for (let r = 50; r < 600; r += 35) {
      ctx.beginPath();
      ctx.arc(500, 350, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Header label
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('REGISTRO DE CONFORMIDADE E TRANSPARÊNCIA DE AUTORIA', 500, 75);

    // Main Title
    ctx.fillStyle = '#0F172A';
    ctx.font = 'normal 34px Georgia, serif';
    ctx.fillText('Certificado de Autenticidade', 500, 130);
    
    // Subtext title
    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('REGISTRO DE PROCESSO CRIATIVO 100% DIRECIONADO POR HUMANOS', 500, 160);

    // Decorative center loop
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(380, 185);
    ctx.lineTo(620, 185);
    ctx.stroke();

    // Statement Paragraphs
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Certifica-se para todos os fins de idoneidade de direitos autorais, governança de IA e resiliência intelectual que o profissional humano:', 500, 225);

    // Developer Name
    ctx.font = 'bold 23px Georgia, serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(user.name.toUpperCase(), 500, 270);

    // Simulated handwriting ink behind name in canvas as well!
    ctx.fillStyle = 'rgba(79, 70, 229, 0.15)';
    ctx.font = '48px "Alex Brush", cursive, Georgia, serif';
    ctx.fillText(user.name, 500, 265);

    // Continued Statement
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('idealizou, documentou e provou com consistência e rastreabilidade cronológica todo o percurso heurístico para o projeto:', 500, 312);

    // Project Name
    ctx.font = 'bold 19px Georgia, serif';
    ctx.fillStyle = '#1E1B4B'; // deep indigo
    ctx.fillText(project.name, 500, 350);

    // Main Score Card Box
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(220, 385, 560, 75);
    ctx.strokeStyle = '#E2E8F0';
    ctx.strokeRect(220, 385, 560, 75);

    // Columns
    ctx.font = 'bold 8px monospace';
    ctx.fillStyle = '#64748B';
    ctx.fillText('DECISÕES', 290, 408);
    ctx.fillText('VERSÕES', 390, 408);
    ctx.fillText('REFLEXÕES', 490, 408);
    ctx.fillText('SCORE INTEGRAL', 675, 408);

    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(String(scoreBreakdown.decisionsCount), 290, 442);
    ctx.fillText(String(scoreBreakdown.versionsCount), 390, 442);
    ctx.fillText(String(scoreBreakdown.reflectionsCount), 490, 442);

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`${scoreBreakdown.score}/100`, 675, 442);

    // Seal of compliance text
    ctx.font = 'italic italic 11px Georgia, serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('"Selo de Conformidade Intelectual: Toda a progressão histórica deste projeto está protegida e auditada de forma soberana contra plágio e falsificação geradora."', 500, 492);

    // Bottom section starting line height
    const bottomY = 530;

    // LEFT: Draw gold star seal
    ctx.save();
    ctx.translate(160, bottomY + 45);
    // teeth
    ctx.fillStyle = '#FEF3C7';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let j = 0; j < 30; j++) {
      const angle = (j * Math.PI * 2) / 30;
      const r = j % 2 === 0 ? 38 : 33;
      ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Inner concentric line
    ctx.strokeStyle = '#92400E';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 27, 0, Math.PI * 2);
    ctx.stroke();
    // Seal text
    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 6.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HUMANTRACE', 0, -8);
    ctx.fillText('• VERIFIED •', 0, 1);
    ctx.fillText('INTEGRITY', 0, 10);
    ctx.restore();

    // CENTER: First Signature (Designer)
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(270, bottomY + 48);
    ctx.lineTo(440, bottomY + 48);
    ctx.stroke();
    // Blue handwriting signature ink
    ctx.fillStyle = '#4F46E5';
    ctx.font = '28px "Alex Brush", cursive, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(user.name, 355, bottomY + 40);
    // Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('ASSINATURA DO AUTOR', 355, bottomY + 63);
    ctx.fillStyle = '#475569';
    ctx.font = 'normal 9px sans-serif';
    ctx.fillText(user.name.toUpperCase(), 355, bottomY + 76);

    // CENTER: Second Signature (HumanTrace Authority)
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(480, bottomY + 48);
    ctx.lineTo(650, bottomY + 48);
    ctx.stroke();
    // Green digital signature marker font
    ctx.fillStyle = '#059669';
    ctx.font = 'bold italic 13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HUMAN_VERIFIED', 565, bottomY + 38);
    // Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('SISTEMA DE CONFORMIDADE', 565, bottomY + 63);
    ctx.fillStyle = '#475569';
    ctx.font = 'normal 8.5px monospace';
    ctx.fillText('PROTOCOL VERIFICATION SIGN', 565, bottomY + 76);

    // RIGHT: Draw dynamic unique QR Code at bottom-right
    const qrX = 730;
    const qrY = bottomY + 5;
    const qrSize = 85;

    // Background white for QR
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.strokeRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);

    // Helper functions to draw QR markers
    const drawQRMarker = (mx: number, my: number) => {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(mx, my, 22, 22);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(mx + 3, my + 3, 16, 16);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(mx + 6, my + 6, 10, 10);
    };

    drawQRMarker(qrX, qrY); // Top-Left
    drawQRMarker(qrX + qrSize - 22, qrY); // Top-Right
    drawQRMarker(qrX, qrY + qrSize - 22); // Bottom-Left

    // deterministic data code loops for inside the QR
    const seedVal = project.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    ctx.fillStyle = '#0F172A';
    const cell = 3.5;
    const cells = Math.floor(qrSize / cell);
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        const isTL = r < 7 && c < 7;
        const isTR = r < 7 && c >= cells - 7;
        const isBL = r >= cells - 7 && c < 7;
        if (!isTL && !isTR && !isBL) {
          const val = Math.sin(seedVal + (r * 17) + (c * 29)) * 10000;
          if ((val - Math.floor(val)) > 0.5) {
            ctx.fillRect(qrX + (c * cell), qrY + (r * cell), cell - 0.5, cell - 0.5);
          }
        }
      }
    }

    // QR Labels
    ctx.fillStyle = '#4F46E5';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TIMELINE DA AUDITORIA', qrX + qrSize/2, qrY + qrSize + 18);

    // Bottom Cryptographic Audit Footer Lines
    const verifyUrl = window.location.origin + '/?project_id=' + project.id;
    ctx.font = '8px monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'left';
    ctx.fillText(`URL DE CONSULTA DA TIMELINE: ${verifyUrl.toUpperCase()}`, 50, 655);

    const hashSignature = `ht-signature-${project.id.substring(0, 10).toUpperCase()}-${scoreBreakdown.score}`;
    ctx.fillText(`HASH ASSINATURA DE AUDITABILIDADE UNILATERAL: ${hashSignature}`, 50, 672);
    ctx.textAlign = 'right';
    ctx.fillText(`REGISTRADO EM: ${new Date(project.createdAt).toLocaleDateString('pt-BR')} ${new Date(project.createdAt).toLocaleTimeString('pt-BR')}`, 950, 672);

    // Trigger download
    const link = document.createElement('a');
    link.download = `HUMANTRACE_CERTIFICADO_${project.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col p-4 md:p-6 selection:bg-brand-primary/20" id="project-workspace">
      
      {/* Hidden canvas for image generator */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Navigation - Premium Purple Theme */}
      <header className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-primary px-6 py-4 rounded-xl text-white shadow-md mb-6 no-print" id="workspace-header">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-to-dashboard"
            onClick={onBackToDashboard}
            className="p-2 border border-white/20 hover:bg-white/10 rounded-lg text-violet-100 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-violet-200/90">
              <span>Projetos</span>
              <span>/</span>
              <span className="capitalize">{project.category}</span>
            </div>
            
            <h1 className="text-lg font-bold text-white truncate max-w-md mt-0.5">{project.name}</h1>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white/10 border border-white/10 rounded-xl" id="workspace-tabs-group">
          <button
            id="tab-timeline"
            onClick={() => setActiveTab('timeline')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === 'timeline' 
                ? 'bg-white text-brand-primary shadow-xs' 
                : 'text-violet-100 hover:text-white hover:bg-white/5'
            }`}
          >
            Linha do Tempo
          </button>
          <button
            id="tab-analysis"
            onClick={() => setActiveTab('analysis')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === 'analysis' 
                ? 'bg-white text-brand-primary shadow-xs' 
                : 'text-violet-100 hover:text-white hover:bg-white/5'
            }`}
          >
            Score & Análise
          </button>
          <button
            id="tab-certificate"
            onClick={() => setActiveTab('certificate')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === 'certificate' 
                ? 'bg-white text-brand-primary shadow-xs' 
                : 'text-violet-100 hover:text-white hover:bg-white/5'
            }`}
          >
            Certificado
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Primary workspace workspace depending on active tab) */}
        <section className="lg:col-span-8 space-y-6 print-card" id="primary-workspace-panel">
          
          {/* Timeline Tab Workspace */}
          {activeTab === 'timeline' && (
            <div className="space-y-6 no-print" id="panel-timeline">
              
              {/* Evidence trigger row */}
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-brand-text font-mono uppercase tracking-wide">
                    Rastreamento de Processo ({projectEvidences.length})
                  </h2>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Adicione evidências cronológicas irrefutáveis de ideação e refino humano.
                  </p>
                </div>

                {!isAdding && (
                  <button
                    id="btn-trigger-adding"
                    onClick={() => setIsAdding(true)}
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Registrar Evidência</span>
                  </button>
                )}
              </div>

              {/* Add Evidence Form */}
              <AnimatePresence>
                {isAdding && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-sm overflow-hidden"
                    id="evidence-form-container"
                  >
                    <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-4" id="form-header">
                      <span className="text-xs font-bold text-brand-text font-mono uppercase tracking-wide">Novo Registro na Trilha</span>
                      <button
                        onClick={() => setIsAdding(false)}
                        className="text-xs text-brand-muted hover:text-brand-text hover:underline cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <form onSubmit={handleSubmitEvidence} className="space-y-4" id="form-evidence">
                      {error && (
                        <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg p-2.5">{error}</div>
                      )}
                      
                      {success && (
                        <div className="text-xs text-brand-success bg-brand-success/5 border border-brand-success/20 rounded-lg p-2.5 flex items-center gap-1.5 font-medium">
                          <CheckCircle className="w-4 h-4 text-brand-success shrink-0" />
                          <span>{success}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2" id="evidence-type-picker">
                        {([
                          { type: 'decision', label: 'Decisão de Design', desc: 'Escolhas estratégicas fundamentadas' },
                          { type: 'reference', label: 'Referência', desc: 'Inspiração e curadoria manual' },
                          { type: 'reflection', label: 'Reflexão', desc: 'Retrospectivas e meta-cognição' },
                          { type: 'version', label: 'Versão de Arquivo', desc: 'Checkpoints de Figma, código, CSS' }
                        ] as const).map((opt) => {
                          const isSelected = evidenceType === opt.type;
                          return (
                            <button
                              key={opt.type}
                              type="button"
                              onClick={() => setEvidenceType(opt.type)}
                              className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-brand-text text-white border-brand-text ring-1 ring-brand-text'
                                  : 'bg-brand-bg text-brand-text border-brand-border hover:bg-brand-surface'
                              }`}
                            >
                              <span className="text-xs font-semibold">{opt.label}</span>
                              <span className={`text-[9px] leading-tight ${isSelected ? 'text-white/80' : 'text-brand-muted'}`}>
                                {opt.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="space-y-1.5" id="group-title">
                        <label htmlFor="evidence-title-input" className="block text-xs font-semibold text-brand-muted">
                          Título Simples do Registro <span className="text-brand-primary">*</span>
                        </label>
                        <input
                          id="evidence-title-input"
                          type="text"
                          required
                          placeholder="Ex: Remoção da navegação lateral após testes; Moodboard analógico da feira..."
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                            if (error) setError('');
                          }}
                          className="w-full bg-brand-bg border border-brand-border rounded-lg py-2 px-3 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        />
                      </div>

                      <div className="space-y-1.5" id="group-desc">
                        <label htmlFor="evidence-desc-input" className="block text-xs font-semibold text-brand-muted">
                          Descrição Detalhada do Processo Mental / Decisão <span className="text-brand-primary">*</span>
                        </label>
                        <textarea
                          id="evidence-desc-input"
                          rows={4}
                          required
                          placeholder="O que motivou isso? Por que escolheu esse caminho em vez de outro? Descrever o ato processual é a maior evidência humana contra inteligências artificiais genéricas."
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            if (error) setError('');
                          }}
                          className="w-full bg-brand-bg border border-brand-border rounded-lg py-2 px-3 text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary leading-relaxed resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-[10px] text-brand-muted font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Timestamp Automático: Agora</span>
                        </div>

                        <button
                          id="btn-save-evidence-submit"
                          type="submit"
                          className="bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer"
                        >
                          Salvar Registro na Timeline
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Timeline Canvas Stack */}
              {projectEvidences.length === 0 ? (
                <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center" id="empty-timeline">
                  <Clock className="w-10 h-10 text-brand-muted/40 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-brand-text">A trilha de evidências está vazia</h3>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed max-w-sm mx-auto">
                    Insira registros do seu percurso criativo usando o botão acima. Cada Decisão, Referência e Versão aumenta seu HumanTrace Score!
                  </p>
                </div>
              ) : (
                <div className="relative pl-6 sm:pl-8 space-y-6 pt-2" id="timeline-stack">
                  {/* Vertical connector line */}
                  <div className="absolute left-[11px] sm:left-[15px] top-6 bottom-6 w-0.5 bg-brand-border" />

                  {projectEvidences
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((ev, index) => {
                      const style = getTypeStyle(ev.type);
                      const EvIcon = style.icon;

                      return (
                        <motion.div
                          key={ev.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative group bg-brand-surface border border-brand-border rounded-xl p-5 transition-shadow hover:shadow-xs"
                          id={`timeline-item-${ev.id}`}
                        >
                          {/* Circle node connector with type icon */}
                          <div className={`absolute -left-[31px] sm:-left-[35px] top-6 w-6 h-6 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center bg-white shadow-xs transition-colors group-hover:border-brand-primary ${style.color}`}>
                            <EvIcon className="w-3 h-3 sm:w-4.5 sm:h-4.5" />
                          </div>

                          {/* Detail Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm border ${style.bg} ${style.color}`}>
                                {style.label}
                              </span>
                              
                              <span className="text-[10px] text-brand-muted font-mono flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(ev.timestamp)}
                              </span>
                            </div>

                            {deletingEvidenceId === ev.id ? (
                              <div className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded text-[10px] font-mono animate-fade-in no-print" id={`delete-confirm-${ev.id}`}>
                                <span className="font-bold">Remover?</span>
                                <button
                                  onClick={() => {
                                    onDeleteEvidence(ev.id);
                                    setDeletingEvidenceId(null);
                                  }}
                                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                                >
                                  Sim
                                </button>
                                <button
                                  onClick={() => setDeletingEvidenceId(null)}
                                  className="text-slate-500 hover:text-slate-700 font-bold px-1.5 py-0.5 rounded cursor-pointer hover:bg-slate-100 transition-colors"
                                >
                                  Não
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletingEvidenceId(ev.id)}
                                title="Remover esta evidência"
                                className="text-brand-muted hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors self-end sm:self-center opacity-0 group-hover:opacity-100 cursor-pointer no-print"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-sm font-bold text-brand-text mb-1.5">
                            {ev.title}
                          </h3>

                          {/* Text Body */}
                          <p className="text-xs text-brand-muted leading-relaxed whitespace-pre-line">
                            {ev.description}
                          </p>
                        </motion.div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Analysis Tab Workspace */}
          {activeTab === 'analysis' && (
            <div className="bg-brand-surface border border-brand-border rounded-xl p-6 space-y-8 no-print animate-fade-in" id="panel-analysis">
              <div>
                <h2 className="text-sm font-bold text-brand-text font-mono uppercase tracking-wide">Mapeamento & Auditoria de Atividade</h2>
                <p className="text-xs text-brand-muted mt-0.5">Análise multidimensional das evidências registradas no escopo deste design.</p>
              </div>

              {/* Radial Score Gauge */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-brand-bg rounded-xl p-6 border border-brand-border">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Circular progress track */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      className="stroke-brand-border fill-none"
                      strokeWidth="10"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      className="stroke-brand-primary fill-none transition-all duration-1000 ease-out"
                      strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 64}`}
                      strokeDashoffset={`${2 * Math.PI * 64 * (1 - scoreBreakdown.score / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  <div className="absolute text-center flex flex-col items-center">
                    <span className="text-3xl font-extrabold font-mono tracking-tight text-brand-text">{scoreBreakdown.score}</span>
                    <span className="text-[10px] text-brand-muted font-mono uppercase font-bold tracking-wider">Trace Pts</span>
                  </div>
                </div>

                <div className="space-y-2 text-center md:text-left flex-1">
                  <div className="inline-block px-2.5 py-0.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded text-xs font-mono font-bold">
                    {getScoreBadgeText(scoreBreakdown.score).rating}
                  </div>
                  <h3 className="text-md font-bold text-brand-text">{getScoreBadgeText(scoreBreakdown.score).label}</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Sua pontuação é influenciada pela diversidade e preenchimento de cada tipo de registro do percurso criativo. Mantenha registros equilibrados para aumentar a credibilidade histórica do seu processo contra automações puras.
                  </p>
                </div>
              </div>

              {/* Activity Types Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="metrics-counters-grid">
                {[
                  { label: 'Decisões', count: scoreBreakdown.decisionsCount, scoreWeight: '15 Pts/u', color: 'text-violet-600', border: 'border-violet-100' },
                  { label: 'Referências', count: scoreBreakdown.referencesCount, scoreWeight: '10 Pts/u', color: 'text-cyan-600', border: 'border-cyan-100' },
                  { label: 'Reflexões', count: scoreBreakdown.reflectionsCount, scoreWeight: '15 Pts/u', color: 'text-amber-600', border: 'border-amber-100' },
                  { label: 'Versões', count: scoreBreakdown.versionsCount, scoreWeight: '10 Pts/u', color: 'text-emerald-600', border: 'border-emerald-100' }
                ].map((item, id) => (
                  <div key={id} className={`bg-brand-bg border ${item.border} rounded-xl p-4 text-center`} id={`metric-block-${id}`}>
                    <span className="text-xs text-brand-muted font-mono">{item.label}</span>
                    <div className={`text-2xl font-bold font-mono mt-1 ${item.color}`}>{item.count}</div>
                    <span className="text-[9px] font-mono text-brand-muted/70 block mt-0.5">Peso: {item.scoreWeight}</span>
                  </div>
                ))}
              </div>

              {/* Explanation Notice Requirement */}
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-amber-900" id="analysis-disclaimer">
                <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <p>
                  <strong>Aviso Importante:</strong> Este score representa o nível de documentação do processo criativo e não uma validação absoluta de autoria. Ele serve como lastro público de persistência humana e transparência.
                </p>
              </div>

              {/* Informative Tips of Creative Process */}
              <div className="space-y-3" id="analysis-suggestions">
                <h3 className="text-xs font-bold text-brand-text font-mono uppercase tracking-wider">Como maximizar seu HumanTrace Score?</h3>
                <div className="space-y-2 text-xs text-brand-muted">
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="w-4 h-4 text-brand-success mt-0.5 shrink-0" />
                    <p><strong>Diversifique as Etapas:</strong> Não foque apenas em salvar capturas (Versões). Mapeie suas inspirações iniciais (Referências) e discuta as lições aprendidas (Reflexões).</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="w-4 h-4 text-brand-success mt-0.5 shrink-0" />
                    <p><strong>Descreva as "Escolhas Difíceis":</strong> O que foi deixado de lado? Detalhe decisões fundamentadas onde você sacrificou estética por ergonomia ou vice-versa.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Certificate Tab Workspace */}
          {activeTab === 'certificate' && (
            <div className="space-y-6" id="panel-certificate">
              
              {/* Header Controls for printable page */}
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3 no-print">
                <div>
                  <h2 className="text-sm font-bold text-brand-text font-mono uppercase tracking-wide">
                    Certificação Gerada
                  </h2>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Visualize o diploma de conformidade processual válido para exportação.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-print-ctrl"
                    onClick={handlePrintCertificate}
                    className="bg-brand-bg hover:bg-brand-border border border-brand-border text-brand-text text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir Certificado</span>
                  </button>
                  <button
                    id="btn-download-image"
                    onClick={handleDownloadCertificateImage}
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar PNG</span>
                  </button>
                </div>
              </div>

              {/* The Visual Certificate Mockup */}
              <div 
                className="bg-[#FCFCFA] text-slate-800 border-[16px] border-[#1e293b] p-8 md:p-14 relative overflow-hidden flex flex-col items-center text-center shadow-2xl rounded-xl select-none min-h-[750px] font-sans"
                id="printable-certificate-body"
                style={{
                  backgroundImage: 'radial-gradient(#1e293b05 1.5px, transparent 1.5px)',
                  backgroundSize: '24px 24px',
                }}
              >
                {/* Elegant Gold Accent Inner Borders */}
                <div className="absolute inset-4 border border-amber-600/30 pointer-events-none" />
                <div className="absolute inset-5 border-2 border-double border-amber-600/20 pointer-events-none" />
                
                {/* Corner Brackets / Flourishes */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-amber-600/40 pointer-events-none" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-amber-600/40 pointer-events-none" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-amber-600/40 pointer-events-none" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-amber-600/40 pointer-events-none" />

                {/* Header */}
                <div className="z-10 flex flex-col items-center mb-5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-700/80 font-bold mb-3">
                    REGISTRO DE CONFORMIDADE E TRANSPARÊNCIA DE AUTORIA
                  </span>
                  <div className="flex items-center gap-2 w-full justify-center">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-600/40" />
                    <Award className="w-8 h-8 text-amber-600" />
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-600/40" />
                  </div>
                </div>

                {/* Main Title */}
                <h1 className="z-10 text-3xl md:text-4xl font-normal font-display text-slate-900 tracking-wide leading-tight mt-1 max-w-2xl">
                  Certificado de Autenticidade
                </h1>
                <p className="z-10 font-mono text-[10px] text-amber-800 uppercase tracking-[0.18em] mt-1 mb-6">
                  REGISTRO DE PROCESSO CRIATIVO 100% DIRECIONADO POR HUMANOS
                </p>

                <div className="z-10 w-36 h-[1.5px] bg-gradient-to-r from-transparent via-amber-600/40 to-transparent mb-6" />

                {/* Narrative statement style body text */}
                <div className="z-10 space-y-5 max-w-2xl text-center mb-8 px-2">
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    Certifica-se para todos os fins de idoneidade de direitos autorais, governança de IA e resiliência intelectual que o profissional humano identificado abaixo:
                  </p>
                  
                  {/* Floating handwritten signature under human name */}
                  <div className="relative inline-block py-1 px-8 my-1">
                    <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 opacity-20 font-signature text-6xl text-indigo-700 pointer-events-none select-none rotate-[-4deg] whitespace-nowrap">
                      {user.name}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-wide border-b border-amber-600/20 pb-2 relative z-10">
                      {user.name.toUpperCase()}
                    </h2>
                  </div>

                  <p className="text-xs text-slate-500 font-sans leading-relaxed font-light">
                    idealizou, documentou e provou com consistência e rastreabilidade cronológica todo o percurso heurístico e tomadas de decisão que constituíram o projeto de design:
                  </p>

                  <h3 className="text-base md:text-lg font-bold font-display text-indigo-950 tracking-tight bg-indigo-50/50 py-2.5 px-6 rounded-lg border border-indigo-150/40 inline-block shadow-sm">
                    {project.name}
                  </h3>

                  {project.motivation && (
                    <div className="bg-amber-50/40 border border-amber-200/50 rounded-lg p-3 text-left max-w-lg mx-auto shadow-xs" id="cert-motivation-box">
                      <span className="block text-[8px] font-mono uppercase tracking-wider text-amber-700 font-bold">Incentivo de Empatia Humana Validado:</span>
                      <p className="text-xs font-serif text-slate-700 italic mt-0.5 leading-relaxed">"{project.motivation}"</p>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    registrado sob a categoria <strong className="text-slate-800">{project.category}</strong>. A auditoria estatística das evidências sequenciadas na linha do tempo gerou o seguinte índice final de integridade:
                  </p>
                </div>

                {/* Central statistics table section */}
                <div className="z-10 grid grid-cols-4 bg-slate-900 text-slate-100 rounded-xl max-w-xl w-full border border-slate-800 shadow-lg divide-x divide-slate-800 py-3.5 mb-8">
                  <div className="text-center">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Decisões</span>
                    <span className="text-base font-bold font-mono text-slate-200">{scoreBreakdown.decisionsCount}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Versões</span>
                    <span className="text-base font-bold font-mono text-slate-200">{scoreBreakdown.versionsCount}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Reflexões</span>
                    <span className="text-base font-bold font-mono text-slate-200">{scoreBreakdown.reflectionsCount}</span>
                  </div>
                  <div className="text-center flex flex-col justify-center items-center">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-amber-500 block font-bold">Score Geral</span>
                    <div className="flex items-baseline gap-0.5 mt-0.5 justify-center">
                      <span className="text-lg font-extrabold text-amber-400 font-mono leading-none">{scoreBreakdown.score}</span>
                      <span className="text-[9px] text-slate-400 font-mono">/100</span>
                    </div>
                  </div>
                </div>

                <p className="z-10 text-[11px] text-slate-500 leading-relaxed max-w-md font-display italic mb-8">
                  "Selo de Conformidade Intelectual: Toda a progressão histórica deste projeto está protegida e auditada de forma soberana contra plágio e falsificação geradora."
                </p>

                {/* Multi-Column Signatures & QR Code Section */}
                <div className="z-10 w-full grid grid-cols-1 md:grid-cols-3 items-center gap-6 pt-6 border-t border-slate-200/60">
                  
                  {/* Col 1: Hand-signature */}
                  <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
                    <div className="h-8 relative flex items-end justify-center md:justify-start">
                      <span className="font-signature text-3xl text-indigo-700/80 absolute select-none top-[-10px] left-2 md:left-0 rotate-[-4deg]">
                        {user.name}
                      </span>
                    </div>
                    <div className="w-40 h-[1.2px] bg-slate-300" />
                    <span className="block text-[8px] font-mono uppercase tracking-widest text-slate-400 font-bold">Assinatura do Autor</span>
                    <span className="block text-[10px] font-semibold text-slate-700 uppercase mt-0.5 truncate max-w-[150px]">{user.name}</span>
                  </div>

                  {/* Col 2: Official Wax Seal Graphic */}
                  <div className="flex justify-center">
                    <div className="relative w-18 h-18 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full shadow-md border-2 border-amber-600/50 flex flex-col items-center justify-center rotate-[15deg] transition-transform hover:scale-105 duration-300">
                        <div className="absolute inset-0.5 border border-dashed border-amber-250/20 rounded-full" />
                        <div className="absolute inset-2 border-2 border-double border-amber-150/30 rounded-full" />
                        <span className="text-[5px] font-mono font-bold uppercase tracking-wider block text-amber-100 leading-none">HUMAN</span>
                        <span className="text-[6px] font-mono font-black text-white hover:scale-105 transition-transform block my-0.5">TRACE</span>
                        <span className="text-[5px] font-mono font-bold uppercase tracking-wider block text-amber-100 leading-none">SECURED</span>
                      </div>
                    </div>
                  </div>

                  {/* Col 3: QR Code Verification Container */}
                  <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-1">
                    <div className="flex items-center gap-3 justify-center md:justify-end">
                      <div className="text-center md:text-right">
                        <span className="block text-[8px] font-mono uppercase tracking-wider text-indigo-600 font-extrabold flex items-center gap-1 justify-center md:justify-end">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          TIMELINE DA AUDITORIA
                        </span>
                        <span className="block text-[9px] text-slate-500 max-w-[125px] leading-tight mt-0.5 font-sans">
                          Escaneie para auditar todas as decisões registradas.
                        </span>
                      </div>
                      
                      {/* QR Code Frame */}
                      <div className="p-1 bg-white border border-slate-200 rounded-lg shadow-xs hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                        <img 
                          id="qr-verification-img"
                          referrerPolicy="no-referrer"
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=60&size=60&data=${encodeURIComponent(window.location.origin + '/?project_id=' + project.id)}`}
                          alt="QR Code de Verificação"
                          className="w-14 h-14"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const container = target.parentElement;
                            if (container) {
                              container.innerHTML = `
                                <div class="w-14 h-14 bg-slate-900 flex flex-col items-center justify-center rounded p-0.5 relative text-white" style="font-size: 6px;">
                                  <div class="absolute top-0.5 left-0.5 w-4 h-4 border border-white flex items-center justify-center"><div class="w-1.5 h-1.5 bg-white"></div></div>
                                  <div class="absolute top-0.5 right-0.5 w-4 h-4 border border-white flex items-center justify-center"><div class="w-1.5 h-1.5 bg-white"></div></div>
                                  <div class="absolute bottom-0.5 left-0.5 w-4 h-4 border border-white flex items-center justify-center"><div class="w-1.5 h-1.5 bg-white"></div></div>
                                  <div class="w-6 h-6 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xs flex items-center justify-center font-bold text-slate-900" style="font-size: 5px;">HT</div>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Footer Cryptographic Data Row */}
                <div className="z-10 w-full mt-6 pt-4 border-t border-slate-200/40 flex flex-col sm:flex-row justify-between items-center gap-3 text-[8px] font-mono text-slate-400">
                  <div className="text-center sm:text-left leading-normal">
                    <span className="block">URL DE CONSULTA DA TIMELINE:</span>
                    <span className="font-bold text-slate-500 tracking-wide select-all break-all">{window.location.origin + '/?project_id=' + project.id}</span>
                  </div>
                  <div className="text-center sm:text-right leading-normal">
                    <span className="block">HASH ASSINATURA DE AUDITABILIDADE UNILATERAL:</span>
                    <span className="font-bold text-indigo-950 uppercase tracking-widest block">ht-signature-{project.id.substring(0, 10).toUpperCase()}-{scoreBreakdown.score}</span>
                  </div>
                </div>

              </div>

              {/* Quick printable note helper */}
              <p className="text-[10px] text-brand-muted font-mono leading-relaxed text-center no-print">
                Dica: O botão "Imprimir Certificado" formata e limpa o layout para salvar perfeitamente como PDF diretamente no seu navegador.
              </p>
            </div>
          )}

        </section>

        {/* Right Sticky Side Panel Column - Core Stats overview + dynamic live gauge always visible */}
        <section className="lg:col-span-4 space-y-5 no-print" id="sticky-side-panel">
          
          {/* Active project specs */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-5 space-y-4" id="project-specs-panel">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-brand-primary font-bold">Objetivo do Projeto</span>
              <p className="text-xs font-medium text-brand-text leading-relaxed mt-1">{project.objective}</p>
            </div>

            {project.motivation && (
              <div className="border-t border-brand-border/60 pt-3">
                <span className="text-[9px] font-mono uppercase tracking-wider text-pink-600 font-bold flex items-center gap-1">
                  <span>Qual necessidade humana motivou este projeto?</span>
                </span>
                <p className="text-xs font-medium text-brand-text leading-relaxed mt-1 italic">
                  "{project.motivation}"
                </p>
              </div>
            )}
            
            <div className="border-t border-brand-border pt-3 flex justify-between text-xs text-brand-muted">
              <div>
                <span className="block text-[10px] font-mono text-brand-muted/80">Criado em:</span>
                <span className="font-semibold text-brand-text">{new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-mono text-brand-muted/80 font-semibold text-brand-primary">Processo ID:</span>
                <span className="font-mono uppercase text-brand-text">{project.id.substring(0, 6)}</span>
              </div>
            </div>
          </div>

          {/* Quick Realtime score preview */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-5 space-y-3" id="live-indicator-panel">
            <span className="text-[9px] font-mono uppercase tracking-wider text-brand-muted font-bold block">Conformidade Atual</span>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold font-mono text-brand-text tracking-tight">
                  {scoreBreakdown.score}
                  <span className="text-xs text-brand-muted font-normal ml-0.5">/100</span>
                </div>
                <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-bg text-brand-muted">
                  {getScoreBadgeText(scoreBreakdown.score).label}
                </span>
              </div>

              {/* Micro bar stats mini display */}
              <div className="w-16 h-16 relative flex items-center justify-center">
                <div className="inset-0 absolute rounded-full border-4 border-brand-border" />
                <div 
                  className="font-mono text-[10px] font-medium text-brand-primary"
                  title="Diversidade de dados"
                >
                  {Math.round(scoreBreakdown.diversityFactor * 100)}% Div
                </div>
              </div>
            </div>

            <div className="border-t border-brand-border pt-3 text-[10px] text-brand-muted leading-relaxed font-sans flex items-start gap-1.5">
              <span>💡</span>
              <p>Adicione mais categorias de evidências de design para diversificar seu gráfico e expandir o HumanTrace score.</p>
            </div>
          </div>

          {/* Detailed evidence list tracker */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-5 space-y-3" id="summary-metrics-panel">
            <span className="text-[9px] font-mono uppercase tracking-wider text-brand-muted font-bold block">Auditoria de Evidências</span>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-brand-muted">Decisões de Design:</span>
                <span className="font-mono font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">{scoreBreakdown.decisionsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-muted">Referências Catalogadas:</span>
                <span className="font-mono font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">{scoreBreakdown.referencesCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-muted">Reflexões Teóricas:</span>
                <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{scoreBreakdown.reflectionsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-muted">Versões Registradas:</span>
                <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{scoreBreakdown.versionsCount}</span>
              </div>
            </div>

            <div className="border-t border-brand-border pt-3">
              <button
                id="btn-workspace-goto-cert"
                onClick={() => setActiveTab('certificate')}
                className="w-full bg-brand-bg hover:bg-brand-border text-brand-muted hover:text-brand-primary text-[11px] font-mono py-2 rounded-lg text-center font-bold border border-brand-border transition-colors cursor-pointer inline-block"
              >
                Visualizar Certificado Final
              </button>
            </div>
          </div>

        </section>

      </main>

    </div>
  );
}
