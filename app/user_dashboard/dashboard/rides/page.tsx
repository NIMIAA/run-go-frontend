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
import { getUserData, User } from "@/app/utils/auth";
import { getUserProfile } from "@/app/utils/api";
import ProfileAvatar from "@/app/components/profile/ProfileAvatar";
import dynamic from 'next/dynamic';

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
  setPickup: (id: string) => void;
  dropoff: string;
  setDropoff: (id: string) => void;
}> = ({ pickup, setPickup, dropoff, setDropoff }) => {
  const [locations, setLocations] = useState<{ id: string; location: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/v1/location')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch locations');
        return res.json();
      })
      .then((data) => {
        setLocations(data);
        setLoading(false);
      })
      .catch((err) => {
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
            .filter((loc) => loc.id !== dropoff)
            .map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.location}</option>
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
            .filter((loc) => loc.id !== pickup)
            .map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.location}</option>
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
  onSelect: (driver: any) => void;
  selectedDriverId?: string;
}> = ({ pickup, dropoff, onSelect, selectedDriverId }) => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pickup || !dropoff) return;
    setLoading(true);
    setError(null);
    setDrivers([]);
    fetch(
      `http://localhost:5000/v1/booking/available-drivers?pickup=${pickup}&dropoff=${dropoff}`
    )
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch available drivers');
        return res.json();
      })
      .then((data) => {
        setDrivers(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
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
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);

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
                        <div className="space-y-2 mb-4">
                          <div className="p-4 rounded w-full border-2 border-gray-300 cursor-pointer hover:border-blue-500 hover:bg-gray-50">
                            My Wallet
                          </div>
                          <div className="p-4 rounded w-full border-2 border-gray-300 cursor-pointer hover:border-blue-500 hover:bg-gray-50">
                            Cash
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button
                            className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-6 py-2 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                            onClick={() => setStep(4)}
                          >
                            Confirm Booking
                          </Button>
                        </div>
                      </>
                    )}

                    {step === 4 && (
                      <>
                        <div className="text-center py-4">
                          <p className="text-xl font-bold text-green-600 mb-2">Thank you!</p>
                          <p className="text-gray-500 text-sm mb-4">Your ride has been successfully booked.</p>
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
                <p>Upcoming Rides</p>
                <hr className="my-2" />
                <div className="w-full my-4">
                  <Menu>
                    <MenuButton className="w-full rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col items-start justify-center">
                          <p className="text-sm text-gray-400">12/5 10:00AM</p>
                          <p className="font-semibold">Queen Esther Hall</p>
                        </div>
                        <div>
                          <p>On the way</p>

                        </div>
                      </div>
                      {/* <ChevronDownIcon className="size-4 fill-white/60" /> */}
                    </MenuButton>

                    <MenuItems
                      transition
                      anchor="bottom end"
                      className="w-52 origin-top-right rounded-xl border border-white/5 bg-black/5 p-1 text-sm/6 text-white transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                    >
                      <MenuItem>
                        <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                          <PencilIcon className="size-4 fill-white/30" />
                          Edit
                          <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘E</kbd>
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                          <Square2StackIcon className="size-4 fill-white/30" />
                          Duplicate
                          <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘D</kbd>
                        </button>
                      </MenuItem>
                      <div className="my-1 h-px bg-white/5" />
                      <MenuItem>
                        <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                          <ArchiveBoxXMarkIcon className="size-4 fill-white/30" />
                          Archive
                          <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘A</kbd>
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                          <TrashIcon className="size-4 fill-white/30" />
                          Delete
                          <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘D</kbd>
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
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