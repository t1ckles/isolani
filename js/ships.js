// =============================================================================
// APHELION — ships.js
// Ship Registry: all 18 hull classes, compartment definitions, helper utilities
// =============================================================================

'use strict';

// ---------------------------------------------------------------------------
// COMPARTMENT DEFINITIONS
// Canonical list of all valid compartment IDs and their display names.
// ---------------------------------------------------------------------------

const COMPARTMENTS = {
  // Universal — every ship has these
  bridge:       { id: 'bridge',       label: 'Bridge',          universal: true  },
  engineering:  { id: 'engineering',  label: 'Engineering',     universal: true  },
  cargo:        { id: 'cargo',        label: 'Cargo Bay',       universal: true  },
  quarters:     { id: 'quarters',     label: 'Crew Quarters',   universal: true  },
  airlock:      { id: 'airlock',      label: 'Airlock',         universal: true  },

  // Class-specific
  reserve_tank: { id: 'reserve_tank', label: 'Reserve Tank Bay',  universal: false },
  extraction:   { id: 'extraction',   label: 'Extraction Bay',    universal: false },
  salvage_bay:  { id: 'salvage_bay',  label: 'Salvage Bay',       universal: false },
  refinery:     { id: 'refinery',     label: 'Refinery',          universal: false },
  weapons_bay:  { id: 'weapons_bay',  label: 'Weapons Bay',       universal: false },
  flight_deck:  { id: 'flight_deck',  label: 'Flight Deck',       universal: false },
};

// Commands available per compartment.
// Commands not listed for a compartment will return the "not accessible" message.
const COMPARTMENT_COMMANDS = {
  bridge: [
    'nav', 'fold', 'map', 'galaxy', 'where', 'ping', 'resolve',
    'scan', 'deepscan', 'status', 'systems',
  ],
  engineering: [
    'power', 'recharge', 'repair drive', 'emergency refine',
    'fold cell status', 'power management',
  ],
  cargo: [
    'inventory', 'jettison', 'transfer', 'manifest',
  ],
  quarters: [
    'rest', 'crew status',
  ],
  airlock: [
    'deploy tool', 'retrieve tool', 'swap pod',
  ],
  reserve_tank: [
    'emergency refine', 'check reserve', 'fill reserve',
  ],
  extraction: [
    'mine', 'survey', 'pod status', 'ore manifest',
  ],
  salvage_bay: [
    'salvage', 'scan log', 'salvage manifest',
  ],
  refinery: [
    'refine', 'refine all', 'yield check',
  ],
  weapons_bay: [
    'load', 'unload', 'weapon status', 'ammo count',
  ],
  flight_deck: [
    'launch', 'recall', 'flight status',
  ],
};

// ---------------------------------------------------------------------------
// CARGO SIZE CONSTANTS
// ---------------------------------------------------------------------------

const CARGO_SIZE = {
  NONE:       'none',
  MINIMAL:    'minimal',
  SMALL:      'small',
  MEDIUM:     'medium',
  LARGE:      'large',
  INDUSTRIAL: 'industrial',
};

// ---------------------------------------------------------------------------
// FOLD COST MODIFIERS
// foldCostMod: extra fold cells consumed per jump, on top of base cost.
//   0  = standard
//   1  = below standard (costs 1 extra cell per fold)
//   2  = poor          (costs 2 extra cells per fold)
//   4  = very poor     (costs 4 extra cells per fold)
//  -1  = above average (saves 1 cell per fold — Light Surveyor class bonus)
// ---------------------------------------------------------------------------

const FOLD_EFFICIENCY = {
  EXCELLENT:      -2,   // Interceptor, Courier, Data Runner
  ABOVE_AVERAGE:  -1,   // Light Surveyor class exclusive
  STANDARD:        0,
  BELOW_STANDARD:  1,
  POOR:            2,
  VERY_POOR:       4,   // Escort Carrier
};

// ---------------------------------------------------------------------------
// FACTION CONSTANTS
// ---------------------------------------------------------------------------

const FACTION = {
  GUILD:       'guild',
  INDEPENDENT: 'independent',
  PELK:        'pelk',
  CCC:         'ccc',
  FERAL:       'feral',
};

// Standing requirement keys (for future standing system)
const STANDING = {
  NONE:    null,
  KNOWN:   'known',
  TRUSTED: 'trusted',
};

// ---------------------------------------------------------------------------
// SHIP LINE CONSTANTS
// ---------------------------------------------------------------------------

