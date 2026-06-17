/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Evidence, ScoreBreakdown } from '../types';

export function calculateHumanTraceScore(evidences: Evidence[]): ScoreBreakdown {
  const decisions = evidences.filter(e => e.type === 'decision');
  const references = evidences.filter(e => e.type === 'reference');
  const reflections = evidences.filter(e => e.type === 'reflection');
  const versions = evidences.filter(e => e.type === 'version');

  const decisionsCount = decisions.length;
  const referencesCount = references.length;
  const reflectionsCount = reflections.length;
  const versionsCount = versions.length;

  // 1. Calculate Diversity Multiplier
  // We want to encourage designers to record multiple types of evidence.
  let uniqueTypesCount = 0;
  if (decisionsCount > 0) uniqueTypesCount++;
  if (referencesCount > 0) uniqueTypesCount++;
  if (reflectionsCount > 0) uniqueTypesCount++;
  if (versionsCount > 0) uniqueTypesCount++;

  let diversityFactor = 0;
  switch (uniqueTypesCount) {
    case 0:
      diversityFactor = 0;
      break;
    case 1:
      diversityFactor = 0.45; // 45% cap if they only log one type
      break;
    case 2:
      diversityFactor = 0.70; // 70% cap
      break;
    case 3:
      diversityFactor = 0.90; // 90% cap
      break;
    case 4:
      diversityFactor = 1.0; // 100% potential index match
      break;
  }

  // 2. Volume score calculation with caps per type to avoid spam-cheating the system.
  // Decisions (critically vital human acts of judgment): 15 pts each up to 4 items (max 60)
  // References (aesthetic/technical inputs): 10 pts each up to 3 items (max 30)
  // Reflections (meta-cognitive correction): 15 pts each up to 3 items (max 45)
  // Versions (iterative file proofing): 10 pts each up to 3 items (max 30)
  const decisionsWeight = Math.min(60, decisionsCount * 15);
  const referencesWeight = Math.min(30, referencesCount * 10);
  const reflectionsWeight = Math.min(45, reflectionsCount * 15);
  const versionsWeight = Math.min(30, versionsCount * 10);

  const rawSum = decisionsWeight + referencesWeight + reflectionsWeight + versionsWeight;
  const documentationVolume = Math.min(100, rawSum);

  // 3. Final weighted calculation
  let finalScore = 0;
  if (evidences.length > 0) {
    // A baseline minimum score of 15 points if they've registered at least one human item
    const baseScore = 15;
    const computed = baseScore + (documentationVolume * 0.85);
    finalScore = Math.round(computed * diversityFactor);
  }

  // Ensure bounds
  finalScore = Math.max(0, Math.min(100, finalScore));

  return {
    score: finalScore,
    decisionsCount,
    referencesCount,
    reflectionsCount,
    versionsCount,
    diversityFactor,
    documentationVolume
  };
}
