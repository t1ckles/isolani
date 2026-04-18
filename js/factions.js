// ============================================
//  APHELION — Faction & Reputation Engine
//  factions.js
//  Stage 7: Memory, Contracts, Standing
// ============================================

// ── Faction Registry ──────────────────────────

const FACTION_REGISTRY = {
  guild: {
    name:      'The Assayer\'s Guild',
    short:     'GUILD',
    color:     'neutral',
    contracts: true,
    bulletin:  'Guild Survey Board',
  },
  pelk: {
    name:      'Pelk Logistics',
    short:     'PELK',
    color:     'commercial',
    contracts: true,
    bulletin:  'Pelk Contract Terminal',
  },
  colonial: {
    name:      'Colonial Colonies Command',
    short:     'CCC',
    color:     'military',
    contracts: false,
    bulletin:  'CCC Dispatch',
  },
  feral: {
    name:      'Feral Settlement',
    short:     'FERAL',
    color:     'hostile',
    contracts: false,
    bulletin:  null,
  },
  independent: {
    name:      'Independent',
    short:     'INDP',
    color:     'neutral',
    contracts: false,
    bulletin:  null,
  },
  forbidden: {
    name:      'Unknown Authority',
    short:     '????',
    color:     'unknown',
    contracts: false,
    bulletin:  null,
  },
};

// ── Reputation Tiers ──────────────────────────

function repTier(score) {
  if (score > 60)  return 'TRUSTED';
  if (score > 0)   return 'KNOWN';
  if (score > -61) return 'WATCHED';
  return 'HOSTILE';
}

function repBar(score) {
  // 20 char bar centered at 0
  // positive fills right, negative fills left
  const normalized = Math.round((score + 100) / 10); // 0-20
  const filled     = Math.max(0, Math.min(20, normalized));
  return '█'.repeat(filled) + '░'.repeat(20 - filled);
}

// ── Reputation Engine ─────────────────────────

const reputation = {};

function getRep(factionKey) {
  if (reputation[factionKey] === undefined) return null; // never met
  return reputation[factionKey];
}

function hasMet(factionKey) {
  return reputation[factionKey] !== undefined;
}

function meetFaction(factionKey) {
  if (!hasMet(factionKey)) {
    reputation[factionKey] = 0;
  }
}

function adjustRep(factionKey, delta, reason) {
  meetFaction(factionKey);
  const before = reputation[factionKey];
  reputation[factionKey] = Math.max(-100, Math.min(100, before + delta));
  const after  = reputation[factionKey];
  const change = delta > 0 ? '+' + delta : '' + delta;

  // Check for tier change
  const tierBefore = repTier(before);
  const tierAfter  = repTier(after);
  const tierChange = tierBefore !== tierAfter
    ? '  [REP] Standing with ' + FACTION_REGISTRY[factionKey].short + ' changed: ' + tierBefore + ' → ' + tierAfter
    : null;

  return {
    factionKey,
    change,
    after,
    reason,
    tierChange,
  };
}

function renderRepChange(result) {
  if (!result) return '';
  const lines = [];
  const faction = FACTION_REGISTRY[result.factionKey];
  if (!faction) return '';
  lines.push('  [REP] ' + faction.name + '  ' + result.change + '  (' + result.after + ')  — ' + result.reason);
  if (result.tierChange) lines.push(result.tierChange);
  return lines.join('\n');
}

// ── Reputation Display ────────────────────────

