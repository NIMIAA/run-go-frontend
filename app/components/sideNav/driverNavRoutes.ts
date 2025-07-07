import {
    Squares2X2Icon,
    TruckIcon,
    CreditCardIcon,
    ChatBubbleBottomCenterTextIcon,
    Cog6ToothIcon,
    ArrowRightStartOnRectangleIcon,
    UserCircleIcon,
    MapPinIcon,
    ClockIcon,
    StarIcon
} from "@heroicons/react/24/outline";

export const driverNavRoutes = [
    {
        label: "Dashboard",
        path: "/driver_dashboard/dashboard",
        icon: Squares2X2Icon,
    },
    {
        label: "Active Rides",
        path: "/driver_dashboard/rides",
        icon: TruckIcon,
    },
    {
        label: "Ride History",
        path: "/driver_dashboard/history",
        icon: ClockIcon,
    },
    {
        label: "Earnings",
        path: "/driver_dashboard/earnings",
        icon: CreditCardIcon,
    },
    {
        label: "Location",
        path: "/driver_dashboard/location",
        icon: MapPinIcon,
    },
    {
        label: "Profile",
        path: "/driver_dashboard/profile",
        icon: UserCircleIcon,
    },
    {
        label: "Settings",
        path: "/driver_dashboard/settings",
        icon: Cog6ToothIcon,
    },
    {
        label: "Logout",
        path: "#",
        icon: ArrowRightStartOnRectangleIcon,
        action: "logout"
    },
]; 