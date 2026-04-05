import type { PlotData, RoadData, TreeData, SpecialArea } from '../types';

// ============================================================
// COORDINATE SYSTEM
// ============================================================
// Origin (0,0) maps to center of the 3D scene
// X-axis: left (−) to right (+)   → matches image left-to-right
// Z-axis: top (−) to bottom (+)   → matches image top-to-bottom
// Scale: ~1 unit ≈ 3 meters real-world
//
// Block layout (left → right):
//   Block K | 12m Rd | Block J | 12m Rd | Block I | 12m Rd |
//   Block H | 9m Rd  | Block G | 6m Rd  | Block F | 8m Rd  |
//   Block E/D (right upper/lower) | 9m Rd | Block A (strip)
// ============================================================

const PLOT_STATUSES: PlotData['status'][] = ['available', 'sold', 'reserved'];

function createPlot(
  num: number,
  x: number,
  z: number,
  width: number,
  depth: number,
  statusOverride?: PlotData['status']
): PlotData {
  // Deterministic but varied status based on plot number
  const hash = ((num * 7 + 13) % 100);
  let status: PlotData['status'] = 'available';
  if (!statusOverride) {
    if (hash > 78) status = 'sold';
    else if (hash > 60) status = 'reserved';
  } else {
    status = statusOverride;
  }

  return {
    id: `plot-${num}`,
    number: String(num),
    status,
    price: Math.floor(180 + (num * 3.7 % 120)) * 1000,
    area: Math.floor(width * depth * 100), // sq ft equivalent
    x, z, width, depth,
  };
}

// --- Standard dimensions ---
const PW = 3.0;   // standard plot width  (~9m real)
const PD = 3.5;   // standard plot depth  (~10.5m real)
const PWs = 2.5;  // small plot width     (~7.5m real)
const PDs = 3.0;  // small plot depth     (~9m real)
const G = 0.2;    // gap between plots

// ============================================================
// BLOCK K — Far-left, single column (plots 114→101,105,108,109,110,111,112,113,114)
// ============================================================
const blockK: PlotData[] = [
  createPlot(114, -52, -17,  PW, PD),
  createPlot(113, -52, -13,  PW, PD),
  createPlot(112, -52, -9,   PW, PD),
  createPlot(111, -52, -5,   PW, PD),
  createPlot(110, -52, -1,   PW, PD),
  createPlot(109, -52,  3,   PW, PD),
  createPlot(108, -52,  7,   PW, PD),
  createPlot(105, -52, 11,   PW, PD),
  createPlot(101, -52, 15,   PW, PD),
];

// ============================================================
// BLOCK J — 3-column block (left interior)
// Col 1: 59,86,97,94,100,101,103,102,101
// Col 2: 93,92,92,91,90,99,98,88,87
// ============================================================
const blockJ_col1: PlotData[] = [
  createPlot(59,  -44, -17, PW, PD),
  createPlot(86,  -44, -13, PW, PD),
  createPlot(97,  -44, -9,  PW, PD),
  createPlot(94,  -44, -5,  PW, PD),
  createPlot(100, -44, -1,  PW, PD),
  createPlot(101, -44,  3,  PW, PD),  // different plot-101 from block K
  createPlot(103, -44,  7,  PW, PD),
  createPlot(102, -44, 11,  PW, PD),
  createPlot(101, -44, 15,  PW, PD),
];
// Deduplicate IDs for plot-101
blockJ_col1[5].id = 'plot-101b';
blockJ_col1[8].id = 'plot-101c';

const blockJ_col2: PlotData[] = [
  createPlot(93, -40.5, -17, PW, PD),
  createPlot(92, -40.5, -13, PW, PD),
  createPlot(92, -40.5, -9,  PW, PD), // appears twice in image
  createPlot(91, -40.5, -5,  PW, PD),
  createPlot(90, -40.5, -1,  PW, PD),
  createPlot(99, -40.5,  3,  PW, PD),
  createPlot(98, -40.5,  7,  PW, PD),
  createPlot(88, -40.5, 11,  PW, PD),
  createPlot(87, -40.5, 15,  PW, PD),
];
blockJ_col2[2].id = 'plot-92b';

