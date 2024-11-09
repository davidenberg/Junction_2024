export type SatelliteImageData = {
  satellite: string;
  segmented: string;
};

export type Detection =
  | {
      date: string;
      type: 'LS';
      x_cord: string;
      y_cord: string;
    }
  | {
      date: string;
      type: 'DAI';
      x_cord: string;
      y_cord: string;
      area_change: number;
    };

export type TotalCoverage = {
  total_coverage: string;
};

export type AreaCoverage = {
  date: string;
  coverage: string;
};

export type Statistics = [TotalCoverage, [], ...AreaCoverage[]];
