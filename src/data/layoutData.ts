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



function createPlot(
  num: number,
  x: number,
  z: number,
  width: number,
  depth: number,
  block: string,
  category: PlotData['category'] = 'Residential',
  statusOverride?: PlotData['status']
): PlotData {
  const hash = ((num * 7 + 13) % 100);
  let status: PlotData['status'] = 'available';
  if (!statusOverride) {
    if (hash > 82) status = 'sold';
    else if (hash > 70) status = 'corner';
  } else {
    status = statusOverride;
  }
  const finalCategory = (status === 'corner') ? 'Corner' : category;

  return {
    id: `plot-${num}-${block}-${x}-${z}`, // Guaranteed unique
    number: String(num),
    block,
    category: finalCategory,
    status,
    price: Math.floor(180 + (num * 3.7 % 120)) * 1000,
    area: Math.floor(width * depth * 100),
    x, z, width, depth,
  };
}

// --- Standard dimensions ---
const PW = 3.0;   // standard plot width  (~9m real)
const PD = 3.5;   // standard plot depth  (~10.5m real)
const PWs = 2.5;  // small plot width     (~7.5m real)
const PDs = 3.0;  // small plot depth     (~9m real)


// ============================================================
// BLOCK K — Far-left, single column (plots 114→101,105,108,109,110,111,112,113,114)
// ============================================================
const blockK: PlotData[] = [
  createPlot(114, -52, -18,  PW, PD, 'K', 'Residential'),
  createPlot(113, -52, -14,  PW, PD, 'K', 'Residential'),
  createPlot(112, -52, -10,   PW, PD, 'K', 'Residential'),
  createPlot(111, -52, -6,   PW, PD, 'K', 'Residential'),
  createPlot(110, -52, -2,   PW, PD, 'K', 'Residential'),
  createPlot(109, -52,  2,   PW, PD, 'K', 'Residential'),
  createPlot(108, -52,  6,   PW, PD, 'K', 'Residential'),
  createPlot(105, -52, 10,   PW, PD, 'K', 'Residential'),
  createPlot(101, -52, 14,   PW, PD, 'K', 'Residential'),
];

// ============================================================
// BLOCK J — 3-column block (left interior)
// Col 1: 59,86,97,94,100,101,103,102,101
// Col 2: 93,92,92,91,90,99,98,88,87
// ============================================================
const blockJ_col1: PlotData[] = [
  createPlot(59,  -44, -18.5, PW, PD, 'J', 'Residential'),
  createPlot(86,  -44, -14.5, PW, PD, 'J', 'Residential'),
  createPlot(97,  -44, -10.5, PW, PD, 'J', 'Residential'),
  createPlot(94,  -44, -6.5,  PW, PD, 'J', 'Residential'),
  createPlot(100, -44, -2.5,  PW, PD, 'J', 'Residential'),
  createPlot(101, -44,  9.5,  PW, PD, 'J', 'Residential'),
  createPlot(103, -44,  13.5, PW, PD, 'J', 'Residential'),
  createPlot(102, -44,  17.5, PW, PD, 'J', 'Residential'),
  createPlot(101, -44,  21.5, PW, PD, 'J', 'Residential'),
];
const blockJ_col2: PlotData[] = [
  createPlot(93, -40.5, -18.5, PW, PD, 'J', 'Residential'),
  createPlot(92, -40.5, -14.5, PW, PD, 'J', 'Residential'),
  createPlot(92, -40.5, -10.5, PW, PD, 'J', 'Residential'),
  createPlot(91, -40.5, -6.5,  PW, PD, 'J', 'Residential'),
  createPlot(90, -40.5, -2.5,  PW, PD, 'J', 'Residential'),
  createPlot(99, -40.5,  9.5,  PW, PD, 'J', 'Residential'),
  createPlot(98, -40.5,  13.5, PW, PD, 'J', 'Residential'),
  createPlot(88, -40.5,  17.5, PW, PD, 'J', 'Residential'),
  createPlot(87, -40.5,  21.5, PW, PD, 'J', 'Residential'),
];

