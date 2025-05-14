import ActivityCard, {
  ActivityCardInterface,
} from "@/app/components/cards/ActivityCard";
import { CheckIcon } from "@heroicons/react/16/solid";

export default function DashboardPage() {
  const activities: ActivityCardInterface[] = [
    {
      label: "Active Drivers",
      value: "45 personnels",
      statistics: {
        increase: true,
        value: 3,
      },
    },

    {
      label: "Revenue",
      value: "₦450,000.0045",
      statistics: {
        increase: true,
        value: 12,
      },
    },

    {
      label: "Onboarded Admin",
      value: "12",
    },
    {
      icon: <CheckIcon className="size-6" />,
      label: "Successful transaction",
      value: "345",
      statistics: {
        increase: true,
        value: 3,
      },
    },
  ];

  return (
    <>
      <div className="">
        <h2 className="text-2xl md:text-4xl font-bold">Hi Alex 👋</h2>
        <p className="text-gray-500 md:mt-2">How do you do today!</p>
      </div>

    
    </>
  );
}