// ============================================================
// BLOCK I — 2-column block
// Col 1: 76,78,78,70,69,80,81,82,83,84
// Col 2: 74,70,71,70,68,67,66,65,64
// ============================================================
const blockI_col1: PlotData[] = [
  createPlot(76, -30, -17, PW, PD),
  createPlot(78, -30, -13, PW, PD),
  createPlot(78, -30, -9,  PW, PD),
  createPlot(70, -30, -5,  PW, PD),
  createPlot(69, -30, -1,  PW, PD),
  createPlot(80, -30,  3,  PW, PD),
  createPlot(81, -30,  7,  PW, PD),
  createPlot(82, -30, 11,  PW, PD),
  createPlot(83, -30, 15,  PW, PD),
  createPlot(84, -30, 19,  PW, PD),
];
blockI_col1[2].id = 'plot-78b';

const blockI_col2: PlotData[] = [
  createPlot(74, -26.5, -17, PW, PD),
  createPlot(70, -26.5, -13, PW, PD),
  createPlot(71, -26.5, -9,  PW, PD),
  createPlot(70, -26.5, -5,  PW, PD),
  createPlot(68, -26.5, -1,  PW, PD),
  createPlot(67, -26.5,  3,  PW, PD),
  createPlot(66, -26.5,  7,  PW, PD),
  createPlot(65, -26.5, 11,  PW, PD),
  createPlot(64, -26.5, 15,  PW, PD),
];
blockI_col2[1].id = 'plot-70b';
blockI_col2[3].id = 'plot-70c';

// ============================================================
// BLOCK H — 3-column block (center-left)
// Col 1: 57,58,59,61,62,63
// Col 2: 56,54,53,52,51,50
// Col 3: 54,53,52,50,40
// ============================================================
const blockH_col1: PlotData[] = [
  createPlot(57, -16, -17, PW, PD),
  createPlot(58, -16, -13, PW, PD),
  createPlot(59, -16, -9,  PW, PD),
  createPlot(61, -16, -5,  PW, PD),
  createPlot(62, -16, -1,  PW, PD),
  createPlot(63, -16,  3,  PW, PD),
];
blockH_col1[2].id = 'plot-59b';

const blockH_col2: PlotData[] = [
  createPlot(56, -12.5, -17, PW, PD),
  createPlot(54, -12.5, -13, PW, PD),
  createPlot(53, -12.5, -9,  PW, PD),
  createPlot(52, -12.5, -5,  PW, PD),
  createPlot(51, -12.5, -1,  PW, PD),
  createPlot(50, -12.5,  3,  PW, PD),
];

const blockH_col3: PlotData[] = [
  createPlot(54, -9, -17, PW, PD),
  createPlot(53, -9, -13, PW, PD),
  createPlot(52, -9, -9,  PW, PD),
  createPlot(50, -9, -5,  PW, PD),
  createPlot(40, -9,  3,  PW, PD),
];
blockH_col3[0].id = 'plot-54b';
blockH_col3[1].id = 'plot-53b';
blockH_col3[2].id = 'plot-52b';
blockH_col3[3].id = 'plot-50b';

// ============================================================
// BLOCK G — 3-column block (center)
// Col 1: 43,44,49,39,47,48     Col 2: 42,40,38,37,48
// Col 3 stub: 42
// ============================================================
const blockG_col1: PlotData[] = [
  createPlot(43, -2, -17, PW, PD),
  createPlot(44, -2, -13, PW, PD),
  createPlot(49, -2, -9,  PW, PD),
  createPlot(39, -2, -5,  PW, PD),
  createPlot(47, -2, -1,  PW, PD),
  createPlot(48, -2,  3,  PW, PD),
];

