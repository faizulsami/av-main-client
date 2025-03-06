import { Users, CheckCircle, HeartHandshake } from "lucide-react";
import { StatsSectionProps } from "./types";

export function StatsSection({ stats }: StatsSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "users":
        return <Users className="w-6 h-6 lg:w-8 lg:h-8" />;
      case "check":
        return <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8" />;
      case "heart":
        return <HeartHandshake className="w-6 h-6 lg:w-8 lg:h-8" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="w-full bg-soft-paste rounded-2xl py-6 lg:py-16 px-4 lg:px-8"
      style={{ backgroundImage: "url('/images/overlay/stat-overlay.png')" }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col justify-between items-center p-4 lg:p-6 rounded-2xl text-white border border-soft-paste-light backdrop-blur-sm space-y-3 font-bold"
            >
              <div className="bg-soft-paste-light text-soft-paste p-2 rounded-lg lg:rounded-2xl">
                {getIcon(stat.icon)}
              </div>
              <div className="flex items-center flex-row text-2xl font-bold lg:text-4xl">
                {stat.value}+
              </div>
              <div className="text-center text-sm lg:text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
