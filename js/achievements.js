// ============================================
//  APHELION — Achievement Engine
//  achievements.js
// ============================================

// ── Definitions ───────────────────────────────

const ACHIEVEMENT_DEFS = {

  // ── Milestones ──────────────────────────────
  first_dock: {
    category: 'Operations',
    title:    'First Berth Secured',
    detail:   'Initial docking operation logged. Guild network access confirmed.',
  },
  first_salvage: {
    category: 'Operations',
    title:    'Salvage Operations Commenced',
    detail:   'First field salvage operation conducted. Harrow unit activated.',
  },
  first_contract: {
    category: 'Operations',
    title:    'Contract Registry Entry',
    detail:   'First contract accepted from a faction bulletin board.',
  },
  first_contract_complete: {
    category: 'Operations',
    title:    'Contract Fulfilled',
    detail:   'First contract completed and payment received.',
  },
  first_contract_speed: {
    category: 'Operations',
    title:    'Ahead of Schedule',
    detail:   'Contract completed within 60% of the allotted time. Speed bonus applied.',
  },
  contract_abandoned: {
    category: 'Operations',
    title:    'Contract Abandoned',
    detail:   'A contract was abandoned. Reputation penalty applied. Guild notation made.',
  },
  contracts_completed_5: {
    category: 'Operations',
    title:    'Five Contracts Fulfilled',
    detail:   'Cumulative contract record: 5 completed.',
  },
  contracts_completed_10: {
    category: 'Operations',
    title:    'Ten Contracts Fulfilled',
    detail:   'Cumulative contract record: 10 completed.',
  },
  contracts_completed_25: {
    category: 'Operations',
    title:    'Twenty-Five Contracts Fulfilled',
    detail:   'Cumulative contract record: 25 completed. Noted by the Guild.',
  },

  // ── Exploration ─────────────────────────────
  first_deepscan: {
    category: 'Survey',
    title:    'Deep Survey Initiated',
    detail:   'First astrographic deep scan conducted. Data entered into memory matrix.',
  },
  first_cluster_sweep: {
    category: 'Survey',
    title:    'Cluster Survey Conducted',
    detail:   'First full cluster sweep completed. Multi-system astrographic record established.',
  },
  systems_charted_5: {
    category: 'Survey',
    title:    'Five Systems Charted',
    detail:   'Astrographic record: 5 systems surveyed to deep scan standard.',
  },
  systems_charted_10: {
    category: 'Survey',
    title:    'Ten Systems Charted',
    detail:   'Astrographic record: 10 systems surveyed to deep scan standard.',
  },
  systems_charted_25: {
    category: 'Survey',
    title:    'Twenty-Five Systems Charted',
    detail:   'Astrographic record: 25 systems. Guild data archive contribution noted.',
  },
  systems_charted_50: {
    category: 'Survey',
    title:    'Fifty Systems Charted',
    detail:   'Astrographic record: 50 systems. Significant cartographic contribution.',
  },
  first_astro_sale: {
    category: 'Survey',
    title:    'Astrographic Data Transferred',
    detail:   'First sale of astrographic data to the Assayer\'s Guild. Memory matrix partially cleared.',
  },
  xeno_system_visited: {
    category: 'Survey',
    title:    'Anomalous Reading Logged',
    detail:   'Vessel entered a system flagged for anomalous sensor returns. No further notation.',
  },

  // ── Reputation ──────────────────────────────
  faction_trusted_guild: {
    category: 'Standing',
    title:    'Guild: Trusted',
    detail:   'Standing with the Assayer\'s Guild elevated to TRUSTED. Preferential rates apply.',
  },
  faction_trusted_pelk: {
    category: 'Standing',
    title:    'Pelk Logistics: Trusted',
    detail:   'Standing with Pelk Logistics elevated to TRUSTED.',
  },
  faction_trusted_colonial: {
    category: 'Standing',
    title:    'CCC: Trusted',
    detail:   'Standing with Colonial Colonies Command elevated to TRUSTED.',
  },
  faction_trusted_feral: {
    category: 'Standing',
    title:    'Feral Network: Trusted',
    detail:   'Standing with Feral settlements elevated to TRUSTED. This is not on record.',
  },
  faction_trusted_independent: {
    category: 'Standing',
    title:    'Independent Operators: Trusted',
    detail:   'Standing with Independent operators elevated to TRUSTED.',
  },
  faction_hostile_guild: {
    category: 'Standing',
    title:    'Guild: Hostile',
    detail:   'Standing with the Assayer\'s Guild degraded to HOSTILE. Docking refused at Guild stations.',
  },
  faction_hostile_pelk: {
    category: 'Standing',
    title:    'Pelk Logistics: Hostile',
    detail:   'Standing with Pelk Logistics degraded to HOSTILE.',
  },
  faction_hostile_colonial: {
    category: 'Standing',
    title:    'CCC: Hostile',
    detail:   'Standing with Colonial Colonies Command degraded to HOSTILE. Patrol vessels will engage.',
  },
  faction_hostile_feral: {
    category: 'Standing',
    title:    'Feral Network: Hostile',
    detail:   'Standing with Feral settlements degraded to HOSTILE.',
  },

  // ── Combat ──────────────────────────────────
  first_kill: {
    category: 'Combat',
    title:    'First Vessel Destroyed',
    detail:   'First confirmed enemy vessel destruction on record.',
  },
  survived_critical_hull: {
    category: 'Combat',
    title:    'Hull Breach — Survived',
    detail:   'Vessel survived combat with hull integrity below 20%. Structural assessment recommended.',
  },
  survived_unknown: {
    category: 'Combat',
    title:    'Unknown Contact — Survived',
    detail:   'Vessel survived engagement with an unregistered contact of unknown classification.',
  },
  enemy_destroyed_feral: {
    category: 'Combat',
    title:    'Feral Vessel Destroyed',
    detail:   'Feral raider vessel confirmed destroyed.',
  },
  enemy_destroyed_pirate: {
    category: 'Combat',
    title:    'Pirate Vessel Destroyed',
    detail:   'Unregistered pirate vessel confirmed destroyed.',
  },
  enemy_destroyed_patrol: {
    category: 'Combat',
    title:    'Faction Patrol Destroyed',
    detail:   'Faction patrol vessel confirmed destroyed. Diplomatic consequences likely.',
  },
  enemy_destroyed_unknown: {
    category: 'Combat',
    title:    'Unknown Vessel Destroyed',
    detail:   'Unclassified contact confirmed destroyed. No registry match on record.',
  },

  // ── Economic ────────────────────────────────
  first_veydrite_sale: {
    category: 'Economic',
    title:    'Veydrite Sale Recorded',
    detail:   'First veydrite sale processed through Guild assessment terminal.',
  },
  scrip_1000: {
    category: 'Economic',
    title:    'Scrip Reserve: 1,000 CR',
    detail:   'Liquid scrip holdings reached 1,000 CR.',
  },
  scrip_5000: {
    category: 'Economic',
    title:    'Scrip Reserve: 5,000 CR',
    detail:   'Liquid scrip holdings reached 5,000 CR.',
  },
  scrip_10000: {
    category: 'Economic',
    title:    'Scrip Reserve: 10,000 CR',
    detail:   'Liquid scrip holdings reached 10,000 CR. Noted.',
  },
  veydrite_sold_100: {
    category: 'Economic',
    title:    'Veydrite Volume: 100 kg',
    detail:   'Cumulative veydrite sold: 100 kg.',
  },
  veydrite_sold_500: {
    category: 'Economic',
    title:    'Veydrite Volume: 500 kg',
    detail:   'Cumulative veydrite sold: 500 kg. Significant extraction record.',
  },

  // ── Survival ────────────────────────────────
  days_survived_10: {
    category: 'Survival',
    title:    'Ten Days in the Field',
    detail:   'Vessel operational for 10 standard days.',
  },
  days_survived_25: {
    category: 'Survival',
    title:    'Twenty-Five Days in the Field',
    detail:   'Vessel operational for 25 standard days.',
  },
  days_survived_50: {
    category: 'Survival',
    title:    'Fifty Days in the Field',
    detail:   'Vessel operational for 50 standard days.',
  },
  days_survived_100: {
    category: 'Survival',
    title:    'One Hundred Days in the Field',
    detail:   'Vessel operational for 100 standard days. Long-haul record.',
  },
};

