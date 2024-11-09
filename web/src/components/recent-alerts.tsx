import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Detection } from '@/types';
import { Axe, Trees } from 'lucide-react';

interface ForestationProps {
  date: string;
  x: string;
  y: string;
}
function NewDeforestation({ date, x, y }: ForestationProps) {
  return (<div className="flex items-center">
    <Avatar className="h-9 w-9">
      <AvatarFallback>
        <Trees />
      </AvatarFallback>
    </Avatar>
    <div className="ml-4 space-y-1">
      <p className="text-sm font-medium leading-none">New Deforestation Area</p>
      <p className="text-sm text-muted-foreground">
        A new deforestation area has been detected at ({x}, {y}).
      </p>
    </div>
    <div className="ml-auto font-medium">{date}</div>
  </div>);
}

interface DeforestationProps {
  date: string;
  increase: number;
  x: string;
  y: string;
}
function ExpandingDeforestation({ date, increase, x, y }: DeforestationProps) {
  return (
    <div className="flex items-center">
      <Avatar className="h-9 w-9">
        <AvatarFallback>
          <Axe />
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">Expanding Deforestation Area</p>
        <p className="text-sm text-muted-foreground">
          The deforestation area at ({x}, {y}) has increased by {increase} %pt.
        </p>
      </div>
      <div className="ml-auto font-medium">{date}</div>
    </div>
  );
}

interface RecentAlertsProps {
  alerts: Detection[];
}
export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <div className="space-y-8">
      {alerts?.map((detection) => {
        const date = detection.date.substring(0, 10);
        if (detection.type === 'LS') {
          return <NewDeforestation date={date} x={detection.x_cord} y={detection.y_cord} />;
        }
        return <ExpandingDeforestation date={date} increase={detection.area_change} x={detection.x_cord} y={detection.y_cord} />;
      })}
    </div>
  );
};