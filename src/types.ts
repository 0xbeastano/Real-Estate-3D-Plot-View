export type PlotStatus = 'available' | 'sold' | 'reserved';

export interface PlotData {
  id: string;
  number: string;
  status: PlotStatus;
  price: number;
  area: number;
  x: number;
  z: number;
  width: number;
  depth: number;
}

export interface RoadData {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  label?: string;
  labelRotation?: number;
}

export interface TreeData {
  id: string;
  x: number;
  z: number;
  scale: number;
  color: string;
}

export interface SpecialArea {
  id: string;
  type: 'park' | 'kidsPlay' | 'commonPlot' | 'entry';
  x: number;
  z: number;
  width: number;
  depth: number;
  label: string;
  color: string;
}
