// js/commands.js
// Command Parser — Stage 2
// Aphelion v0.2.0-dev

// ─── State ────────────────────────────────────────────────────────────────────

let galaxy = null;
let playerState = {
  location: null,       // { quadrantIndex, clusterIndex, systemName }
  cargo: [],
  credits: 0,
  veydrite: 0,
  ship: 'Wayward-class Prospector',
};

// ─── Init ─────────────────────────────────────────────────────────────────────

function initCommands(seed) {
  const naming = new Naming(seed);
  galaxy = generateGalaxy(seed, naming);

  // Player starts in quadrant 0, first anchor system
  const q0 = galaxy.quadrants[0];
  const startCluster = q0.clusters[0];
  const startSystem = startCluster.systems.find(s => s.isAnchor) ?? startCluster.systems[0];

  playerState.location = {
    quadrantIndex: 0,
    clusterName: startCluster.name,
    systemName: startSystem.name,
  };

  return galaxy;
}

// ─── Command Dispatch ─────────────────────────────────────────────────────────

function handleCommand(raw) {
  const input = raw.trim().toLowerCase();
  const [cmd, ...args] = input.split(/\s+/);

  switch (cmd) {
    case 'help':    return cmdHelp();
    case 'scan':    return cmdScan(args);
    case 'nav':     return cmdNav(args);
    case 'status':  return cmdStatus();
    case 'galaxy':  return renderGalaxyOverview(galaxy);
    case 'look':
    case 'where':   return cmdWhere();
    case '':        return '';
    default:        return `  [UNKNOWN] Command not recognized: "${cmd}"\n  Type 'help' for available commands.`;
  }
}

// ─── Commands ─────────────────────────────────────────────────────────────────

function cmdHelp() {
  return `
  ── TERMINAL COMMANDS ───────────────────────────────────────────

  galaxy              — display full quadrant index
  scan <1-8>          — survey a specific quadrant
  where               — current location
  nav <system name>   — navigate to a named system (partial match)
  status              — ship and cargo readout

  ── COMING IN STAGE 3 ───────────────────────────────────────────

  dock                — dock at nearest station
  trade               — open trade interface
  salvage             — begin salvage operation
  survey              — detailed planetary survey
  jump                — initiate jump to adjacent system
`;
}

function cmdScan(args) {
  if (!galaxy) return '  [ERROR] Galaxy not initialized.';

  if (args.length === 0) {
    return renderGalaxyOverview(galaxy);
  }

  const index = parseInt(args[0]) - 1;
  if (isNaN(index) || index < 0 || index >= galaxy.quadrants.length) {
    return `  [ERROR] Invalid quadrant. Use scan <1-8>.`;
  }

  return renderQuadrantDetail(galaxy, index);
}

function cmdNav(args) {
  if (!galaxy) return '  [ERROR] Galaxy not initialized.';
  if (args.length === 0) return '  [USAGE] nav <system name>';

  const query = args.join(' ').toLowerCase();

  // Search all systems
  for (let qi = 0; qi < galaxy.quadrants.length; qi++) {
    const q = galaxy.quadrants[qi];
    for (let ci = 0; ci < q.clusters.length; ci++) {
      const cluster = q.clusters[ci];
      for (const sys of cluster.systems) {
        if (sys.name.toLowerCase().includes(query)) {
          playerState.location = {
            quadrantIndex: qi,
            clusterName: cluster.name,
            systemName: sys.name,
          };
          const travelTime = 2 + Math.floor(Math.random() * 6);
          return `
  [NAV] Plotting course to ${sys.name}...
  Quadrant: ${q.name}  |  Cluster: ${cluster.name}
  Star Class: ${sys.starClass}  |  Bodies: ${sys.bodies.length}  |  Hazard: ${'▲'.repeat(sys.hazard)}
  Estimated transit: ${travelTime} standard days

  Arrived. Type 'where' to survey this system.
`;
        }
      }
    }
  }

  return `  [NAV] No system matching "${args.join(' ')}" found in catalog.`;
}

function cmdWhere() {
  if (!playerState.location) return '  [STATUS] No location fix.';

  const loc = playerState.location;
  const q = galaxy.quadrants[loc.quadrantIndex];
  const cluster = q.clusters.find(c => c.name === loc.clusterName);
  const sys = cluster?.systems.find(s => s.name === loc.systemName);

  if (!sys) return '  [ERROR] Location data corrupted.';

  const stations = sys.bodies.filter(b => b.hasStation).length;
  const ruins = sys.bodies.filter(b => b.hasRuin).length;
  const veydrite = sys.bodies.filter(b => b.veydrite).length;

  return `
  ── CURRENT POSITION ────────────────────────────────────────────

  System:   ${sys.name}
  Cluster:  ${cluster.name}
  Quadrant: ${q.name}  [${q.state}]
  Star:     ${sys.starClass}-class  |  Bodies: ${sys.bodies.length}

  ── LOCAL SURVEY ────────────────────────────────────────────────

  Stations:       ${stations > 0 ? stations + ' detected' : 'none'}
  Ruin sites:     ${ruins > 0 ? ruins + ' surveyed' : 'none'}
  Veydrite sign:  ${veydrite > 0 ? 'POSITIVE — ' + veydrite + ' body/bodies' : 'negative'}
  Jump points:    ${sys.jumpPoints} outbound
  Hazard:         ${'▲'.repeat(sys.hazard)}${'△'.repeat(5 - sys.hazard)} (${sys.hazard}/5)
  Traffic:        ${'◉'.repeat(sys.traffic)}${'○'.repeat(5 - sys.traffic)} (${sys.traffic}/5)
`;
}

function cmdStatus() {
  return `
  ── SHIP STATUS ─────────────────────────────────────────────────

  Vessel:   ${playerState.ship}
  Veydrite: ${playerState.veydrite} kg
  Scrip:    ${playerState.credits} CR (unaffiliated)
  Cargo:    ${playerState.cargo.length === 0 ? 'empty' : playerState.cargo.join(', ')}

  Hull integrity:   ████████░░  80%
  Fuel reserve:     ██████░░░░  60%
  Jump drive:       NOMINAL

  [Stage 3 will activate full ship systems]
`;
}
