"use client";
import { User } from "@/app/utils/auth";

interface ProfileAvatarProps {
    user: User | null;
    profileImageUrl?: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showBorder?: boolean;
}

export default function ProfileAvatar({
    user,
    profileImageUrl,
    size = 'md',
    className = '',
    showBorder = false
}: ProfileAvatarProps) {
    const getUserInitials = () => {
        if (!user) return "U";
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'w-8 h-8 text-sm';
            case 'md':
                return 'w-12 h-12 text-lg';
            case 'lg':
                return 'w-16 h-16 text-xl';
            case 'xl':
                return 'w-24 h-24 text-2xl';
            default:
                return 'w-12 h-12 text-lg';
        }
    };

    const sizeClasses = getSizeClasses();
    const borderClasses = showBorder ? 'ring-2 ring-white shadow-lg' : '';

    if (profileImageUrl) {
        return (
            <div className={`${sizeClasses} rounded-full overflow-hidden shadow-lg ${borderClasses} ${className}`}>
                <img
                    src={profileImageUrl}
                    alt={`${user?.firstName || 'User'} ${user?.lastName || ''}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                            parent.innerHTML = `
                                <div class="w-full h-full bg-gradient-to-br from-[#191970] via-blue-500 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold ${sizeClasses.includes('text-2xl') ? 'text-2xl' : sizeClasses.includes('text-xl') ? 'text-xl' : sizeClasses.includes('text-lg') ? 'text-lg' : sizeClasses.includes('text-base') ? 'text-base' : sizeClasses.includes('text-sm') ? 'text-sm' : 'text-xs'}">
                                    ${getUserInitials()}
                                </div>
                            `;
                        }
                    }}
                />
            </div>
        );
    }

    return (
        <div className={`${sizeClasses} bg-gradient-to-br from-[#191970] via-blue-500 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${borderClasses} ${className}`}>
            {getUserInitials()}
        </div>
    );
} 