function renderRep(currentSystem) {
  const lines = [];
  lines.push('');
  lines.push('  ── FACTION STANDING ──────────────────────────────────────────');
  lines.push('');

  const keys = Object.keys(FACTION_REGISTRY);
  let anyMet = false;

  keys.forEach(key => {
    const faction = FACTION_REGISTRY[key];
    if (!hasMet(key)) {
      lines.push('  ' + faction.name.padEnd(28) + ' UNKNOWN    ---   ' + '░'.repeat(20));
    } else {
      const score = reputation[key];
      const tier  = repTier(score).padEnd(10);
      const score_str = (score >= 0 ? '+' : '') + score;
      lines.push('  ' + faction.name.padEnd(28) + ' ' + tier + ' ' + score_str.padEnd(5) + '  ' + repBar(score));
      anyMet = true;
    }
  });

  if (!anyMet) {
    lines.push('  No faction contacts established.');
    lines.push('  Dock at a station to begin building standing.');
  }

  lines.push('');

  // Show local faction if in a system with stations
  if (currentSystem) {
    const localFactions = currentSystem.bodies
      .filter(b => b.hasStation && b.factionKey)
      .map(b => b.factionKey);
    if (localFactions.length > 0) {
      lines.push('  ── LOCAL FACTIONS ────────────────────────────────────────────');
      lines.push('');
      localFactions.forEach(key => {
        const faction = FACTION_REGISTRY[key];
        const score   = getRep(key);
        const tier    = score === null ? 'UNKNOWN' : repTier(score);
        lines.push('  ' + faction.name + '  [' + tier + ']');
      });
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ── Contract Engine ───────────────────────────

const CONTRACT_TEMPLATES = [
  {
    faction:     'guild',
    type:        'survey',
    title:       'Veydrite Survey',
    description: 'Conduct a veydrite survey at [TARGET] and return readings.',
    payment:     280,
    repReward:   10,
    timeLimitDays: 8,
    difficulty:  1,
  },
  {
    faction:     'guild',
    type:        'survey',
    title:       'Ruin Assessment',
    description: 'Survey ruins at [TARGET] and file a condition report.',
    payment:     320,
    repReward:   12,
    timeLimitDays: 10,
    difficulty:  2,
  },
  {
    faction:     'pelk',
    type:        'delivery',
    title:       'Fuel Cell Delivery',
    description: 'Deliver fuel cells from here to [TARGET].',
    payment:     340,
    repReward:   10,
    timeLimitDays: 12,
    difficulty:  1,
  },
  {
    faction:     'pelk',
    type:        'delivery',
    title:       'Cargo Run',
    description: 'Transport sealed cargo to [TARGET]. Do not open.',
    payment:     420,
    repReward:   14,
    timeLimitDays: 15,
    difficulty:  2,
  },
  {
    faction:     'pelk',
    type:        'delivery',
    title:       'Priority Shipment',
    description: 'Time-sensitive delivery to [TARGET]. Speed matters.',
    payment:     500,
    repReward:   16,
    timeLimitDays: 6,
    difficulty:  3,
  },
];

// Active contracts
let activeContracts  = [];
let contractIdCounter = 1;

function generateContracts(factionKey, galaxy, currentLocation) {
  // Pick 1-3 contracts for this faction
  const templates = CONTRACT_TEMPLATES.filter(t => t.faction === factionKey);
  if (templates.length === 0) return [];

  const count     = 1 + Math.floor(Math.random() * 2);
  const contracts = [];

  for (let i = 0; i < count; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Pick a random target system that isn't the current one
    const targetSystem = pickRandomSystem(galaxy, currentLocation);
    if (!targetSystem) continue;

    contracts.push({
      id:          contractIdCounter++,
      faction:     factionKey,
      type:        template.type,
      title:       template.title,
      description: template.description.replace('[TARGET]', targetSystem.name),
      target:      targetSystem.name,
      payment:     template.payment,
      repReward:   template.repReward,
      timeLimitDays: template.timeLimitDays,
      difficulty:  template.difficulty,
      issuedDay:   null, // set when accepted
      accepted:    false,
      completed:   false,
      failed:      false,
    });
  }

  return contracts;
}

function pickRandomSystem(galaxy, excludeLocation) {
  const allSystems = [];
  galaxy.quadrants.forEach(q => {
    q.clusters.forEach(cluster => {
      cluster.systems.forEach(sys => {
        if (sys.name !== excludeLocation.systemName) {
          allSystems.push(sys);
        }
      });
    });
  });
  if (allSystems.length === 0) return null;
  return allSystems[Math.floor(Math.random() * allSystems.length)];
}

function renderBulletin(factionKey, contracts) {
  const faction = FACTION_REGISTRY[factionKey];
  const lines   = [];

  lines.push('');
  lines.push('  ── ' + (faction.bulletin || 'CONTRACT BOARD') + ' ────────────────────────────────');
  lines.push('');

  if (contracts.length === 0) {
    lines.push('  No contracts available at this time.');
    lines.push('');
    return lines.join('\n');
  }

  contracts.forEach((c, i) => {
    const diff = '★'.repeat(c.difficulty) + '☆'.repeat(3 - c.difficulty);
    lines.push('  [' + (i + 1) + '] ' + c.title + '  ' + diff);
    lines.push('      ' + c.description);
    lines.push('      Payment: ' + c.payment + ' CR  |  Time limit: ' + c.timeLimitDays + ' days  |  Rep: +' + c.repReward);
    lines.push('');
  });

  lines.push('  Type "accept <number>" to take a contract.');
  lines.push('');

  return lines.join('\n');
}

function acceptContract(index, contracts, currentDay) {
  const contract = contracts[index];
  if (!contract) return { error: 'Invalid contract number.' };

  // Check if already have an active contract of same type
  const existing = activeContracts.find(c => !c.completed && !c.failed);
  if (existing) {
    return { error: 'You already have an active contract. Complete or abandon it first.' };
  }

  contract.accepted  = true;
  contract.issuedDay = currentDay;
  activeContracts.push(contract);

  return { contract };
}

function checkContractStatus(contract, currentDay, currentSystemName) {
  if (!contract || contract.completed || contract.failed) return null;

  const daysElapsed = currentDay - contract.issuedDay;
  const daysLeft    = contract.timeLimitDays - daysElapsed;

  // Check if time ran out
  if (daysLeft <= 0) {
    contract.failed = true;
    return { status: 'failed', reason: 'Time limit exceeded.' };
  }

  // Check if at target (for delivery/survey)
  if (currentSystemName === contract.target) {
    return { status: 'ready', daysLeft, daysElapsed };
  }

  return { status: 'active', daysLeft, daysElapsed };
}

function completeContract(contract, daysElapsed, playerState) {
  contract.completed = true;

  const onTime    = daysElapsed <= contract.timeLimitDays;
  const fast      = daysElapsed <= Math.floor(contract.timeLimitDays * 0.6);
  const repEarned = fast ? contract.repReward + 3 : contract.repReward;
  const bonus     = fast ? Math.round(contract.payment * 0.1) : 0;
  const total     = contract.payment + bonus;

  playerState.credits += total;

  const repResult = adjustRep(contract.faction, repEarned,
    fast ? 'Contract completed ahead of schedule' : 'Contract completed');

  return {
    total,
    bonus,
    repEarned,
    fast,
    repResult,
  };
}

function failContract(contract) {
  contract.failed = true;
  const repResult = adjustRep(contract.faction, -15, 'Contract failed');
  return { repResult };
}

function renderActiveContract(contract, currentDay) {
  if (!contract) return '  No active contract.';

  const daysElapsed = currentDay - contract.issuedDay;
  const daysLeft    = contract.timeLimitDays - daysElapsed;
  const faction     = FACTION_REGISTRY[contract.faction];
  const diff        = '★'.repeat(contract.difficulty) + '☆'.repeat(3 - contract.difficulty);
  const urgent      = daysLeft <= 2 ? '  [!] URGENT' : '';

  return [
    '',
    '  ── ACTIVE CONTRACT ───────────────────────────────────────────',
    '',
    '  ' + contract.title + '  ' + diff + '  [' + faction.short + ']',
    '  ' + contract.description,
    '',
    '  Target   : ' + contract.target,
    '  Payment  : ' + contract.payment + ' CR  +  Rep: ' + contract.repReward,
    '  Days left: ' + daysLeft + ' / ' + contract.timeLimitDays + urgent,
    '',
  ].join('\n');
}