const blockG_col2: PlotData[] = [
  createPlot(42, 1.5, -17, PW, PD),
  createPlot(40, 1.5, -13, PW, PD),
  createPlot(38, 1.5, -9,  PW, PD),
  createPlot(37, 1.5, -5,  PW, PD),
  createPlot(48, 1.5, -1,  PW, PD),
];
blockG_col2[4].id = 'plot-48b';

const blockG_col3: PlotData[] = [
  createPlot(42, 5, -17, PW, PD),
];
blockG_col3[0].id = 'plot-42b';

// ============================================================
// BLOCK F — 3-column block (center-right)
// Col 1: 31,32,26,34,35,23   Col 2: 30,27,25,24,22
// Col 3: 28,20,21,12
// ============================================================
const blockF_col1: PlotData[] = [
  createPlot(31, 12, -17, PW, PD),
  createPlot(32, 12, -13, PW, PD),
  createPlot(26, 12, -9,  PW, PD),
  createPlot(34, 12, -5,  PW, PD),
  createPlot(35, 12, -1,  PW, PD),
  createPlot(23, 12,  3,  PW, PD),
];

const blockF_col2: PlotData[] = [
  createPlot(30, 15.5, -17, PW, PD),
  createPlot(27, 15.5, -13, PW, PD),
  createPlot(25, 15.5, -9,  PW, PD),
  createPlot(24, 15.5, -5,  PW, PD),
  createPlot(22, 15.5,  3,  PW, PD),
];

const blockF_col3: PlotData[] = [
  createPlot(28, 19, -17, PW, PD),
  createPlot(20, 19, -13, PW, PD),
  createPlot(21, 19, -9,  PW, PD),
  createPlot(12, 19,  3,  PW, PD),
];

// ============================================================
// BLOCK E — Right section (between Block F and Block D)
// Based on image: 2 columns, vertical
// Column 1 (left): 18, 15, 20, 21, 22
// Column 2 (right): 17, 16, 14, 13, 12
// ============================================================
const blockE_col1: PlotData[] = [
  createPlot(18, 25, -17, PW, PD),
  createPlot(15, 25, -13, PW, PD),
  createPlot(20, 25, -9.5, PW, PD),
  createPlot(21, 25, -6, PW, PD),
  createPlot(22, 25, -2.5, PW, PD),
];
blockE_col1[0].id = 'plot-18e';
blockE_col1[1].id = 'plot-15e';
blockE_col1[2].id = 'plot-20e';

const blockE_col2: PlotData[] = [
  createPlot(17, 28.5, -17, PW, PD),
  createPlot(16, 32, -17, PW, PD),
  createPlot(14, 28.5, -13, PW, PD),
  createPlot(13, 28.5, -9.5, PW, PD),
  createPlot(12, 28.5, -6, PW, PD),
];
blockE_col2[2].id = 'plot-14e';
blockE_col2[3].id = 'plot-13e';
blockE_col2[4].id = 'plot-12e';

// ============================================================
// BLOCK D — Right section, two long rows flanking 9m road
// Top row (left→right): 15,14,13,12,11,10,9,7,6,5,3,2,1
// Bottom row: 18,27,25,24,23,13,12,11,10,9,8,7
// ============================================================
const blockD_top: PlotData[] = [
  createPlot(15, 37.5, -17, PWs, PDs),
  createPlot(14, 39.8, -17, PWs, PDs),
  createPlot(13, 42.1, -17, PWs, PDs),
  createPlot(12, 44.4, -17, PWs, PDs),
  createPlot(11, 46.7, -17, PWs, PDs),
  createPlot(10, 49.0, -17, PWs, PDs),
  createPlot(9,  51.3, -17, PWs, PDs),
  createPlot(7,  53.6, -17, PWs, PDs),
  createPlot(6,  55.5, -17, PWs, PDs),
  createPlot(5,  57.4, -17, PWs, PDs),
  createPlot(3,  59.3, -17, PWs, PDs),
  createPlot(2,  61.2, -17, PWs, PDs),
  createPlot(1,  63.1, -17, PWs, PDs),
];
// Deduplicate IDs
blockD_top.forEach((p, i) => { p.id = `plot-${p.number}d`; });

