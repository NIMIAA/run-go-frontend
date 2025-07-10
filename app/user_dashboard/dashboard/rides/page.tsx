"use client";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/16/solid'
import { getUserData, User, getAuthToken } from "@/app/utils/auth";
import { getUserProfile } from "@/app/utils/api";
import ProfileAvatar from "@/app/components/profile/ProfileAvatar";
import dynamic from 'next/dynamic';
import UpcomingRidesTab from "./UpcomingRidesTab";

// Types
interface Driver {
  identifier: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  carIdentifier?: string;
}

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  )
});

// API functions for wallet payment flow
const getRidePrice = async (pickupLocation: string, dropoffLocation: string) => {
  try {
    console.log('Fetching ride price for:', pickupLocation, 'to', dropoffLocation);
    // Encode location names for URL
    const encodedPickup = encodeURIComponent(pickupLocation);
    const encodedDropoff = encodeURIComponent(dropoffLocation);
    const response = await fetch(`http://localhost:5000/v1/location/price/${encodedPickup}/${encodedDropoff}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Price API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Price API error response:', errorText);
      throw new Error(`Failed to fetch ride price: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Price API response data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching ride price:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

const validateWalletBalance = async (rideFare: number) => {
  try {
    console.log('Validating wallet balance for fare:', rideFare);
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch(`http://localhost:5000/v1/booking/validate-wallet-balance?rideFare=${rideFare}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Wallet validation API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Wallet validation API error response:', errorText);
      throw new Error(`Failed to validate wallet balance: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Wallet validation API response data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error validating wallet balance:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

const requestRide = async (rideData: any) => {
  try {
    console.log('Requesting ride with data:', rideData);
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await fetch('http://localhost:5000/v1/booking/request-ride', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(rideData),
    });

    console.log('Request ride API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('=== REQUEST RIDE API ERROR ===');
      console.error('Status:', response.status, response.statusText);
      console.error('Error response:', errorText);
      console.error('Request body that was sent:', rideData);
      console.error('=== END ERROR DEBUG ===');

      // Try to parse error response as JSON for better error messages
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          throw new Error(`Request failed: ${errorJson.message}`);
        } else if (errorJson.error) {
          throw new Error(`Request failed: ${errorJson.error}`);
        } else {
          throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }
      } catch (parseError) {
        // If error response is not JSON, use the raw text
        throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('Request ride API response data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error requesting ride:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Transport vehicles data
const vehicles = [
  {
    id: 1,
    name: "Tricycle",
    image: "/images/tricycle.jpg", // You'll need to add these images
    description: "Perfect for short trips"
  },
  {
    id: 2,
    name: "Toyota Camry",
    image: "/images/camry.jpg",
    description: "Comfortable sedan ride"
  },
  {
    id: 3,
    name: "Sienna",
    image: "/images/sienna.jpg",
    description: "Spacious minivan"
  },
  {
    id: 4,
    name: "Bus",
    image: "/images/bus.jpg",
    description: "Group transportation"
  }
];

// Add LocationDropdowns component
const LocationDropdowns: React.FC<{
  pickup: string;
  setPickup: (locationName: string) => void;
  dropoff: string;
  setDropoff: (locationName: string) => void;
}> = ({ pickup, setPickup, dropoff, setDropoff }) => {
  const [locations, setLocations] = useState<{ id: string; location: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    console.log('Fetching locations...');
    fetch('http://localhost:5000/v1/location', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log('Locations API response status:', res.status);
        if (!res.ok) {
          console.error('Locations API error status:', res.status, res.statusText);
          throw new Error(`Failed to fetch locations: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Locations API response data:', data);
        setLocations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching locations:', err);
        setError(err.message || 'Error loading locations');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading locations...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <>
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
        <select
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="px-4 py-3 rounded w-full border-2 border-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="">Select pickup location</option>
          {locations
            .filter((loc) => loc.location !== dropoff)
            .map((loc) => (
              <option key={loc.id} value={loc.location}>{loc.location}</option>
            ))}
        </select>
      </div>
      <div className="w-full mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Dropoff Location</label>
        <select
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          className="px-4 py-3 rounded w-full border-2 border-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="">Select dropoff location</option>
          {locations
            .filter((loc) => loc.location !== pickup)
            .map((loc) => (
              <option key={loc.id} value={loc.location}>{loc.location}</option>
            ))}
        </select>
      </div>
    </>
  );
};

// Add AvailableDriversList component
const AvailableDriversList: React.FC<{
  pickup: string;
  dropoff: string;
  onSelect: (driver: Driver) => void;
  selectedDriverId?: string;
}> = ({ pickup, dropoff, onSelect, selectedDriverId }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pickup || !dropoff) return;
    setLoading(true);
    setError(null);
    setDrivers([]);
    console.log('Fetching available drivers for pickup:', pickup, 'dropoff:', dropoff);
    // Encode location names for URL parameters
    const encodedPickup = encodeURIComponent(pickup);
    const encodedDropoff = encodeURIComponent(dropoff);
    fetch(
      `http://localhost:5000/v1/booking/available-drivers?pickup=${encodedPickup}&dropoff=${encodedDropoff}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => {
        console.log('Available drivers API response status:', res.status);
        if (!res.ok) {
          console.error('Available drivers API error status:', res.status, res.statusText);
          throw new Error(`Failed to fetch available drivers: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Available drivers API response data:', data);
        setDrivers(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching available drivers:', err);
        setError(err.message || 'Error loading drivers');
        setLoading(false);
      });
  }, [pickup, dropoff]);

  if (!pickup || !dropoff) return null;
  if (loading) return <div>Loading available drivers...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (drivers.length === 0) return <div className="text-gray-500">No drivers available for this route.</div>;

  return (
    <div className="space-y-3">
      {drivers.map((driver) => (
        <div
          key={driver.identifier}
          className={`flex flex-row items-center justify-between p-4 rounded border cursor-pointer transition-all ${selectedDriverId === driver.identifier
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          onClick={() => onSelect(driver)}
        >
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">
              {driver.firstName} {driver.lastName}
            </span>
            <span className="text-sm text-gray-500">
              Car: {driver.carIdentifier || 'Unknown'}
            </span>
            <span className="text-sm text-gray-500">
              Phone: {driver.phoneNumber}
            </span>
          </div>
          <button
            className={`ml-4 px-4 py-2 rounded text-sm font-medium transition-colors ${selectedDriverId === driver.identifier
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
              }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(driver);
            }}
          >
            {selectedDriverId === driver.identifier ? 'Selected' : 'Select'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default function RidesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [isWaiting, setIsWaiting] = useState(false);
  const [responseStatus, setResponseStatus] = useState<"accepted" | "declined" | null>(null);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [showLocationInputs, setShowLocationInputs] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [rideFare, setRideFare] = useState<number | null>(null);
  const [isWalletValid, setIsWalletValid] = useState<boolean | null>(null);
  const [rideRequestStatus, setRideRequestStatus] = useState<"success" | "failed" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "cash" | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [walletValidationData, setWalletValidationData] = useState<{
    message: string;
    hasWallet: boolean;
    hasSufficientFunds: boolean;
    currentBalance: number;
    requiredAmount: number;
    shortfall: number;
    canProceed: boolean;
  } | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVehicleIndex((prevIndex) =>
        prevIndex === vehicles.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentVehicleIndex((prevIndex) =>
      prevIndex === vehicles.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentVehicleIndex((prevIndex) =>
      prevIndex === 0 ? vehicles.length - 1 : prevIndex - 1
    );
  };

  function open() {
    if (isOpen) {
      // If dialog is open, close it
      close();
    } else {
      // If dialog is closed, open it
      setIsOpen(true);
      setShowLocationInputs(true);
    }
  }

  function close() {
    setIsOpen(false);
    setStep(1);
    setPickup("");
    setDropoff("");
    setError("");
    setShowLocationInputs(false);
    setSelectedDriver(null);
    setRideFare(null);
    setIsWalletValid(null);
    setRideRequestStatus(null);
    setPaymentMethod(null);
    setIsProcessingPayment(false);
    setWalletError(null);
    setWalletValidationData(null);
    setBookingStatus("idle");
  }

  const handleNext = () => {
    if (step === 1) {
      if (!pickup.trim() || !dropoff.trim()) {
        setError("Please fill in both pickup and dropoff locations.");
        setTimeout(() => {
          setError("");
        }, 3000);
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSelectDriver = async () => {
    setIsWaiting(true);
    setResponseStatus(null);
    // API call to select a driver

    try {
      const response = await fetch('', {});

      // const result = await response.json();
      const result = { status: "accepted" };
      if (result.status === "accepted") {
        setResponseStatus("accepted");
        setStep(3);
      }
      else {
        setResponseStatus("declined");
        setIsWaiting(false);

        setTimeout(() => {
          setResponseStatus(null);
        }, 5000);
      }

    }

    catch (error) {
      console.error("Error selecting driver:", error);


    }

  };

  const handlePaymentMethodSelect = async (method: "wallet" | "cash") => {
    setPaymentMethod(method);
    setWalletError(null);

    if (method === "wallet") {
      setIsProcessingPayment(true);

      try {
        // Step 1: Get ride fare
        const priceResult = await getRidePrice(pickup, dropoff);
        if (!priceResult.success) {
          setWalletError(priceResult.error || 'Failed to get ride price');
          setIsProcessingPayment(false);
          return;
        }

        const fare = priceResult.data.price || priceResult.data.fare || 0;
        setRideFare(fare);

        // Step 2: Validate wallet balance
        const walletResult = await validateWalletBalance(fare);
        if (!walletResult.success) {
          setWalletError(walletResult.error || 'Failed to validate wallet balance');
          setIsProcessingPayment(false);
          return;
        }

        const walletData = walletResult.data;
        setWalletValidationData(walletData);

        if (!walletData.canProceed) {
          setWalletError(walletData.message);
          setIsProcessingPayment(false);
          return;
        }

        // Step 3: Send ride request to driver
        setBookingStatus("processing");

        // Verify JWT token exists
        const token = getAuthToken();
        if (!token) {
          setWalletError('Authentication required. Please log in again.');
          setIsProcessingPayment(false);
          setBookingStatus("failed");
          return;
        }

        const rideData = {
          driverIdentifier: selectedDriver?.identifier,
          pickupLocation: pickup,
          destination: dropoff, // Changed from dropoffLocation to destination
          estimatedAmount: Number(fare) // Ensure it's a number, not string
        };

        // Validate all required fields (excluding userIdentifier as it's extracted from JWT)
        const validationErrors = [];
        if (!rideData.driverIdentifier) validationErrors.push('driverIdentifier is missing');
        if (!rideData.pickupLocation) validationErrors.push('pickupLocation is missing');
        if (!rideData.destination) validationErrors.push('destination is missing');
        if (typeof rideData.estimatedAmount !== 'number' || isNaN(rideData.estimatedAmount)) {
          validationErrors.push('estimatedAmount must be a valid number');
        }

        if (validationErrors.length > 0) {
          const errorMessage = `Validation failed: ${validationErrors.join(', ')}`;
          console.error('=== VALIDATION ERRORS ===');
          console.error(errorMessage);
          console.error('Request data:', rideData);
          console.error('=== END VALIDATION ERRORS ===');
          setWalletError(errorMessage);
          setIsProcessingPayment(false);
          setBookingStatus("failed");
          return;
        }

        console.log('=== RIDE REQUEST DEBUG ===');
        console.log('JWT Token exists:', !!token);
        console.log('Selected driver:', selectedDriver);
        console.log('Pickup location:', pickup);
        console.log('Dropoff location:', dropoff);
        console.log('Fare (original):', fare, 'Type:', typeof fare);
        console.log('Estimated amount (converted):', Number(fare), 'Type:', typeof Number(fare));
        console.log('Final request body (userIdentifier extracted from JWT):', rideData);
        console.log('=== END DEBUG ===');

        const rideResult = await requestRide(rideData);
        if (!rideResult.success) {
          setWalletError(rideResult.error || 'Failed to request ride');
          setIsProcessingPayment(false);
          setBookingStatus("failed");
          return;
        }

        setRideRequestStatus("success");
        setBookingStatus("success");
        setIsProcessingPayment(false);
        setStep(4);

      } catch (error) {
        console.error('Error processing wallet payment:', error);
        setWalletError('An unexpected error occurred. Please try again.');
        setIsProcessingPayment(false);
      }
    } else {
      // For cash payment, proceed directly to confirmation
      setStep(4);
    }
  };

  useEffect(() => {
    const userData = getUserData();
    setUser(userData);
    loadProfileData();
    setIsLoading(false);
  }, []);

  const loadProfileData = async () => {
    try {
      const response = await getUserProfile();
      if (response.success && response.data?.profileImageUrl) {
        setProfileImageUrl(`http://localhost:5000${response.data.profileImageUrl}`);
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    return `${user.firstName} ${user.lastName}`;
  };

  return (
    <div>
      <div className="mx-8">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col justify-center items-start mt-8">
            <p className="text-xl font-bold">Rides</p>
            <p className="text-gray-500 mt-2">Your ride history and upcoming trips, all in one place.</p>
          </div>
          <div className="mt-8 relative group">
            <div className="flex flex-row items-center justify-between gap-3 bg-white rounded-lg shadow-md p-3 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-row items-center gap-3">
                <ProfileAvatar
                  user={user}
                  profileImageUrl={profileImageUrl}
                  size="md"
                />

                <div className="flex flex-col items-start justify-center">
                  <p className="font-semibold text-gray-800">
                    {isLoading ? "Loading..." : getUserDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isLoading ? "loading@email.com" : user?.email}
                  </p>
                  {user?.isStudent && (
                    <p className="text-xs text-blue-600 font-medium">
                      Student • {user.matricNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ChevronDownIcon className="size-4 text-gray-500" />
              </div>
            </div>

            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-2">
                <a href="/user_dashboard/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Settings
                </a>
                <a href="/user_dashboard/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Account Settings
                </a>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    console.log("Logout clicked");
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="col-span-2 mt-16">
            {/* Book Ride Button - Now spans same width as vehicle slider */}
            <div className={`${isOpen ? 'mb-8' : 'mb-6'}`}>
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-lg font-bold transform hover:scale-105 text-left"
                onClick={open}
              >
                + Book Ride
              </button>

              {/* Dialog Modal - Appears within Book Ride container */}
              {isOpen && (
                <div className="mt-2 bg-white shadow-lg rounded-xl border border-gray-200">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Book Ride</h3>
                      <button
                        onClick={close}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>

                    {step === 1 && (
                      <>
                        <div className="space-y-4">
                          <LocationDropdowns pickup={pickup} setPickup={setPickup} dropoff={dropoff} setDropoff={setDropoff} />
                        </div>
                        <p className="text-red-500 text-xs mt-2">{error}</p>
                        <div className="mt-4">
                          <Button
                            className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-6 py-2 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                            onClick={handleNext}
                          >
                            Next
                          </Button>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <p className="text-lg font-bold mb-2">Available Rides</p>
                        <AvailableDriversList
                          pickup={pickup}
                          dropoff={dropoff}
                          onSelect={(driver) => {
                            setSelectedDriver(driver);
                          }}
                          selectedDriverId={selectedDriver?.identifier}
                        />
                        {selectedDriver && (
                          <div className="mt-4 text-green-600 text-sm">Selected: {selectedDriver.firstName} {selectedDriver.lastName}</div>
                        )}
                        <div className="mt-4">
                          <Button
                            className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-6 py-2 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                            onClick={handleNext}
                            disabled={!selectedDriver}
                          >
                            Next
                          </Button>
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <p className="text-lg font-bold mb-4">Select Payment Method</p>

                        {isProcessingPayment && (
                          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                              <span className="text-blue-800">Processing wallet payment...</span>
                            </div>
                          </div>
                        )}

                        {walletError && (
                          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm">{walletError}</p>
                            {walletError.includes('Insufficient') && (
                              <button
                                onClick={() => window.location.href = '/user_dashboard/wallet'}
                                className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                              >
                                Fund Your Wallet
                              </button>
                            )}
                          </div>
                        )}

                        {rideFare && walletValidationData && (
                          <div className={`mb-4 p-4 border rounded-lg ${walletValidationData.canProceed
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                            }`}>
                            <p className={`text-sm font-medium ${walletValidationData.canProceed ? 'text-green-800' : 'text-red-800'
                              }`}>
                              <strong>Ride Fare:</strong> ₦{rideFare.toLocaleString()}
                            </p>
                            <p className={`text-xs mt-1 ${walletValidationData.canProceed ? 'text-green-700' : 'text-red-700'
                              }`}>
                              {walletValidationData.message}
                            </p>
                            {walletValidationData.canProceed && (
                              <div className="mt-2 text-xs text-green-600">
                                <p>Current Balance: ₦{walletValidationData.currentBalance.toLocaleString()}</p>
                                <p>Required Amount: ₦{walletValidationData.requiredAmount.toLocaleString()}</p>
                              </div>
                            )}
                            {!walletValidationData.canProceed && walletValidationData.shortfall > 0 && (
                              <div className="mt-2 text-xs text-red-600">
                                <p>Shortfall: ₦{walletValidationData.shortfall.toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="space-y-2 mb-4">
                          <button
                            onClick={() => handlePaymentMethodSelect("wallet")}
                            disabled={isProcessingPayment}
                            className={`w-full p-4 rounded border-2 transition-all ${paymentMethod === "wallet"
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:border-blue-500 hover:bg-gray-50"
                              } ${isProcessingPayment ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-6 h-6 mr-3">💰</div>
                                <div className="text-left">
                                  <p className="font-medium">My Wallet</p>
                                  <p className="text-sm text-gray-500">Pay with wallet balance</p>
                                </div>
                              </div>
                              {paymentMethod === "wallet" && (
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </button>

                          <button
                            onClick={() => handlePaymentMethodSelect("cash")}
                            disabled={isProcessingPayment}
                            className={`w-full p-4 rounded border-2 transition-all ${paymentMethod === "cash"
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:border-blue-500 hover:bg-gray-50"
                              } ${isProcessingPayment ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-6 h-6 mr-3">💵</div>
                                <div className="text-left">
                                  <p className="font-medium">Cash</p>
                                  <p className="text-sm text-gray-500">Pay with cash</p>
                                </div>
                              </div>
                              {paymentMethod === "cash" && (
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </button>
                        </div>

                        {paymentMethod && !isProcessingPayment && !walletError && (
                          <div className="mt-4">
                            <Button
                              className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-6 py-2 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                              onClick={() => setStep(4)}
                              disabled={paymentMethod === "wallet" && (!walletValidationData || !walletValidationData.canProceed)}
                            >
                              {bookingStatus === "processing" ? "Processing..." : "Request Ride"}
                            </Button>
                          </div>
                        )}
                      </>
                    )}

                    {step === 4 && (
                      <>
                        <div className="text-center py-4">
                          <p className="text-xl font-bold text-green-600 mb-2">Ride Request Sent!</p>
                          <p className="text-gray-500 text-sm mb-4">Your ride request has been sent to the driver. They will receive an email and dashboard notification.</p>
                          <Button
                            className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-6 py-2 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                            onClick={close}
                          >
                            Close
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-row gap-4 mb-12">
              <div className="bg-white shadow-md rounded-lg p-4 w-full flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Vehicles</h3>
                  <p className="text-sm text-gray-600">Here are the different kinds of rides we have available for your journey:</p>
                </div>
                {/* Vehicle Slider - Now below the button */}
                <div className="relative w-full h-80 rounded-lg overflow-hidden bg-white shadow-md">
                  {/* Vehicle Image */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-8xl mb-6">🚗</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {vehicles[currentVehicleIndex].name}
                      </h3>
                      <p className="text-gray-600">
                        {vehicles[currentVehicleIndex].description}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronLeftIcon className="w-8 h-8" />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronRightIcon className="w-8 h-8" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    {vehicles.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVehicleIndex(index)}
                        className={`w-4 h-4 rounded-full transition-all duration-200 ${index === currentVehicleIndex
                          ? 'bg-blue-600'
                          : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-12">
              {/* row-span-4 flex flex-row gap-4 */}
              <div className="bg-white shadow-md rounded-lg p-4 w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Upcoming Rides</h3>
                {/* <p>Upcoming Rides</p> */}
                <hr className="my-2" />
                <div className="w-full my-4">
                  <UpcomingRidesTab />
                </div>
              </div>
            </div>
          </div>
          <div className={`col-span-1 ${isOpen ? 'gap-4' : 'gap-1'} mt-8 grid grid-rows-2`}>
            <div className="row-span-1">
              <div className="bg-white shadow-md rounded-lg p-4 w-full border-2 h-full">
                <MapComponent />
              </div>
            </div>
            <div className="row-span-1 flex flex-row gap-4">
              <div className="bg-white shadow-md rounded-lg p-4 w-full border-2 h-full">
                <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center h-full">
                  <h2 className="text-xl font-bold">Quick Stats</h2>
                  <p className="text-2xl my-2">0</p>
                  <p className="text-sm text-gray-500">Total Rides</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};