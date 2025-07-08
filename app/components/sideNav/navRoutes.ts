import { Squares2X2Icon, TruckIcon, CreditCardIcon, ChatBubbleBottomCenterTextIcon, Cog6ToothIcon, ArrowRightStartOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export const navRoutes = [
    {
        label: "Dashboard",
        path: "/user_dashboard/dashboard",
        icon: Squares2X2Icon,
    },
    {
        label: "My Wallet",
        path: "/user_dashboard/dashboard/wallet",
        icon: CreditCardIcon,
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
        label: "Profile",
        path: "/user_dashboard/profile",
        icon: UserCircleIcon,
    },
    {
        label: "Settings",
        path: "/user_dashboard/dashboard/settings",
        icon: Cog6ToothIcon,
    },
    {
        label: "Logout",
        path: "#",
        icon: ArrowRightStartOnRectangleIcon,
        action: "logout"
    },
];