const blockD_bot: PlotData[] = [
  createPlot(18, 37.5, -13.5, PWs, PDs),
  createPlot(27, 39.8, -13.5, PWs, PDs),
  createPlot(25, 42.1, -13.5, PWs, PDs),
  createPlot(24, 44.4, -13.5, PWs, PDs),
  createPlot(23, 46.7, -13.5, PWs, PDs),
  createPlot(13, 49.0, -13.5, PWs, PDs),
  createPlot(12, 51.3, -13.5, PWs, PDs),
  createPlot(11, 53.6, -13.5, PWs, PDs),
  createPlot(10, 55.5, -13.5, PWs, PDs),
  createPlot(9,  57.4, -13.5, PWs, PDs),
  createPlot(8,  59.3, -13.5, PWs, PDs),
  createPlot(7,  61.2, -13.5, PWs, PDs),
];
blockD_bot.forEach((p) => { p.id = `plot-${p.number}db`; });

// ============================================================
// BLOCK A — Far-right vertical strip (6 plots near entry)
// Top→Bottom: 6,5,4,3,2,1
// ============================================================
const blockA: PlotData[] = [
  createPlot(6, 68, -17, 2.0, 2.8),
  createPlot(5, 68, -14, 2.0, 2.8),
  createPlot(4, 68, -11, 2.0, 2.8),
  createPlot(3, 68, -8,  2.0, 2.8),
  createPlot(2, 68, -5,  2.0, 2.8),
  createPlot(1, 68, -2,  2.0, 2.8),
];
blockA.forEach((p) => { p.id = `plot-${p.number}a`; });

// ============================================================
// COMBINE ALL PLOTS
// ============================================================
export const allPlots: PlotData[] = [
  ...blockK,
  ...blockJ_col1, ...blockJ_col2,
  ...blockI_col1, ...blockI_col2,
  ...blockH_col1, ...blockH_col2, ...blockH_col3,
  ...blockG_col1, ...blockG_col2, ...blockG_col3,
  ...blockF_col1, ...blockF_col2, ...blockF_col3,
  ...blockE_col1, ...blockE_col2,
  ...blockD_top, ...blockD_bot,
  ...blockA,
];

// ============================================================
// ROADS
// ============================================================
export const roads: RoadData[] = [
  // --- 12 Meter Roads ---
  // Top horizontal road (north perimeter)
  { id: 'road-12m-top', x: 2, z: -22, width: 115, depth: 2.5, label: '12 Meter Road' },
  // Left vertical road (west perimeter)
  { id: 'road-12m-left', x: -54.5, z: -2, width: 2.5, depth: 40, label: '12 Meter Road', labelRotation: -Math.PI / 2 },

  // Internal 12m vertical separators
  { id: 'road-12m-v1', x: -47.5, z: -2, width: 2.5, depth: 40, label: '12 Meter Road', labelRotation: -Math.PI / 2 },
  { id: 'road-12m-v2', x: -35, z: -2, width: 2.5, depth: 40, label: '12 Meter Road', labelRotation: -Math.PI / 2 },
  { id: 'road-12m-v3', x: -22, z: -2, width: 2.5, depth: 40, label: '12 Meter Road', labelRotation: -Math.PI / 2 },

  // Top-right 12m road section
  { id: 'road-12m-top-right', x: 42, z: -22, width: 40, depth: 2.5, label: '12 Meter Road' },

  // Diagonal entry road (12m, SE corner)
  { id: 'road-12m-diag', x: 58, z: 6, width: 2.5, depth: 18, label: '12 Meter Road', labelRotation: -Math.PI / 4 },

  // --- 9 Meter Roads ---
  { id: 'road-9m-v1', x: -5.5, z: -7, width: 2.0, depth: 28, label: '9 Meter Road', labelRotation: -Math.PI / 2 },
  { id: 'road-9m-v2', x: 34.5, z: -8, width: 2.0, depth: 28, label: '9 Meter Road', labelRotation: -Math.PI / 2 },

  // --- 8 Meter Road ---
  { id: 'road-8m-v1', x: 8, z: -7, width: 1.8, depth: 28, label: '8 Meter Road', labelRotation: -Math.PI / 2 },

  // --- 6 Meter Road ---
  { id: 'road-6m-v1', x: 23, z: -8, width: 1.5, depth: 28, label: '6 Meter Road', labelRotation: -Math.PI / 2 },

  // --- 5 Meter Roads ---
  { id: 'road-5m-v1', x: 57.5, z: -8, width: 1.2, depth: 20, label: '5 Meter Road', labelRotation: -Math.PI / 2 },
];

