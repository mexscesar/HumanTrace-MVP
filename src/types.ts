/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EvidenceType = 'decision' | 'reference' | 'reflection' | 'version';

export interface User {
  name: string;
  email: string;
}

export interface Evidence {
  id: string;
  projectId: string;
  type: EvidenceType;
  title: string;
  description: string;
  timestamp: string; // ISO string
}

export interface Project {
  id: string;
  name: string;
  objective: string;
  motivation?: string; // Qual necessidade humana motivou este projeto
  category: string;
  createdAt: string; // ISO string
  score: number; // HumanTrace Score (0 - 100)
}

export interface ScoreBreakdown {
  score: number;
  decisionsCount: number;
  referencesCount: number;
  reflectionsCount: number;
  versionsCount: number;
  diversityFactor: number; // 0 to 1
  documentationVolume: number; // list size weight
}