const SHIP_LINE = {
  SURVEYOR:   'surveyor',
  FREIGHT:    'freight',
  INDUSTRIAL: 'industrial',
  SALVAGE:    'salvage',
  MILITARY:   'military',
  SPECIALIST: 'specialist',
};

// ---------------------------------------------------------------------------
// SHIP_DEFS — all 18 hull classes
//
// Field reference:
//   id              string    — internal key (snake_case)
//   name            string    — display name
//   designation     string    — hull type abbreviation
//   line            string    — ship line (SHIP_LINE constant)
//   role            string    — human-readable role description
//   hull            number    — max hull points
//   armor           number    — armor rating (damage reduction)
//   powerMax        number    — maximum power core capacity
//   powerRecharge   number    — power restored per tick (1 tick = 1 travel day)
//   fuelMax         number    — maximum fuel units
//   cellMagazine    number    — fold cell magazine capacity (always 20)
//   foldCostMod     number    — extra fold cells per jump (FOLD_EFFICIENCY constant)
//   emergencyTank   number    — kg raw veydrite in emergency reserve (0 = none)
//   weaponSlots     number    — weapon hardpoints
//   utilitySlots    number    — utility tool slots
//   podHardpoints   number    — external pod attachment points
//   cargoSize       string    — cargo hold size (CARGO_SIZE constant)
//   crewMin         number    — minimum crew to operate
//   crewMax         number    — maximum crew capacity
//   scannerBonus    number    — survey resolution bonus (0.0–1.0, 0 = none)
//   compartments    string[]  — list of valid compartment IDs
//   features        object    — class-exclusive features (free-form)
//   price           number    — purchase price in scrip (0 = not purchasable / starting ship)
//   factionAccess   string[]  — which factions sell / commission this hull
//   standingReq     string|null — minimum standing required to purchase
//   notes           string    — designer notes / lore
// ---------------------------------------------------------------------------