// ============================================================
// BLOCK I — 2-column block
// Col 1: 76,78,78,70,69,80,81,82,83,84
// Col 2: 74,70,71,70,68,67,66,65,64
// ============================================================
const blockI_col1: PlotData[] = [
  createPlot(76, -30, -18, PW, PD, 'I', 'Residential'),
  createPlot(78, -30, -14, PW, PD, 'I', 'Residential'),
  createPlot(78, -30, -10,  PW, PD, 'I', 'Residential'),
  createPlot(70, -30, -6,  PW, PD, 'I', 'Residential'),
  createPlot(69, -30, -2,  PW, PD, 'I', 'Residential'),
  createPlot(80, -30,  2,  PW, PD, 'I', 'Residential'),
  createPlot(81, -30,  6,  PW, PD, 'I', 'Residential'),
  createPlot(82, -30, 10,  PW, PD, 'I', 'Residential'),
  createPlot(83, -30, 14,  PW, PD, 'I', 'Residential'),
  createPlot(84, -30, 18,  PW, PD, 'I', 'Residential'),
];
blockI_col1[2].id = 'plot-78b';
const blockI_col2: PlotData[] = [
  createPlot(74, -26.5, -18, PW, PD, 'I', 'Residential'),
  createPlot(70, -26.5, -14, PW, PD, 'I', 'Residential'),
  createPlot(71, -26.5, -10,  PW, PD, 'I', 'Residential'),
  createPlot(70, -26.5, -6,  PW, PD, 'I', 'Residential'),
  createPlot(68, -26.5, -2,  PW, PD, 'I', 'Residential'),
  createPlot(67, -26.5,  2,  PW, PD, 'I', 'Residential'),
  createPlot(66, -26.5,  6,  PW, PD, 'I', 'Residential'),
  createPlot(65, -26.5, 10,  PW, PD, 'I', 'Residential'),
  createPlot(64, -26.5, 14,  PW, PD, 'I', 'Residential'),
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
  createPlot(57, -17, -18, PW, PD, 'H', 'Residential'),
  createPlot(58, -17, -14, PW, PD, 'H', 'Residential'),
  createPlot(59, -17, -10,  PW, PD, 'H', 'Residential'),
  createPlot(61, -17, -6,  PW, PD, 'H', 'Residential'),
  createPlot(62, -17, -2,  PW, PD, 'H', 'Residential'),
  createPlot(63, -17,  2,  PW, PD, 'H', 'Residential'),
];
blockH_col1[2].id = 'plot-59b';
const blockH_col2: PlotData[] = [
  createPlot(56, -13.5, -18, PW, PD, 'H', 'Residential'),
  createPlot(54, -13.5, -14, PW, PD, 'H', 'Residential'),
  createPlot(53, -13.5, -10,  PW, PD, 'H', 'Residential'),
  createPlot(52, -13.5, -6,  PW, PD, 'H', 'Residential'),
  createPlot(51, -13.5, -2,  PW, PD, 'H', 'Residential'),
  createPlot(50, -13.5,  2,  PW, PD, 'H', 'Residential'),
];
const blockH_col3: PlotData[] = [
  createPlot(54, -10, -18, PW, PD, 'H', 'Residential'),
  createPlot(53, -10, -14, PW, PD, 'H', 'Residential'),
  createPlot(52, -10, -10,  PW, PD, 'H', 'Residential'),
  createPlot(50, -10, -6,  PW, PD, 'H', 'Residential'),
  createPlot(40, -10,  2,  PW, PD, 'H', 'Residential'),
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
  createPlot(43, -2, -18, PW, PD, 'G', 'Residential'),
  createPlot(44, -2, -14, PW, PD, 'G', 'Residential'),
  createPlot(49, -2, -10,  PW, PD, 'G', 'Residential'),
  createPlot(39, -2, -6,  PW, PD, 'G', 'Residential'),
  createPlot(47, -2, -2,  PW, PD, 'G', 'Residential'),
  createPlot(48, -2,  2,  PW, PD, 'G', 'Residential'),
];
const blockG_col2: PlotData[] = [
  createPlot(42, 1.5, -18, PW, PD, 'G', 'Residential'),
  createPlot(40, 1.5, -14, PW, PD, 'G', 'Residential'),
  createPlot(38, 1.5, -10,  PW, PD, 'G', 'Residential'),
  createPlot(37, 1.5, -6,  PW, PD, 'G', 'Residential'),
  createPlot(48, 1.5, -2,  PW, PD, 'G', 'Residential'),
];
blockG_col2[4].id = 'plot-48b';
const blockG_col3: PlotData[] = [
  createPlot(42, 5, -18, PW, PD, 'G', 'Residential'),
];
blockG_col3[0].id = 'plot-42b';

// ============================================================
// BLOCK F — 3-column block (center-right)
// Col 1: 31,32,26,34,35,23   Col 2: 30,27,25,24,22
// Col 3: 28,20,21,12
// ============================================================
const blockF_col1: PlotData[] = [
  createPlot(31, 12, -18, PW, PD, 'F', 'Premium'),
  createPlot(32, 12, -14, PW, PD, 'F', 'Premium'),
  createPlot(26, 12, -10,  PW, PD, 'F', 'Premium'),
  createPlot(34, 12, -6,  PW, PD, 'F', 'Premium'),
  createPlot(35, 12, -2,  PW, PD, 'F', 'Premium'),
  createPlot(23, 12,  2,  PW, PD, 'F', 'Premium'),
];