// ── Award function ────────────────────────────

function awardAchievement(id, playerState, extraDetail) {
  if (!playerState.achievements) playerState.achievements = [];

  // Don't award duplicates
  if (playerState.achievements.some(a => a.id === id)) return null;

  const def = ACHIEVEMENT_DEFS[id];
  if (!def) return null;

  const detail = extraDetail
    ? def.detail + ' ' + extraDetail
    : def.detail;

  const entry = {
    id,
    category:  def.category,
    title:     def.title,
    detail,
    day:       playerState.currentDay,
    timestamp: Date.now(),
  };

  playerState.achievements.push(entry);
  return entry;
}

// ── Check helpers ─────────────────────────────

function checkAchievements(playerState, context) {
  const awarded = [];

  function award(id, extra) {
    const result = awardAchievement(id, playerState, extra);
    if (result) awarded.push(result);
  }

  const achievements = playerState.achievements || [];
  const stats        = playerState.stats        || {};

  // Survival milestones
  const day = playerState.currentDay;
  if (day >= 10)  award('days_survived_10');
  if (day >= 25)  award('days_survived_25');
  if (day >= 50)  award('days_survived_50');
  if (day >= 100) award('days_survived_100');

  // Scrip milestones
  const cr = playerState.credits || 0;
  if (cr >= 1000)  award('scrip_1000');
  if (cr >= 5000)  award('scrip_5000');
  if (cr >= 10000) award('scrip_10000');

  // Charted systems
  const charted = (playerState.astrographics || []).filter(a => a.quality === 'deep').length;
  if (charted >= 5)  award('systems_charted_5');
  if (charted >= 10) award('systems_charted_10');
  if (charted >= 25) award('systems_charted_25');
  if (charted >= 50) award('systems_charted_50');

  // Contracts completed
  const completed = stats.contractsCompleted || 0;
  if (completed >= 5)  award('contracts_completed_5');
  if (completed >= 10) award('contracts_completed_10');
  if (completed >= 25) award('contracts_completed_25');

  // Context-specific checks
  if (context) {
    if (context.type === 'dock' && !achievements.some(a => a.id === 'first_dock')) {
      award('first_dock');
    }
    if (context.type === 'salvage' && !achievements.some(a => a.id === 'first_salvage')) {
      award('first_salvage');
    }
    if (context.type === 'contract_accepted' && !achievements.some(a => a.id === 'first_contract')) {
      award('first_contract');
    }
    if (context.type === 'contract_complete') {
      if (!achievements.some(a => a.id === 'first_contract_complete')) award('first_contract_complete');
      if (context.fast && !achievements.some(a => a.id === 'first_contract_speed')) award('first_contract_speed');
    }
    if (context.type === 'contract_abandoned') {
      award('contract_abandoned');
    }
    if (context.type === 'deepscan' && !achievements.some(a => a.id === 'first_deepscan')) {
      award('first_deepscan', 'System: ' + context.systemName + '.');
    }
    if (context.type === 'cluster_sweep' && !achievements.some(a => a.id === 'first_cluster_sweep')) {
      award('first_cluster_sweep', 'Cluster: ' + context.clusterName + '.');
    }
    if (context.type === 'astro_sale' && !achievements.some(a => a.id === 'first_astro_sale')) {
      award('first_astro_sale');
    }
    if (context.type === 'veydrite_sale') {
      if (!achievements.some(a => a.id === 'first_veydrite_sale')) award('first_veydrite_sale');
      const totalSold = (stats.veydriteSold || 0);
      if (totalSold >= 100) award('veydrite_sold_100');
      if (totalSold >= 500) award('veydrite_sold_500');
    }
    if (context.type === 'kill') {
      if (!achievements.some(a => a.id === 'first_kill')) {
        award('first_kill', 'Vessel class: ' + context.enemyClass + '.');
      }
      const killId = 'enemy_destroyed_' + context.attackerKey;
      if (ACHIEVEMENT_DEFS[killId]) award(killId);
    }
    if (context.type === 'survived_combat') {
      if (context.hullPct < 20) award('survived_critical_hull');
      if (context.attackerKey === 'unknown') award('survived_unknown');
    }
    if (context.type === 'rep_change') {
      const key    = context.factionKey;
      const tier   = context.tier;
      if (tier === 'TRUSTED') {
        const achId = 'faction_trusted_' + key;
        if (ACHIEVEMENT_DEFS[achId]) award(achId);
      }
      if (tier === 'HOSTILE') {
        const achId = 'faction_hostile_' + key;
        if (ACHIEVEMENT_DEFS[achId]) award(achId);
      }
    }
    if (context.type === 'xeno_system') {
      award('xeno_system_visited');
    }
  }

  return awarded;
}

// ── Render ────────────────────────────────────

function renderAchievements(playerState) {
  const achievements = playerState.achievements || [];

  if (achievements.length === 0) {
    return [
      '',
      '  ── GUILD RECORD ARCHIVE ──────────────────────────────────────',
      '',
      '  No entries on record.',
      '  The archive updates as operations are conducted.',
      '',
    ].join('\n');
  }

  // Group by category
  const grouped = {};
  achievements.forEach(a => {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push(a);
  });

  const lines = [
    '',
    '  ── GUILD RECORD ARCHIVE ──────────────────────────────────────',
    '',
    '  ' + achievements.length + ' record(s) on file.',
    '',
  ];

  Object.keys(grouped).forEach(cat => {
    lines.push('  ── ' + cat.toUpperCase() + ' ' + '─'.repeat(Math.max(0, 52 - cat.length)));
    lines.push('');
    grouped[cat].forEach(a => {
      lines.push('  [Day ' + String(a.day).padEnd(4) + ']  ' + a.title);
      lines.push('           ' + a.detail);
      lines.push('');
    });
  });

  return lines.join('\n');
}