const SHIP_DEFS = {

  // =========================================================================
  // SURVEYOR LINE
  // =========================================================================

  light_surveyor: {
    id:             'light_surveyor',
    name:           'Light Surveyor',
    designation:    'LSV',
    line:           SHIP_LINE.SURVEYOR,
    role:           'Deep survey, solo contractor operations',
    hull:           100,
    armor:          10,
    powerMax:       500,
    powerRecharge:  8,
    fuelMax:        100,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.ABOVE_AVERAGE,
    emergencyTank:  15,           // CLASS EXCLUSIVE — 15 kg raw veydrite
    weaponSlots:    2,
    utilitySlots:   1,
    podHardpoints:  2,
    cargoSize:      CARGO_SIZE.SMALL,
    crewMin:        1,
    crewMax:        4,
    scannerBonus:   0.25,         // CLASS EXCLUSIVE — +25% survey resolution
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
      'reserve_tank',             // CLASS EXCLUSIVE compartment
    ],
    features: {
      emergencyReserveTank: true, // unique to this class
      foldEfficiencyBonus:  true, // above-average fold efficiency
      scannerArrayBonus:    true, // +25% survey resolution
      jumpRange:            'full_galaxy',
    },
    price:          0,            // starting ship — not purchasable
    factionAccess:  [FACTION.GUILD, FACTION.INDEPENDENT],
    standingReq:    STANDING.NONE,
    notes: `Only ship class with emergency reserve tank. Hardest ship to leave. ` +
           `Designed to be. The emergency tank, fold efficiency bonus, and scanner ` +
           `array bonus are class-specific and do not transfer to any other hull.`,
  },

  medium_surveyor: {
    id:             'medium_surveyor',
    name:           'Medium Surveyor',
    designation:    'MSV',
    line:           SHIP_LINE.SURVEYOR,
    role:           'Extended survey operations, small team',
    hull:           180,
    armor:          15,
    powerMax:       800,
    powerRecharge:  10,
    fuelMax:        180,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.STANDARD,
    emergencyTank:  0,
    weaponSlots:    3,
    utilitySlots:   2,
    podHardpoints:  3,
    cargoSize:      CARGO_SIZE.SMALL,
    crewMin:        2,
    crewMax:        8,
    scannerBonus:   0.10,         // +10% survey resolution
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
    ],
    features: {
      dualToolOperation: true,    // 2 utility slots — first ship that can run two tools simultaneously
    },
    price:          85_000,
    factionAccess:  [FACTION.GUILD, FACTION.INDEPENDENT],
    standingReq:    STANDING.NONE,
    notes: `Loses emergency tank and fold bonus relative to Light Surveyor. ` +
           `Gains utility slot and extra pod hardpoint. Scanner bonus reduced to +10%. ` +
           `First ship that can run two tools simultaneously.`,
  },

  deep_survey_vessel: {
    id:             'deep_survey_vessel',
    name:           'Deep Survey Vessel',
    designation:    'DSV',
    line:           SHIP_LINE.SURVEYOR,
    role:           'Long-range survey, institutional operations',
    hull:           300,
    armor:          20,
    powerMax:       1200,
    powerRecharge:  15,
    fuelMax:        300,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.BELOW_STANDARD, // costs 1 extra cell per fold
    emergencyTank:  0,
    weaponSlots:    4,
    utilitySlots:   3,
    podHardpoints:  4,
    cargoSize:      CARGO_SIZE.MEDIUM,
    crewMin:        4,
    crewMax:        16,
    scannerBonus:   0.15,         // +15% survey resolution
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
    ],
    features: {
      institutionalScale: true,
    },
    price:          320_000,
    factionAccess:  [FACTION.GUILD],
    standingReq:    STANDING.KNOWN,
    notes: `Guild typically operates these. Independent ownership rare. ` +
           `Fold inefficiency is the tax on scale — costs 1 extra cell per fold.`,
  },

  // =========================================================================
  // FREIGHT LINE
  // =========================================================================

  light_freighter: {
    id:             'light_freighter',
    name:           'Light Freighter',
    designation:    'LFT',
    line:           SHIP_LINE.FREIGHT,
    role:           'Short-haul cargo, system-level trade',
    hull:           150,
    armor:          12,
    powerMax:       600,
    powerRecharge:  8,
    fuelMax:        200,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.STANDARD,
    emergencyTank:  0,
    weaponSlots:    2,
    utilitySlots:   1,
    podHardpoints:  4,
    cargoSize:      CARGO_SIZE.MEDIUM,
    crewMin:        1,
    crewMax:        6,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
    ],
    features: {},
    price:          60_000,
    factionAccess:  [FACTION.PELK, FACTION.INDEPENDENT],
    standingReq:    STANDING.NONE,
    notes: `Pelk's workhorse. Good cargo volume, mediocre everything else.`,
  },

  medium_freighter: {
    id:             'medium_freighter',
    name:           'Medium Freighter',
    designation:    'MFT',
    line:           SHIP_LINE.FREIGHT,
    role:           'Inter-quadrant bulk cargo',
    hull:           280,
    armor:          18,
    powerMax:       900,
    powerRecharge:  12,
    fuelMax:        350,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.BELOW_STANDARD,
    emergencyTank:  0,
    weaponSlots:    3,
    utilitySlots:   1,
    podHardpoints:  6,
    cargoSize:      CARGO_SIZE.LARGE,
    crewMin:        4,
    crewMax:        12,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
    ],
    features: {},
    price:          210_000,
    factionAccess:  [FACTION.PELK, FACTION.INDEPENDENT],
    standingReq:    STANDING.NONE,
    notes: `Needs escort in contested space. What most people picture when ` +
           `they think "freighter."`,
  },

  heavy_freighter: {
    id:             'heavy_freighter',
    name:           'Heavy Freighter',
    designation:    'HFT',
    line:           SHIP_LINE.FREIGHT,
    role:           'Bulk industrial cargo, ore transport',
    hull:           500,
    armor:          25,
    powerMax:       1500,
    powerRecharge:  18,
    fuelMax:        500,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.POOR, // costs 2 extra cells per fold
    emergencyTank:  0,
    weaponSlots:    4,
    utilitySlots:   2,
    podHardpoints:  12,
    cargoSize:      CARGO_SIZE.INDUSTRIAL,
    crewMin:        8,
    crewMax:        24,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
    ],
    features: {},
    price:          650_000,
    factionAccess:  [FACTION.PELK, FACTION.CCC],
    standingReq:    STANDING.KNOWN,
    notes: `Pelk and CCC operate these. Independent ownership requires ` +
           `significant capital. A target in Collapsed space.`,
  },

  // =========================================================================
  // INDUSTRIAL LINE
  // =========================================================================

  light_mining_vessel: {
    id:             'light_mining_vessel',
    name:           'Light Mining Vessel',
    designation:    'LMV',
    line:           SHIP_LINE.INDUSTRIAL,
    role:           'Solo extraction operations',
    hull:           160,
    armor:          15,
    powerMax:       700,
    powerRecharge:  10,
    fuelMax:        150,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.STANDARD,
    emergencyTank:  0,
    weaponSlots:    2,
    utilitySlots:   2,           // can run Auger-1 + secondary tool
    podHardpoints:  6,
    cargoSize:      CARGO_SIZE.SMALL,
    crewMin:        1,
    crewMax:        6,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
      'extraction',
    ],
    features: {
      dualMiningTools: true,    // 2 utility slots — Auger-1 + secondary
    },
    price:          95_000,
    factionAccess:  [FACTION.PELK, FACTION.INDEPENDENT],
    standingReq:    STANDING.NONE,
    notes: `The dedicated miner's ship. Two utility slots means Auger-1 + ` +
           `secondary tool. More pod capacity than Light Surveyor. ` +
           `Worse scanner, no emergency tank.`,
  },

  medium_industrial: {
    id:             'medium_industrial',
    name:           'Medium Industrial',
    designation:    'MIV',
    line:           SHIP_LINE.INDUSTRIAL,
    role:           'Mid-scale extraction and processing',
    hull:           350,
    armor:          22,
    powerMax:       1100,
    powerRecharge:  14,
    fuelMax:        280,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.BELOW_STANDARD,
    emergencyTank:  0,
    weaponSlots:    3,
    utilitySlots:   3,
    podHardpoints:  10,
    cargoSize:      CARGO_SIZE.MEDIUM,
    crewMin:        6,
    crewMax:        18,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
      'extraction', 'refinery',
    ],
    features: {
      onboardRefinery: 'basic',  // CLASS FEATURE — refines common ores, no dock required
    },
    price:          420_000,
    factionAccess:  [FACTION.PELK, FACTION.INDEPENDENT],
    standingReq:    STANDING.KNOWN,
    notes: `First ship with onboard refinery capability. Basic grade only — ` +
           `refines common ores. Does not need to dock to process ore.`,
  },

  heavy_industrial: {
    id:             'heavy_industrial',
    name:           'Heavy Industrial',
    designation:    'HIV',
    line:           SHIP_LINE.INDUSTRIAL,
    role:           'Large-scale extraction, semi-permanent deployment',
    hull:           600,
    armor:          30,
    powerMax:       2000,
    powerRecharge:  22,
    fuelMax:        600,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.POOR,
    emergencyTank:  0,
    weaponSlots:    4,
    utilitySlots:   4,
    podHardpoints:  20,
    cargoSize:      CARGO_SIZE.INDUSTRIAL,
    crewMin:        12,
    crewMax:        40,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
      'extraction', 'refinery',
    ],
    features: {
      onboardRefinery: 'standard', // CLASS FEATURE — standard grade refinery
      mobileMiningPlatform: true,
    },
    price:          1_400_000,
    factionAccess:  [FACTION.PELK, FACTION.CCC],
    standingReq:    STANDING.TRUSTED,
    notes: `Essentially a mobile mining platform. Slow, valuable, extremely ` +
           `vulnerable. Needs dedicated escort in anything below Established.`,
  },

  // =========================================================================
  // SALVAGE LINE
  // =========================================================================

  light_salvager: {
    id:             'light_salvager',
    name:           'Light Salvager',
    designation:    'LSG',
    line:           SHIP_LINE.SALVAGE,
    role:           'Solo salvage operations',
    hull:           140,
    armor:          12,
    powerMax:       600,
    powerRecharge:  9,
    fuelMax:        150,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.STANDARD,
    emergencyTank:  0,
    weaponSlots:    2,
    utilitySlots:   2,           // Harrow-7 + secondary
    podHardpoints:  4,
    cargoSize:      CARGO_SIZE.MEDIUM,
    crewMin:        1,
    crewMax:        5,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
      'salvage_bay',
    ],
    features: {
      dualSalvageTools: true,   // Harrow-7 + secondary
    },
    price:          75_000,
    factionAccess:  [FACTION.PELK, FACTION.INDEPENDENT, FACTION.FERAL],
    standingReq:    STANDING.NONE,
    notes: `The dedicated salvager's hull. Better cargo hold than Light Surveyor. ` +
           `No scanner bonus. No emergency tank. Harrow-7 is standard fit.`,
  },

  medium_salvager: {
    id:             'medium_salvager',
    name:           'Medium Salvager',
    designation:    'MSG',
    line:           SHIP_LINE.SALVAGE,
    role:           'Large wreck operations, debris field clearing',
    hull:           320,
    armor:          20,
    powerMax:       1000,
    powerRecharge:  13,
    fuelMax:        250,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.BELOW_STANDARD,
    emergencyTank:  0,
    weaponSlots:    3,
    utilitySlots:   3,
    podHardpoints:  8,
    cargoSize:      CARGO_SIZE.LARGE,
    crewMin:        4,
    crewMax:        14,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
      'salvage_bay',
    ],
    features: {
      multiHarrowOperation: true, // can field multiple Harrow units simultaneously
    },
    price:          290_000,
    factionAccess:  [FACTION.PELK, FACTION.INDEPENDENT],
    standingReq:    STANDING.NONE,
    notes: `Can field multiple Harrow units simultaneously. Primary tool for ` +
           `large debris field operations. Pelk and independent operators favor this hull.`,
  },

  // =========================================================================
  // MILITARY LINE
  // =========================================================================

  interceptor: {
    id:             'interceptor',
    name:           'Interceptor',
    designation:    'INT',
    line:           SHIP_LINE.MILITARY,
    role:           'Fast response, anti-courier, patrol',
    hull:           120,
    armor:          20,
    powerMax:       600,
    powerRecharge:  12,
    fuelMax:        120,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.EXCELLENT, // rivals Light Surveyor
    emergencyTank:  0,
    weaponSlots:    4,            // weapon-heavy for its size
    utilitySlots:   0,            // CLASS CONSTRAINT — no utility slots
    podHardpoints:  0,            // CLASS CONSTRAINT — no pod hardpoints
    cargoSize:      CARGO_SIZE.MINIMAL,
    crewMin:        1,
    crewMax:        2,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
      'weapons_bay',
    ],
    features: {
      pureCombatPlatform: true,
      foldEfficiencyBonus: true,  // excellent fold efficiency
    },
    price:          180_000,
    factionAccess:  [FACTION.CCC],
    standingReq:    STANDING.KNOWN,
    notes: `Fast. Armed. Carries nothing else. CCC primary fast-response hull. ` +
           `Fold efficiency rivals Light Surveyor. ` +
           `Cannot mine, cannot salvage, cannot haul. Pure combat platform.`,
  },

  corvette: {
    id:             'corvette',
    name:           'Corvette',
    designation:    'CVT',
    line:           SHIP_LINE.MILITARY,
    role:           'Patrol, escort, anti-piracy',
    hull:           350,
    armor:          35,
    powerMax:       1200,
    powerRecharge:  16,
    fuelMax:        300,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.STANDARD,
    emergencyTank:  0,
    weaponSlots:    6,
    utilitySlots:   1,
    podHardpoints:  2,
    cargoSize:      CARGO_SIZE.SMALL,
    crewMin:        8,
    crewMax:        20,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
      'weapons_bay',
    ],
    features: {},
    price:          550_000,
    factionAccess:  [FACTION.CCC, FACTION.INDEPENDENT],
    standingReq:    STANDING.KNOWN,
    notes: `The backbone of CCC patrol operations. Can escort freighters across ` +
           `quadrant boundaries. Independent ownership: possible but expensive. ` +
           `Standing requirement: CCC KNOWN minimum.`,
  },

  frigate: {
    id:             'frigate',
    name:           'Frigate',
    designation:    'FRG',
    line:           SHIP_LINE.MILITARY,
    role:           'Multi-role combat, light capital operations',
    hull:           600,
    armor:          45,
    powerMax:       1800,
    powerRecharge:  20,
    fuelMax:        400,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.BELOW_STANDARD,
    emergencyTank:  0,
    weaponSlots:    8,
    utilitySlots:   2,
    podHardpoints:  3,
    cargoSize:      CARGO_SIZE.SMALL,
    crewMin:        16,
    crewMax:        40,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
      'weapons_bay',
    ],
    features: {},
    price:          1_200_000,
    factionAccess:  [FACTION.CCC, FACTION.PELK],
    standingReq:    STANDING.TRUSTED,
    notes: `Significant firepower. Needs crew to operate. ` +
           `Rare in independent hands. CCC and Pelk security divisions operate these.`,
  },

  // =========================================================================
  // SPECIALIST LINE
  // =========================================================================

  courier: {
    id:             'courier',
    name:           'Courier',
    designation:    'CRR',
    line:           SHIP_LINE.SPECIALIST,
    role:           'Fast data and priority cargo transit',
    hull:           90,
    armor:          8,
    powerMax:       500,
    powerRecharge:  10,
    fuelMax:        100,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.EXCELLENT,
    emergencyTank:  0,
    weaponSlots:    1,
    utilitySlots:   1,
    podHardpoints:  1,
    cargoSize:      CARGO_SIZE.MINIMAL,  // encrypted and hardened
    crewMin:        1,
    crewMax:        2,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
    ],
    features: {
      enhancedDataStorage: true,  // CLASS FEATURE — astrographic data capacity doubled
      hardenedCargoHold:   true,  // encrypted and hardened cargo hold
    },
    price:          140_000,
    factionAccess:  [FACTION.GUILD],
    standingReq:    STANDING.KNOWN,
    notes: `Built to move fast and carry little. Enhanced data storage means ` +
           `astrographic data capacity is doubled. Guild couriers use this hull. ` +
           `Data runners favor it. Hull is fragile. Speed is survival.`,
  },

  data_runner: {
    id:             'data_runner',
    name:           'Data Runner',
    designation:    'DRN',
    line:           SHIP_LINE.SPECIALIST,
    role:           'Black market data, unregistered cargo',
    hull:           95,
    armor:          8,
    powerMax:       520,
    powerRecharge:  10,
    fuelMax:        110,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.EXCELLENT,
    emergencyTank:  0,
    weaponSlots:    2,            // one more than Courier
    utilitySlots:   1,
    podHardpoints:  1,
    cargoSize:      CARGO_SIZE.MINIMAL, // shielded from inspection
    crewMin:        1,
    crewMax:        2,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
    ],
    features: {
      shieldedCargoHold:   true,  // CLASS FEATURE — harder to inspect
      unregisteredHull:    true,  // Guild does not officially recognize this class
    },
    price:          155_000,
    factionAccess:  [FACTION.FERAL, FACTION.INDEPENDENT],
    standingReq:    STANDING.NONE,
    notes: `Mechanically similar to Courier. Cargo hold is shielded — harder to inspect. ` +
           `Feral and independent operators favor this. ` +
           `Guild does not officially recognize this hull class. Guild knows it exists.`,
  },

  research_vessel: {
    id:             'research_vessel',
    name:           'Research Vessel',
    designation:    'RSV',
    line:           SHIP_LINE.SPECIALIST,
    role:           'Extended scientific survey, anomaly investigation',
    hull:           220,
    armor:          14,
    powerMax:       900,
    powerRecharge:  12,
    fuelMax:        250,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.STANDARD,
    emergencyTank:  0,
    weaponSlots:    2,
    utilitySlots:   4,            // CLASS FEATURE — most utility slots of any non-industrial
    podHardpoints:  4,
    cargoSize:      CARGO_SIZE.MEDIUM,
    crewMin:        4,
    crewMax:        16,
    scannerBonus:   0.20,         // CLASS FEATURE — +20% survey resolution
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
    ],
    features: {
      quadToolOperation:   true,  // 4 utility slots — multiple survey tools + mining + sensor arrays
      anomalyInvestigation: true,
    },
    price:          480_000,
    factionAccess:  [FACTION.GUILD],
    standingReq:    STANDING.KNOWN,
    notes: `Four utility slots — can run multiple survey tools, mining equipment, ` +
           `and specialized sensor arrays simultaneously. The ship anomaly investigators use. ` +
           `Guild operates these in Forbidden space. Rare in independent hands.`,
  },

  escort_carrier: {
    id:             'escort_carrier',
    name:           'Escort Carrier',
    designation:    'ECV',
    line:           SHIP_LINE.SPECIALIST,
    role:           'Fleet command, fighter deployment, logistics hub',
    hull:           1200,
    armor:          60,
    powerMax:       4000,
    powerRecharge:  40,
    fuelMax:        1000,
    cellMagazine:   20,
    foldCostMod:    FOLD_EFFICIENCY.VERY_POOR, // 4 cells per fold
    emergencyTank:  0,
    weaponSlots:    12,
    utilitySlots:   4,
    podHardpoints:  8,
    cargoSize:      CARGO_SIZE.INDUSTRIAL,
    crewMin:        40,
    crewMax:        120,
    scannerBonus:   0,
    compartments: [
      'bridge', 'engineering', 'cargo', 'quarters', 'airlock',
      'weapons_bay', 'flight_deck',
    ],
    features: {
      fighterBays:       4,       // CLASS FEATURE — deploys NPC fighters
      fleetCommand:      true,
      commissionOnly:    true,    // cannot be purchased — must be commissioned
    },
    price:          0,            // commission only — price is quest/standing gated
    factionAccess:  [FACTION.CCC, FACTION.PELK, FACTION.GUILD],
    standingReq:    STANDING.TRUSTED,
    notes: `The endgame fleet ship. Cannot be purchased — must be commissioned. ` +
           `Requires TRUSTED standing with at least one major faction. ` +
           `Requires crew of minimum 40. Changes the nature of play entirely — ` +
           `you are no longer a contractor. You are an operator.`,
  },

};

