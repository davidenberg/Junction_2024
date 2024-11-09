import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Axe, Trees } from 'lucide-react';

interface ForestationProps {
  date: string;
  increase: number;
}
function Forestation({ date, increase }: ForestationProps) {
  return (<div className="flex items-center">
    <Avatar className="h-9 w-9">
      <AvatarFallback>
        <Trees />
      </AvatarFallback>
    </Avatar>
    <div className="ml-4 space-y-1">
      <p className="text-sm font-medium leading-none">Reforestation</p>
      <p className="text-sm text-muted-foreground">
        The forestation area has increased by {increase}%
      </p>
    </div>
    <div className="ml-auto font-medium">{date}</div>
  </div>);
}

interface DeforestationProps {
  date: string;
  decrease: number;
}
function Deforestation({ date, decrease }: DeforestationProps) {
  return (
    <div className="flex items-center">
      <Avatar className="h-9 w-9">
        <AvatarFallback>
          <Axe />
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">Deforestation</p>
        <p className="text-sm text-muted-foreground">
          The forestation area has decreased by {decrease}%
        </p>
      </div>
      <div className="ml-auto font-medium">{date}</div>
    </div>
  );
}

export function RecentAlerts() {
  return (
    <div className="space-y-8">
      <Deforestation date='08.11.2024' decrease={5.2} />
      <Forestation date="02.09.2024" increase={1} />
      <Deforestation date='07.07.2024' decrease={0.7} />
      <Deforestation date='05.04.2024' decrease={1.3} />
      <Forestation date='02.02.2024' increase={0.4} />
    </div>
  );
};