/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Project, Evidence, EvidenceType } from './types';
import { SEED_PROJECTS, SEED_EVIDENCES } from './utils/seedData';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import ProjectWorkspaceView from './components/ProjectWorkspaceView';
import NewProjectView from './components/NewProjectView';

// Utility helper to generate secure/clean random IDs
function generateUUID(): string {
  return 'ht-id-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36).substring(4);
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  // Initialize and load from LocalStorage on mount
  useEffect(() => {
    // 1. User Loading
    const storedUser = localStorage.getItem('ht_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Falha ao ler usuário do LocalStorage', err);
      }
    }

    // 2. Projects & Evidences loading
    const storedProjects = localStorage.getItem('ht_projects');
    const storedEvidences = localStorage.getItem('ht_evidences');

    let loadedProjects = SEED_PROJECTS;
    let loadedEvidences = SEED_EVIDENCES;

    if (storedProjects && storedEvidences) {
      try {
        loadedProjects = JSON.parse(storedProjects);
        loadedEvidences = JSON.parse(storedEvidences);
        setProjects(loadedProjects);
        setEvidences(loadedEvidences);
      } catch (e) {
        console.error('Falha ao ler portfólio do LocalStorage, carregando seeds...');
        loadSeeds();
      }
    } else {
      // First structural launch: seed the memory Sandbox
      loadSeeds();
    }

    // 3. Check for URL query parameter router for verification audit
    const params = new URLSearchParams(window.location.search);
    const queryProjectId = params.get('project_id') || params.get('project');
    if (queryProjectId) {
      if (!storedUser) {
        const auditor = {
          name: 'Auditor Humano Externo',
          role: 'Auditor de Integridade'
        };
        localStorage.setItem('ht_user', JSON.stringify(auditor));
        setUser(auditor);
      }
      setActiveProjectId(queryProjectId);
    }
  }, []);

  const loadSeeds = () => {
    localStorage.setItem('ht_projects', JSON.stringify(SEED_PROJECTS));
    localStorage.setItem('ht_evidences', JSON.stringify(SEED_EVIDENCES));
    setProjects(SEED_PROJECTS);
    setEvidences(SEED_EVIDENCES);
  };

  const handleLogin = (newUser: User) => {
    localStorage.setItem('ht_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('ht_user');
    setUser(null);
    setActiveProjectId(null);
  };

  const handleResetSeed = () => {
    // Load standard portfolio items while preserving any user-made items
    const userMadeProjects = projects.filter(p => !p.id.startsWith('seed-'));
    const userMadeEvidences = evidences.filter(e => !e.projectId.startsWith('seed-'));

    const mergedProjects = [...SEED_PROJECTS, ...userMadeProjects];
    const mergedEvidences = [...SEED_EVIDENCES, ...userMadeEvidences];

    localStorage.setItem('ht_projects', JSON.stringify(mergedProjects));
    localStorage.setItem('ht_evidences', JSON.stringify(mergedEvidences));
    
    setProjects(mergedProjects);
    setEvidences(mergedEvidences);
  };

  const handleCreateProject = (name: string, objective: string, category: string, motivation: string) => {
    const newProject: Project = {
      id: generateUUID(),
      name,
      objective,
      motivation,
      category,
      createdAt: new Date().toISOString(),
      score: 0 // Will recalculate dynamically when registering evidences
    };

    const updatedProjects = [newProject, ...projects];
    localStorage.setItem('ht_projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    setIsNewProjectOpen(false);
    
    // Auto-onboard: Immediately open the workspace of the newly created project
    setActiveProjectId(newProject.id);
  };

  const handleAddEvidence = (type: EvidenceType, title: string, description: string) => {
    if (!activeProjectId) return;

    const newEvidence: Evidence = {
      id: generateUUID(),
      projectId: activeProjectId,
      type,
      title,
      description,
      timestamp: new Date().toISOString()
    };

    const updatedEvidences = [...evidences, newEvidence];
    localStorage.setItem('ht_evidences', JSON.stringify(updatedEvidences));
    setEvidences(updatedEvidences);
  };

  const handleDeleteEvidence = (evidenceId: string) => {
    const updatedEvidences = evidences.filter(e => e.id !== evidenceId);
    localStorage.setItem('ht_evidences', JSON.stringify(updatedEvidences));
    setEvidences(updatedEvidences);
  };

  const handleUpdateProjectScore = (projectId: string, newScore: number) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, score: newScore };
      }
      return p;
    });
    localStorage.setItem('ht_projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  // Router dispatcher
  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <>
      {activeProject ? (
        <ProjectWorkspaceView
          user={user}
          project={activeProject}
          evidences={evidences}
          onAddEvidence={handleAddEvidence}
          onDeleteEvidence={handleDeleteEvidence}
          onBackToDashboard={() => setActiveProjectId(null)}
          onUpdateProjectScore={handleUpdateProjectScore}
        />
      ) : (
        <DashboardView
          user={user}
          projects={projects}
          onSelectProject={(id) => setActiveProjectId(id)}
          onOpenNewProject={() => setIsNewProjectOpen(true)}
          onLogout={handleLogout}
          onResetSeed={handleResetSeed}
        />
      )}

      {/* New Project overlay trigger */}
      {isNewProjectOpen && (
        <NewProjectView
          onClose={() => setIsNewProjectOpen(false)}
          onCreateProject={handleCreateProject}
        />
      )}
    </>
  );
}