// ---------------------------------------------------------------------------
// HELPER UTILITIES
// ---------------------------------------------------------------------------

/**
 * Get a ship definition by ID.
 * @param {string} id — ship ID key (e.g. 'light_surveyor')
 * @returns {object|null}
 */
function getShipDef(id) {
  return SHIP_DEFS[id] ?? null;
}

/**
 * Get all ship definitions as an array, optionally filtered by line.
 * @param {string} [line] — SHIP_LINE constant, or undefined for all
 * @returns {object[]}
 */
function getShipsByLine(line) {
  const defs = Object.values(SHIP_DEFS);
  return line ? defs.filter(d => d.line === line) : defs;
}

/**
 * Get all ships available to a given faction.
 * @param {string} faction — FACTION constant
 * @returns {object[]}
 */
function getShipsByFaction(faction) {
  return Object.values(SHIP_DEFS).filter(d => d.factionAccess.includes(faction));
}

/**
 * Get all purchasable ships (price > 0 and not commission-only).
 * @returns {object[]}
 */
function getPurchasableShips() {
  return Object.values(SHIP_DEFS).filter(
    d => d.price > 0 && !d.features?.commissionOnly
  );
}

/**
 * Get all commissionable ships (endgame, standing-gated).
 * @returns {object[]}
 */
