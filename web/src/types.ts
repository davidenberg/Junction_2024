export type SatelliteImageData = {
  satellite: string;
  segmented: string;
  forestationRate: number;
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