// ============================================================
// TREES — along roads and block boundaries
// ============================================================
function generateTreeRow(
  startX: number, startZ: number,
  count: number, dx: number, dz: number,
  color = '#2d6b1e'
): TreeData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `tree-${startX.toFixed(0)}-${startZ.toFixed(0)}-${i}`,
    x: startX + i * dx,
    z: startZ + i * dz,
    scale: 0.6 + ((i * 7 + 3) % 10) * 0.04,
    color: i % 6 === 3 ? '#c45ba0' : i % 8 === 5 ? '#9b59b6' : color,
  }));
}

export const trees: TreeData[] = [
  // Top road tree line (north)
  ...generateTreeRow(-52, -24, 28, 4.0, 0),
  // Bottom boundary tree line (south, left side)
  ...generateTreeRow(-52,  20, 14, 4.0, 0),
  // Left perimeter trees
  ...generateTreeRow(-56, -17, 7, 0, 5),
  // Between major blocks
  ...generateTreeRow(-47.5, -17, 7, 0, 5.5),
  ...generateTreeRow(-35, -17, 7, 0, 5.5),
  ...generateTreeRow(-22, -17, 7, 0, 5.5),
  ...generateTreeRow(-5.5, -17, 6, 0, 5.5),
  ...generateTreeRow(8, -17, 6, 0, 5.5),
  // Right side trees
  ...generateTreeRow(62, -14, 5, 0, 3.5),
  // Diagonal entry road trees
  ...generateTreeRow(54, 2, 4, 2.5, 2.5),
  // Park area trees
  ...generateTreeRow(-52, 23, 3, 3, 0, '#1a5c0f'),
  ...generateTreeRow(-50, 27, 2, 4, 0, '#1a5c0f'),
];

// ============================================================
// SPECIAL AREAS
// ============================================================
export const specialAreas: SpecialArea[] = [
  {
    id: 'park',
    type: 'park',
    x: -48,
    z: 26,
    width: 10,
    depth: 8,
    label: 'PARK AREA',
    color: '#3a7d34',
  },
  {
    id: 'kids-play',
    type: 'kidsPlay',
    x: -37,
    z: 26,
    width: 7,
    depth: 8,
    label: 'KIDS PLAY\nAREA',
    color: '#4a9a3f',
  },
  {
    id: 'common-plot',
    type: 'commonPlot',
    x: -18,
    z: 14,
    width: 16,
    depth: 8,
    label: 'COMMON PLOT',
    color: '#555555',
  },
  {
    id: 'entry',
    type: 'entry',
    x: 62,
    z: 10,
    width: 4,
    depth: 3,
    label: 'ENTRY',
    color: '#3b82f6',
  },
];