function getCommissionableShips() {
  return Object.values(SHIP_DEFS).filter(d => d.features?.commissionOnly);
}

/**
 * Calculate the actual fold cell cost for a ship.
 * Base cost is 1 cell per fold. foldCostMod adjusts this.
 * Minimum cost is always 1 cell regardless of bonus.
 * @param {string|object} shipOrId — ship ID string or ship def object
 * @param {number} [baseCost=1] — base fold cell cost (default 1)
 * @returns {number}
 */
function calcFoldCost(shipOrId, baseCost = 1) {
  const def = typeof shipOrId === 'string' ? getShipDef(shipOrId) : shipOrId;
  if (!def) return baseCost;
  return Math.max(1, baseCost + def.foldCostMod);
}

/**
 * Check whether a ship has access to a given compartment.
 * @param {string|object} shipOrId
 * @param {string} compartmentId
 * @returns {boolean}
 */
function hasCompartment(shipOrId, compartmentId) {
  const def = typeof shipOrId === 'string' ? getShipDef(shipOrId) : shipOrId;
  return def ? def.compartments.includes(compartmentId) : false;
}

/**
 * Check whether a command is valid in a given compartment.
 * @param {string} compartmentId
 * @param {string} command — exact command string
 * @returns {boolean}
 */
function isCommandValidInCompartment(compartmentId, command) {
  const cmds = COMPARTMENT_COMMANDS[compartmentId];
  if (!cmds) return false;
  return cmds.includes(command.trim().toLowerCase());
}

