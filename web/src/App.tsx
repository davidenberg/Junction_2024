/* eslint-disable react-hooks/exhaustive-deps */
import ReactCompareImage from 'react-compare-image';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { MainNav } from "@/components/main-nav";
import { ForestationChart } from "@/components/forestation-chart";
import { RecentAlerts } from "@/components/recent-alerts";
import AreaSwitcher from "@/components/area-switcher";
import { ThemeProvider } from './components/theme-provider';
import { BadgeAlert, Satellite, Telescope, TreePine } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './components/ui/carousel';
import { AreaCoverage, Detection, SatelliteImageData, Statistics, TotalCoverage } from './types';
import { formatDistanceToNow, subMonths } from 'date-fns';
import { useEffect, useState } from 'react';

// const AREA_IMAGES: { [key: string]: ({ [key: string]: SatelliteImageData; }); } = {
//   'area-1': {
//     '2020-07-01': {
//       satellite: '2020-07-01-S2-grid.jpg',
//       segmented: '2020-07-01-S2-segmented.jpg',
//       forestationRate: 0.95
//     },
//     '2022-04-01': {
//       satellite: '2022-04-01-S2-grid.jpg',
//       segmented: '2022-04-01-S2-segmented.jpg',
//       forestationRate: 0.8,
//     },
//     '2022-10-01': {
//       satellite: '2022-10-01-S2-grid.jpg',
//       segmented: '2022-10-01-S2-segmented.jpg',
//       forestationRate: 0.75,
//     }
//   }
// };


export default function DashboardPage() {
  const [selectedArea, setSelectedArea] = useState('area-1');
  const [detections, setDetections] = useState<Detection[]>([]);
  const [totalCoverage, setTotalCoverage] = useState<TotalCoverage>();
  const [areaCoverage, setAreaCoverage] = useState<AreaCoverage[]>([]);
  const [areaMetadata, setAreaMetadata] = useState<{ [key: string]: SatelliteImageData; }>({});
  const firstEntryKey = Object.keys(areaMetadata).sort((a, b) => new Date(a.substring(0, 10)).getTime() - new Date(b.substring(0, 10)).getTime())[0];


  const getCarouselImages = (data: SatelliteImageData) => {
    const satelliteImageUrl = `${selectedArea}/${data.satellite}`;
    const segmentedImageUrl = `${selectedArea}/${data.segmented}`;
    return { leftImage: satelliteImageUrl, rightImage: segmentedImageUrl };
  };

  const getAreaMetadata = async () => {
    const res = await fetch(`${selectedArea}/metadata.json`);
    setAreaMetadata(await res.json());
  };

  const getAreaDetections = async () => {
    const res = await fetch(`${selectedArea}/detections.json`);
    setDetections(await res.json());
  };

  const getAreaStatistics = async () => {
    const res = await fetch(`${selectedArea}/statistics.json`);
    const statistics: Statistics = await res.json();
    setTotalCoverage(statistics[0]);
    setAreaCoverage(statistics.slice(2) as AreaCoverage[]);
  };

  useEffect(() => {
    getAreaMetadata();
    getAreaDetections();
    getAreaStatistics();
  }, [selectedArea]);


  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main>
        <div className="hidden flex-col md:flex">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <AreaSwitcher onSelectedAreaChange={(area) => setSelectedArea(area)} />
              <MainNav className="mx-6" />
              <div className="ml-auto flex items-center space-x-4">
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <div className="flex items-center space-x-2">
                <CalendarDateRangePicker />
                <Button disabled>Update</Button>
              </div>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="map">
                  Map
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Forest Area
                      </CardTitle>
                      <TreePine />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalCoverage?.total_coverage} ha</div>
                      <p className="text-xs text-muted-foreground">
                        {Number(areaCoverage.at(-1)?.coverage?.replace('%', '')).toFixed(2)}% of total area
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Satellite Images
                      </CardTitle>
                      <Satellite />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{Object.keys(areaMetadata).length}</div>
                      <p className="text-xs text-muted-foreground">
                        +{
                          Object.keys(areaMetadata).filter((date) => new Date(date.substring(0, 10)) > subMonths(new Date(), 1)).length
                        } from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Observation Period</CardTitle>
                      <Telescope />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold"> {firstEntryKey && formatDistanceToNow(new Date(firstEntryKey.substring(0, 10)))}</div>
                      <p className="text-xs text-muted-foreground">
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Alerts
                      </CardTitle>
                      <BadgeAlert />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{detections.length}</div>
                      <p className="text-xs text-muted-foreground">
                        +{detections.filter(({ date }) => new Date(date) > subMonths(new Date(), 1)).length} since last month
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Forest Coverage</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <ForestationChart data={areaMetadata} coverage={areaCoverage} />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Alerts</CardTitle>
                      <CardDescription>
                        There are 5 new alerts for this area
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="max-h-[40vh] overflow-auto">
                      <RecentAlerts alerts={detections} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="map" className="space-y-4">
                <div className="flex justify-center ">
                  <Carousel className="w-full max-w-[50vw]" draggable={false} opts={{ dragFree: true, watchDrag: false }}>
                    <CarouselContent>
                      {Object.keys(areaMetadata).map((key, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1 pt-0">
                            <Card>
                              <CardTitle className='text-center mt-8'>{key.substring(0, 10)}</CardTitle>
                              <CardContent className="flex aspect-square items-center justify-center p-6 w-full h-full max-h-[70vh]">
                                <ReactCompareImage {...getCarouselImages(areaMetadata[key])} sliderPositionPercentage={1} />
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}