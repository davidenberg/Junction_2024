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

export default function DashboardPage() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main>
        <div className="md:hidden">
          <img
            src="/examples/dashboard-light.png"
            width={1280}
            height={866}
            alt="Dashboard"
            className="block dark:hidden"
          />
          <img
            src="/examples/dashboard-dark.png"
            width={1280}
            height={866}
            alt="Dashboard"
            className="hidden dark:block"
          />
        </div>
        <div className="hidden flex-col md:flex">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <AreaSwitcher />
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
                <Button>Update</Button>
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
                      <div className="text-2xl font-bold">2350</div>
                      <p className="text-xs text-muted-foreground">
                        +103 from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Observation Period</CardTitle>
                      <Telescope />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">257 days</div>
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
                      <ForestationChart />
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
            </Tabs>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}