/**
 * Return the "wrong compartment" error message.
 * Mirrors the format defined in the spec.
 * @param {string} currentCompartment
 * @param {string} requiredCompartment
 * @returns {string}
 */
function wrongCompartmentMsg(currentCompartment, requiredCompartment) {
  const cur = COMPARTMENTS[currentCompartment]?.label ?? currentCompartment;
  const req = COMPARTMENTS[requiredCompartment]?.label ?? requiredCompartment;
  const goCmd = requiredCompartment.replace('_', ' ');
  return `[${cur.toUpperCase()}] That system is not accessible from ${cur}.\n` +
         `Type "go ${goCmd}" to access ${req.toLowerCase()} systems.`;
}

/**
 * Get the power state label for a given power level.
 * @param {number} current — current power
 * @param {number} max — maximum power
 * @returns {string} — one of: FULL | NOMINAL | LOW | CRITICAL | EMERGENCY
 */
function getPowerState(current, max) {
  const pct = (current / max) * 100;
  if (pct >= 80) return 'FULL';
  if (pct >= 50) return 'NOMINAL';
  if (pct >= 25) return 'LOW';
  if (pct >= 10) return 'CRITICAL';
  return 'EMERGENCY';
}

/**
 * Check whether a ship has a class-exclusive feature.
 * @param {string|object} shipOrId
 * @param {string} featureKey
 * @returns {boolean}
 */
