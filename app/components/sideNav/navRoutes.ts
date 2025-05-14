import { Squares2X2Icon,TruckIcon, CreditCardIcon, ChatBubbleBottomCenterTextIcon, Cog6ToothIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

export const navRoutes = [
    {
        label: "Dashboard",
        path: "/user_dashboard/dashboard",
        icon: Squares2X2Icon,
    },
    {
        label: "Rides",
        path: "/user_dashboard/dashboard/rides",
        icon: TruckIcon,
    },
    {
        label: "Payments",
        path: "/user_dashboard/dashboard/payments",
        icon: CreditCardIcon,
    },
    {
        label: "Messages",
        path: "/user_dashboard/dashboard/messages",
        icon: ChatBubbleBottomCenterTextIcon,
    },
    {
        label: "Settings",
        path: "/user_dashboard/dashboard/settings",
        icon: Cog6ToothIcon,
    },
    {
        label: "Logout",
        path: "/user_dashboard/logout",
        icon: ArrowRightStartOnRectangleIcon,
    },
];