export type PlotStatus = 'available' | 'sold' | 'reserved';
export type PlotCategory = 'standard' | 'corner' | 'park-facing' | 'road-facing' | 'commercial';

export interface PlotData {
  id: string;
  number: string;
  status: PlotStatus;
  size: number;
  price: number;
  category: PlotCategory;
  coordinates: [number, number][];
  dimensions: { width: number; depth: number };
  center: [number, number];
  accessibility: string[];
  usps: string[];
  adjacentPlots: string[];
  section: string;
}

export interface RoadData {
  id: string;
  coordinates: [number, number][];
  type: '12m' | '9m' | '8m' | '6m';
}

export interface AmenityData {
  id: string;
  type: 'park' | 'kids-play' | 'common-plot';
  coordinates: [number, number][];
  label: string;
}

export const plotsData: PlotData[] = [];
export const roadsData: RoadData[] = [];
export const amenitiesData: AmenityData[] = [];
export const boundaryData: [number, number][] = [];

// --- LAYOUT GENERATOR (Precise Image Alignment) ---

// Helper to create a rectangular plot
function createPlot(
  number: string,
  x: number,
  y: number,
  w: number,
  h: number,
  section: string
): PlotData {
  const coordinates: [number, number][] = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h]
  ];
  
  const numInt = parseInt(number.replace(/\D/g, '')) || 0;
  const rand = (numInt * 137) % 100;
  const status: PlotStatus = rand > 85 ? 'sold' : rand > 70 ? 'reserved' : 'available';
  
  return {
    id: `plot-${number}`,
    number,
    status,
    size: Math.round(w * h * 10.764),
    price: Math.round(w * h * 500),
    category: 'standard',
    coordinates,
    dimensions: { width: w, depth: h },
    center: [x + w / 2, y + h / 2],
    accessibility: ['Standard road access'],
    usps: ['Great location'],
    adjacentPlots: [],
    section
  };
}

// Helper to create a quadrilateral plot
function createQuadPlot(
  number: string,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  x4: number, y4: number,
  section: string
): PlotData {
  const coordinates: [number, number][] = [[x1, y1], [x2, y2], [x3, y3], [x4, y4]];
  const numInt = parseInt(number.replace(/\D/g, '')) || 0;
  const rand = (numInt * 137) % 100;
  const status: PlotStatus = rand > 85 ? 'sold' : rand > 70 ? 'reserved' : 'available';
  
  // Approximate width/height for dimensions
  const w = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const h = Math.sqrt(Math.pow(x4 - x1, 2) + Math.pow(y4 - y1, 2));

  return {
    id: `plot-${number}`,
    number,
    status,
    size: Math.round(w * h * 10.764),
    price: Math.round(w * h * 500),
    category: 'standard',
    coordinates,
    dimensions: { width: Math.round(w), depth: Math.round(h) },
    center: [(x1 + x2 + x3 + x4) / 4, (y1 + y2 + y3 + y4) / 4],
    accessibility: ['Standard road access'],
    usps: ['Great location'],
    adjacentPlots: [],
    section
  };
}

// Helper to create a road
function createRoad(id: string, coordinates: [number, number][], type: RoadData['type']): RoadData {
  return { id, type, coordinates };
}

// 1. Top Road (12m)
roadsData.push(createRoad('top-road', [[30, 50], [900, 50], [900, 80], [30, 80]], '12m'));

// 2. Block 1 (Far left)
const b1_ids = [114, 113, 112, 111, 110, 109, 108, 107, 106, 105];
for (let i = 0; i < 10; i++) {
  plotsData.push(createPlot(b1_ids[i]?.toString() || `B1-${i}`, 30, 80 + i * 25, 40, 25, 'Block 1'));
}

// 3. Road 1 (12m)
roadsData.push(createRoad('road-1', [[70, 80], [90, 80], [90, 330], [70, 330]], '12m'));

// 4. Block 2
const b2_l = [85, 86, 98, 97, 96, 95, 94, 103, 102, 101];
const b2_r = [93, 92, 91, 90, 89, 100, 99, 88, 87, 104];
for (let i = 0; i < 10; i++) {
  plotsData.push(createPlot(b2_l[i]?.toString() || `B2L-${i}`, 90, 80 + i * 25, 30, 25, 'Block 2'));
  plotsData.push(createPlot(b2_r[i]?.toString() || `B2R-${i}`, 120, 80 + i * 25, 30, 25, 'Block 2'));
}

// 5. Road 2 (12m)
roadsData.push(createRoad('road-2', [[150, 80], [170, 80], [170, 330], [150, 330]], '12m'));

// 6. Block 3
const b3_l = [76, 77, 78, 79, 80, 81, 82, 83, 84, 115];
const b3_r = [74, 75, 73, 72, 71, 70, 69, 68, 67, 66];
for (let i = 0; i < 10; i++) {
  plotsData.push(createPlot(b3_l[i]?.toString() || `B3L-${i}`, 170, 80 + i * 25, 30, 25, 'Block 3'));
  plotsData.push(createPlot(b3_r[i]?.toString() || `B3R-${i}`, 200, 80 + i * 25, 30, 25, 'Block 3'));
}

// 7. Road 3 (12m)
roadsData.push(createRoad('road-3', [[230, 80], [250, 80], [250, 330], [230, 330]], '12m'));

