export interface GraphPoint {
  minute: number;   // can be fractional (e.g. 45.5)
  value: number;    // -100 to +100 range, positive = home, negative = away
}

export interface EventGraph {
  graphPoints: GraphPoint[];
  periodTime: number;       // 45 for standard football
  overtimeLength: number;   // 15 for standard ET
  periodCount: number;      // 2 (normal), 4 (extra time)
}
