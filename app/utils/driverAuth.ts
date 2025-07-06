// Driver Authentication utility functions

export interface Driver {
    identifier: string;
    carIdentifier: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateAdded: Date;
    lastUpdatedAt: Date;
    isVerified: boolean;
    isAvailable: boolean;
    completedRides: number;
    averageRating: number;
    currentLatitude: number | null;
    currentLongitude: number | null;
}

// Token management
export const getDriverAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('driverJwtToken');
    }
    return null;
};

export const setDriverAuthToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('driverJwtToken', token);
    }
};

export const removeDriverAuthToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('driverJwtToken');
    }
};

// Driver data management
export const getDriverData = (): Driver | null => {
    if (typeof window !== 'undefined') {
        const driverData = localStorage.getItem('driver');
        if (driverData) {
            try {
                return JSON.parse(driverData);
            } catch (error) {
                console.error('Error parsing driver data:', error);
                return null;
            }
        }
    }
    return null;
};

export const setDriverData = (driver: Driver): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('driver', JSON.stringify(driver));
    }
};

export const removeDriverData = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('driver');
    }
};

// Authentication state
export const isDriverAuthenticated = (): boolean => {
    const token = getDriverAuthToken();
    return !!token;
};

export const isDriverVerified = (): boolean => {
    const driver = getDriverData();
    return driver?.isVerified || false;
};

// Logout function
export const driverLogout = (): void => {
    removeDriverAuthToken();
    removeDriverData();
    // Clear any other auth-related data
    if (typeof window !== 'undefined') {
        localStorage.removeItem('driverVerificationEmail');
        // Redirect to login page
        window.location.href = '/authentication/drivers-login';
    }
};

// Location management
export const updateDriverLocation = (latitude: number, longitude: number): void => {
    const driver = getDriverData();
    if (driver) {
        const updatedDriver = {
            ...driver,
            currentLatitude: latitude,
            currentLongitude: longitude,
            lastUpdatedAt: new Date()
        };
        setDriverData(updatedDriver);
    }
};

// Availability toggle
export const toggleDriverAvailability = (isAvailable: boolean): void => {
    const driver = getDriverData();
    if (driver) {
        const updatedDriver = {
            ...driver,
            isAvailable,
            lastUpdatedAt: new Date()
        };
        setDriverData(updatedDriver);
    }
}; 