const blockF_col2: PlotData[] = [
  createPlot(30, 15.5, -18, PW, PD, 'F', 'Premium'),
  createPlot(27, 15.5, -14, PW, PD, 'F', 'Premium'),
  createPlot(25, 15.5, -10,  PW, PD, 'F', 'Premium'),
  createPlot(24, 15.5, -6,  PW, PD, 'F', 'Premium'),
  createPlot(22, 15.5,  2,  PW, PD, 'F', 'Premium'),
];
const blockF_col3: PlotData[] = [
  createPlot(28, 19, -18, PW, PD, 'F', 'Premium'),
  createPlot(20, 19, -14, PW, PD, 'F', 'Premium'),
  createPlot(21, 19, -10,  PW, PD, 'F', 'Premium'),
  createPlot(12, 19,  2,  PW, PD, 'F', 'Premium'),
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
  createPlot(15, 37.5, -18.5, PWs, PDs, 'D', 'Commercial'),
  createPlot(14, 39.8, -18.5, PWs, PDs, 'D', 'Commercial'),
  createPlot(13, 42.1, -18.5, PWs, PDs, 'D', 'Commercial'),
  createPlot(12, 44.4, -18.5, PWs, PDs, 'D', 'Commercial'),
  createPlot(11, 46.7, -18.5, PWs, PDs, 'D', 'Commercial'),
  createPlot(10, 49.0, -18.5, PWs, PDs, 'D', 'Commercial'),
  createPlot(9,  51.3, -18.5, PWs, PDs, 'D', 'Commercial'),
  createPlot(7,  53.6, -18.5, PWs, PDs, 'D', 'Commercial'),
  createPlot(6,  55.5, -18.5, PWs, PDs, 'D', 'Commercial'),
  createPlot(5,  57.4, -18.5, PWs, PDs, 'D', 'Commercial'),
  createPlot(3,  59.3, -18.5, PWs, PDs, 'D', 'Commercial'),
  createPlot(2,  61.2, -18.5, PWs, PDs, 'D', 'Commercial'),
  createPlot(1,  63.1, -18.5, PWs, PDs, 'D', 'Commercial'),
];
// Deduplicate IDs
blockD_top.forEach((p) => { p.id = `plot-${p.number}d`; });

const blockD_bot: PlotData[] = [
  createPlot(18, 37.5, 12, PWs, PDs, 'D', 'Commercial'),
  createPlot(27, 39.8, 12, PWs, PDs, 'D', 'Commercial'),
  createPlot(25, 42.1, 12, PWs, PDs, 'D', 'Commercial'),
  createPlot(24, 44.4, 12, PWs, PDs, 'D', 'Commercial'),
  createPlot(23, 46.7, 12, PWs, PDs, 'D', 'Commercial'),
  createPlot(13, 49.0, 12, PWs, PDs, 'D', 'Commercial'),
  createPlot(12, 51.3, 12, PWs, PDs, 'D', 'Commercial'),
  createPlot(11, 53.6, 12, PWs, PDs, 'D', 'Commercial'),
  createPlot(10, 55.5, 12, PWs, PDs, 'D', 'Commercial'),
  createPlot(9,  57.4, 12, PWs, PDs, 'D', 'Commercial'),
  createPlot(8,  59.3, 12, PWs, PDs, 'D', 'Commercial'),
  createPlot(7,  61.2, 12, PWs, PDs, 'D', 'Commercial'),
];
blockD_bot.forEach((p) => { p.id = `plot-${p.number}db`; });

// ============================================================
// BLOCK A — Far-right vertical strip (6 plots near entry)
// Top→Bottom: 6,5,4,3,2,1
// ============================================================
const blockA: PlotData[] = [
  createPlot(6, 75, -18.5, 2.4, 3.2, 'A', 'Commercial'),
  createPlot(5, 75, -14.5, 2.4, 3.2, 'A', 'Commercial'),
  createPlot(4, 75, -10.5, 2.4, 3.2, 'A', 'Commercial'),
  createPlot(3, 75, -6.5,  2.4, 3.2, 'A', 'Commercial'),
  createPlot(2, 75, -2.5,  2.4, 3.2, 'A', 'Commercial'),
  createPlot(1, 75,  1.5,  2.4, 3.2, 'A', 'Commercial'),
];
// No more forEach manual deduction needed as block is in the helper

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