// 8. Block 4
const b4_l = [57, 58, 59, 60, 61, 62, 63];
const b4_r = [56, 55, 54, 53, 52, 51, 50];
for (let i = 0; i < 7; i++) {
  plotsData.push(createPlot(b4_l[i]?.toString() || `B4L-${i}`, 250, 80 + i * 25, 30, 25, 'Block 4'));
  plotsData.push(createPlot(b4_r[i]?.toString() || `B4R-${i}`, 280, 80 + i * 25, 30, 25, 'Block 4'));
}

// 9. Road 4 (9m)
roadsData.push(createRoad('road-4', [[310, 80], [325, 80], [325, 255], [310, 255]], '9m'));

// 10. Block 5
const b5_l = [43, 44, 45, 46, 47, 48];
const b5_r = [42, 41, 40, 39, 38, 37];
for (let i = 0; i < 6; i++) {
  plotsData.push(createPlot(b5_l[i]?.toString() || `B5L-${i}`, 325, 80 + i * 25, 30, 25, 'Block 5'));
  plotsData.push(createPlot(b5_r[i]?.toString() || `B5R-${i}`, 355, 80 + i * 25, 30, 25, 'Block 5'));
}

// 11. Road 5 (8m)
roadsData.push(createRoad('road-5', [[385, 80], [400, 80], [400, 230], [385, 230]], '8m'));

// 12. Block 6
const b6_l = [31, 32, 33, 34, 35, 36];
const b6_r = [30, 29, 28, 27, 26, 25];
for (let i = 0; i < 6; i++) {
  plotsData.push(createPlot(b6_l[i]?.toString() || `B6L-${i}`, 400, 80 + i * 25, 30, 25, 'Block 6'));
  plotsData.push(createPlot(b6_r[i]?.toString() || `B6R-${i}`, 430, 80 + i * 25, 30, 25, 'Block 6'));
}

// 13. Road 6 (8m)
roadsData.push(createRoad('road-6', [[460, 80], [475, 80], [475, 230], [460, 230]], '8m'));

// 14. Block 7
const b7_l = [18, 19, 20, 21, 22];
const b7_r = [17, 16, 116, 117, 118];
for (let i = 0; i < 5; i++) {
  plotsData.push(createPlot(b7_l[i]?.toString() || `B7L-${i}`, 475, 80 + i * 25, 30, 25, 'Block 7'));
  plotsData.push(createPlot(b7_r[i]?.toString() || `B7R-${i}`, 505, 80 + i * 25, 30, 25, 'Block 7'));
}

// 15. Road 7 (9m)
roadsData.push(createRoad('road-7', [[535, 80], [550, 80], [550, 205], [535, 205]], '9m'));

// 16. Block 8 (Horizontal Angled)
const b8_top = [15, 14, 13, 12, 11, 10, 9, 7, 6, 5, 3, 2, 1];
const b8_bot = [119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131];
const w8 = 300 / 13;
for (let i = 0; i < 13; i++) {
  const x1 = 550 + i * w8;
  const x2 = 550 + (i + 1) * w8;
  
  // Top row
  const y1_top = 80;
  const y2_top = 80;
  const y1_mid = 120 - (i * 20 / 13);
  const y2_mid = 120 - ((i + 1) * 20 / 13);
  plotsData.push(createQuadPlot(`H1-${b8_top[i]}`, x1, y1_top, x2, y2_top, x2, y2_mid, x1, y1_mid, 'Block 8'));
  
  // Bottom row
  const y1_bot = 160 - (i * 40 / 13);
  const y2_bot = 160 - ((i + 1) * 40 / 13);
  plotsData.push(createQuadPlot(`H2-${b8_bot[i]}`, x1, y1_mid, x2, y2_mid, x2, y2_bot, x1, y1_bot, 'Block 8'));
}

// 17. Road 8 (6m)
roadsData.push(createRoad('road-8', [[850, 80], [860, 80], [860, 120], [850, 120]], '6m'));

// 18. Block 9 (Far right)
const b9 = [132, 133, 134, 135];
for (let i = 0; i < 4; i++) {
  plotsData.push(createPlot(b9[i]?.toString() || `B9-${i}`, 860, 80 + i * 20, 30, 20, 'Block 9'));
}

// 19. Entry Road (12m)
roadsData.push(createRoad('entry-road', [[890, 80], [930, 80], [890, 500], [850, 500]], '12m'));

// 20. Amenities
amenitiesData.push({
  id: 'park',
  type: 'park',
  coordinates: [[30, 350], [150, 350], [150, 500], [30, 500]],
  label: 'PARK AREA'
});

amenitiesData.push({
  id: 'kids-play',
  type: 'kids-play',
  coordinates: [[170, 350], [230, 350], [230, 450], [170, 450]],
  label: 'KIDS PLAY AREA'
});

amenitiesData.push({
  id: 'common-plot',
  type: 'common-plot',
  coordinates: [[250, 270], [350, 270], [350, 450], [250, 450]],
  label: 'COMMON PLOT'
});

// 21. Boundary
boundaryData.push(
  [0, 0],
  [1000, 0],
  [1000, 600],
  [0, 600]
);

// Calculate Adjacent Plots
for (const p1 of plotsData) {
  for (const p2 of plotsData) {
    if (p1.id === p2.id) continue;
    const dx = Math.abs(p1.center[0] - p2.center[0]);
    const dy = Math.abs(p1.center[1] - p2.center[1]);
    const maxDx = (p1.dimensions.width + p2.dimensions.width) / 2 + 1;
    const maxDy = (p1.dimensions.depth + p2.dimensions.depth) / 2 + 1;
    const isAdjacent = (dx <= maxDx && dy < 2) || (dy <= maxDy && dx < 2);
    if (isAdjacent) p1.adjacentPlots.push(p2.id);
  }
}
