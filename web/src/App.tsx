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
import { SatelliteImageData } from './types';
import { formatDistanceToNow, subMonths } from 'date-fns';
import { useState } from 'react';

const AREA_IMAGES: { [key: string]: ({ [key: string]: SatelliteImageData; }); } = {
  'area-1': {
    '2020-07-01': {
      satellite: '2020-07-01-S2-grid.jpg',
      segmented: '2020-07-01-S2-segmented.jpg',
      forestationRate: 0.95
    },
    '2022-04-01': {
      satellite: '2022-04-01-S2-grid.jpg',
      segmented: '2022-04-01-S2-segmented.jpg',
      forestationRate: 0.8,
    },
    '2022-10-01': {
      satellite: '2022-10-01-S2-grid.jpg',
      segmented: '2022-10-01-S2-segmented.jpg',
      forestationRate: 0.75,
    }
  }
};


export default function DashboardPage() {
  const [selectedArea, setSelectedArea] = useState('area-1');
  const activeAreaImages = AREA_IMAGES[selectedArea];
  const firstEntryKey = Object.keys(activeAreaImages).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];

  const getCarouselImages = (data: SatelliteImageData) => {
    const satelliteImageUrl = `${selectedArea}/${data.satellite}`;
    const segmentedImageUrl = `${selectedArea}/${data.segmented}`;
    return { leftImage: satelliteImageUrl, rightImage: segmentedImageUrl };
  };

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
                      <div className="text-2xl font-bold">3.32 km²</div>
                      <p className="text-xs text-muted-foreground">
                        -5.2% from last month
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
                      <div className="text-2xl font-bold">{Object.keys(activeAreaImages).length}</div>
                      <p className="text-xs text-muted-foreground">
                        +{
                          Object.keys(activeAreaImages).filter((date) => new Date(date) < subMonths(new Date(), 1)).length
                          - Object.keys(activeAreaImages).length} from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Observation Period</CardTitle>
                      <Telescope />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold"> {formatDistanceToNow(new Date(firstEntryKey))}</div>
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
                      <div className="text-2xl font-bold">27</div>
                      <p className="text-xs text-muted-foreground">
                        +1 since last month
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
                      <ForestationChart data={activeAreaImages} />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Alerts</CardTitle>
                      <CardDescription>
                        There are 5 new alerts for this area
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentAlerts />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="map" className="space-y-4">
                <div className="flex justify-center ">
                  <Carousel className="w-full max-w-[50vw]" draggable={false} opts={{ dragFree: true, watchDrag: false }}>
                    <CarouselContent>
                      {Object.keys(activeAreaImages).map((key, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1 pt-0">
                            <Card>
                              <CardTitle className='text-center mt-8'>{key}</CardTitle>
                              <CardContent className="flex aspect-square items-center justify-center p-6 w-full h-full max-h-[70vh]">
                                <ReactCompareImage {...getCarouselImages(activeAreaImages[key])} sliderPositionPercentage={1} />
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