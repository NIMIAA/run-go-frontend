import {
  Squares2X2Icon,
  TruckIcon,
  CreditCardIcon,
  ChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

import {
  Squares2X2Icon as SolidSquares2X2Icon,
  TruckIcon as SolidTruckIcon,
  CreditCardIcon as SolidCreditCardIcon,
  ChatBubbleBottomCenterTextIcon as SolidChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon as SolidCog6ToothIcon,
} from "@heroicons/react/24/solid";

export const routes = [
  {
    label: "Dashboard",
    path: "/user_dashboard/dashboard",
    icon: Squares2X2Icon,
    activeIcon: SolidSquares2X2Icon,
  },
  {
    label: "Rides",
    path: "/user_dashboard/dashboard/rides",
    icon: TruckIcon,
    activeIcon: SolidTruckIcon,
  },
  {
    label: "Payments",
    path: "/user_dashboard/dashboard/payments",
    icon: CreditCardIcon,
    activeIcon: SolidCreditCardIcon,
  },
  {
    label: "Messages",
    path: "/user_dashboard/dashboard/messages",
    icon: ChatBubbleBottomCenterTextIcon,
    activeIcon: SolidChatBubbleBottomCenterTextIcon,
  },
  {
    label: "Settings",
    path: "/user_dashboard/dashboard/settings",
    icon: Cog6ToothIcon,
    activeIcon: SolidCog6ToothIcon,
  },
];