function hasFeature(shipOrId, featureKey) {
  const def = typeof shipOrId === 'string' ? getShipDef(shipOrId) : shipOrId;
  return def ? !!def.features?.[featureKey] : false;
}

/**
 * Build a fresh ship instance for playerState from a definition.
 * Populates current values at full capacity.
 * @param {string} shipId
 * @returns {object|null}
 */
function createShipInstance(shipId) {
  const def = getShipDef(shipId);
  if (!def) return null;

  return {
    id:                  def.id,
    name:                def.name,
    designation:         def.designation,

    // Current / max pairs
    hullCurrent:         def.hull,
    hullMax:             def.hull,
    armor:               def.armor,
    powerCurrent:        def.powerMax,
    powerMax:            def.powerMax,
    powerRecharge:       def.powerRecharge,
    fuelCurrent:         def.fuelMax,
    fuelMax:             def.fuelMax,
    foldCellsCurrent:    def.cellMagazine,
    foldCellsMax:        def.cellMagazine,
    emergencyTankCurrent: def.emergencyTank,
    emergencyTankMax:    def.emergencyTank,

    // Slot state
    weaponSlots:         def.weaponSlots,
    utilitySlots:        def.utilitySlots,
    podHardpoints:       def.podHardpoints,
    cargoSize:           def.cargoSize,
    scannerBonus:        def.scannerBonus,
    foldCostMod:         def.foldCostMod,

    // Installed equipment (populated by equipment system)
    weapons:             Array(def.weaponSlots).fill(null),
    utilityTools:        Array(def.utilitySlots).fill(null),
    pods:                Array(def.podHardpoints).fill(null),

    // Subsystem health (each 0–100)
    subsystems: {
      hullCore:      100,
      powerCore:     100,
      drive:         100,
      weaponsArray:  100,
      sensorSuite:   100,
      cargoHold:     100,
      lifeSupport:   100,
    },

    // Navigation
    currentCompartment: 'bridge',
    compartments:       [...def.compartments],

    // Reference back to the definition
    defId:              def.id,
  };
}

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

// Browser globals (no module bundler assumed)
if (typeof window !== 'undefined') {
  window.SHIP_DEFS               = SHIP_DEFS;
  window.COMPARTMENTS            = COMPARTMENTS;
  window.COMPARTMENT_COMMANDS    = COMPARTMENT_COMMANDS;
  window.CARGO_SIZE              = CARGO_SIZE;
  window.FOLD_EFFICIENCY         = FOLD_EFFICIENCY;
  window.FACTION                 = FACTION;
  window.STANDING                = STANDING;
  window.SHIP_LINE               = SHIP_LINE;

  window.getShipDef                  = getShipDef;
  window.getShipsByLine              = getShipsByLine;
  window.getShipsByFaction           = getShipsByFaction;
  window.getPurchasableShips         = getPurchasableShips;
  window.getCommissionableShips      = getCommissionableShips;
  window.calcFoldCost                = calcFoldCost;
  window.hasCompartment              = hasCompartment;
  window.isCommandValidInCompartment = isCommandValidInCompartment;
  window.wrongCompartmentMsg         = wrongCompartmentMsg;
  window.getPowerState               = getPowerState;
  window.hasFeature                  = hasFeature;
  window.createShipInstance          = createShipInstance;
}

// Node / CommonJS (for testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SHIP_DEFS, COMPARTMENTS, COMPARTMENT_COMMANDS,
    CARGO_SIZE, FOLD_EFFICIENCY, FACTION, STANDING, SHIP_LINE,
    getShipDef, getShipsByLine, getShipsByFaction,
    getPurchasableShips, getCommissionableShips,
    calcFoldCost, hasCompartment, isCommandValidInCompartment,
    wrongCompartmentMsg, getPowerState, hasFeature, createShipInstance,
  };
}
