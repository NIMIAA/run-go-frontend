"use client";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Button } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/16/solid'

import dynamic from "next/dynamic";
const Map = dynamic(() => import("../../map"), { ssr: false });

const vehicles = [
  { name: "Keke", image: "/images/kekepic2.png" },
  { name: "Toyota", image: "/images/toyota.png" }, // Add your Toyota image
  { name: "Small Bus", image: "/images/small-bus.png" }, // Add your Small Bus image
  { name: "Big Shuttle", image: "/images/big-shuttle.png" }, // Add your Big Shuttle image
];

export default function RidesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [isWaiting, setIsWaiting] = useState(false);
  const [responseStatus, setResponseStatus] = useState<"accepted" | "declined" | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // New states for image rotation and hover
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredVehicle, setHoveredVehicle] = useState<string | null>(null);

  // Add these new states to your existing state declarations
  const [rides, setRides] = useState([
    {
      id: "RUN-2024-001",
      status: "on_the_way", // "on_the_way", "arrived", "completed"
      pickup: "Queen Esther Hall",
      dropoff: "Library",
      driver: "Uncle Dami",
      vehicle: "Keke",
      paymentMethod: "Wallet",
      amount: "₦500",
      date: "12/5 10:00AM",
      driverArrived: false,
      completed: false
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (!hoveredVehicle) { // Only auto-rotate when not hovering
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % vehicles.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [hoveredVehicle]);

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
    setStep(1);
    setPickup("");
    setDropoff("");
    setError("");
    setIsWaiting(false);
    setResponseStatus(null);
  }

  const handleNext = () => {
    if (!pickup.trim() || !dropoff.trim()){
      setError("Please fill in both pickup and dropoff locations.");

      setTimeout(() =>{
        setError("");
      }, 3000);
      
      return;
    };
    setStep(2);
  }

  // Add this function to handle driver arrival confirmation
  const handleDriverArrived = (rideId: string) => {
    setRides(prevRides => 
      prevRides.map(ride => 
        ride.id === rideId 
          ? { ...ride, status: "arrived", driverArrived: true }
          : ride
      )
    );
  };

  // Add this function to complete the ride
  const handleRideCompleted = (rideId: string) => {
    setRides(prevRides => 
      prevRides.map(ride => 
        ride.id === rideId 
          ? { ...ride, status: "completed", completed: true }
          : ride
      )
    );
  };

  // Add this function to add a new ride after booking
  const addNewRide = (pickup: string, dropoff: string, paymentMethod: string) => {
    const newRide = {
      id: `RUN-${Date.now()}`,
      status: "on_the_way",
      pickup,
      dropoff,
      driver: "Uncle Dami", // This would come from your API
      vehicle: "Keke",
      paymentMethod,
      amount: "₦500", // This would be calculated
      date: new Date().toLocaleString(),
      driverArrived: false,
      completed: false
    };
    setRides(prevRides => [newRide, ...prevRides]);
  };

  // Update your handleSelectDriver function to add the ride
  const handleSelectDriver = async () => {
    setIsWaiting(true);
    setResponseStatus(null);

    try {
      const response = await fetch('', {});
      const result = { status: "accepted" };
      
      if (result.status === "accepted") {
        setResponseStatus("accepted");
        setStep(3);
        // Add the new ride when driver accepts
        addNewRide(pickup, dropoff, "Wallet"); // You'll get payment method from step 3
      } else {
        setResponseStatus("declined");
        setIsWaiting(false);
        setTimeout(() => {
          setResponseStatus(null);
        }, 5000);
      }
    } catch (error) {
      console.error("Error selecting driver:", error);
    }
  };

  // Update the dialog step 4 to add the ride
  const handleConfirmBooking = () => {
    setStep(4);
    // Add the ride with the selected payment method
    addNewRide(pickup, dropoff, "Wallet"); // You'll need to track selected payment method
  };

  const getCurrentImage = () => {
    if (hoveredVehicle) {
      const vehicle = vehicles.find(v => v.name === hoveredVehicle);
      return vehicle?.image || vehicles[0].image;
    }
    return vehicles[currentImageIndex].image;
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="mx-8">
        {/* Header */}
        <div className="flex flex-row justify-between items-center mt-8">
          <div>
            <p className="text-3xl font-extrabold text-gray-900">Rides</p>
            <p className="text-gray-500 mt-2 text-lg">
              Your ride history and upcoming trips, all in one place.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white shadow rounded-xl px-4 py-2">
            <Image
              src="/user.png"
              alt=""
              width={36}
              height={36}
              className="border rounded-full"
            />
            <div className="flex flex-col items-start justify-center">
              <p className="font-semibold">John Doe</p>
              <p className="text-xs text-gray-500">johndoe@gmail.com</p>
            </div>
            <ChevronDownIcon className="size-5 text-gray-400 ml-2" />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-4 gap-6 mt-10">
          {/* Left: Booking and Rides */}
          <div className="col-span-3 flex flex-col gap-6">
            {/* Booking Section */}
            <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <button
                  className="bg-blue-700 text-white px-6 py-2 mb-4 rounded-lg shadow-md hover:bg-blue-800 transition font-semibold"
                  onClick={open}
                >
                  + Book Ride
                </button>
                <div className="grid grid-cols-2 gap-4">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.name}
                      className={`flex flex-col items-center justify-center p-4 rounded-md cursor-pointer transition-all duration-300 ${
                        hoveredVehicle === vehicle.name
                          ? "bg-blue-100 border-2 border-blue-300 shadow-md"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onMouseEnter={() => setHoveredVehicle(vehicle.name)}
                      onMouseLeave={() => setHoveredVehicle(null)}
                    >
                      <span className="font-medium text-gray-700">{vehicle.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Vehicle Image */}
              <div className="relative w-[300px] aspect-square bg-gray-50 ml-4 flex items-center justify-center">
                <Image
                  src={getCurrentImage()}
                  alt="Vehicle"
                  width={300}
                  height={300}
                  className="rounded-lg transition-all duration-500 ease-in-out object-contain w-full h-full"
                  style={{
                    transform: hoveredVehicle ? "scale(1.05)" : "scale(1)",
                  }}
                />
                {/* Dots */}
                {!hoveredVehicle && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {vehicles.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
                {/* Hover indicator */}
                {hoveredVehicle && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {hoveredVehicle}
                  </div>
                )}
              </div>
            </div>

            {/* Rides Section */}
            <div className="bg-white shadow-md rounded-2xl p-6">
              <p className="font-semibold text-2xl mb-4 text-gray-900">Your Rides</p>
              <hr className="my-2" />
              {rides.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No rides yet. Book your first ride!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {rides.map((ride) => (
                    <div
                      key={ride.id}
                      className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50/30 to-white"
                    >
                      {/* Ride Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-gray-500">{ride.date}</p>
                          <p className="font-semibold text-gray-800">{ride.pickup} → {ride.dropoff}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ride.status === "on_the_way" ? "bg-yellow-100 text-yellow-800" :
                            ride.status === "arrived" ? "bg-blue-100 text-blue-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {ride.status === "on_the_way" ? "On the way" :
                             ride.status === "arrived" ? "Driver arrived" :
                             "Completed"}
                          </span>
                        </div>
                      </div>

                     

                      {/* Action Buttons */}
                      {ride.status === "on_the_way" && (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleDriverArrived(ride.id)}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            <input 
                              type="checkbox" 
                              checked={ride.driverArrived}
                              onChange={() => handleDriverArrived(ride.id)}
                              className="w-4 h-4"
                            />
                            <span>Driver has arrived</span>
                          </button>
                        </div>
                      )}

                      {ride.status === "arrived" && (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleRideCompleted(ride.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                          >
                            Complete Ride
                          </button>
                        </div>
                      )}

                      {/* Ride Details (expandable) */}
                      <div className="mt-3 pt-3 border-t">
                        <details className="group">
                          <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium">
                            View ride details
                          </summary>

                           {/* Driver Info */}
                      <div className="flex items-center justify-between my-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-xs font-semibold">
                              {ride.driver.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{ride.driver}</p>
                            <p className="text-xs text-gray-500">{ride.vehicle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{ride.amount}</p>
                          <p className="text-xs text-gray-500">{ride.paymentMethod}</p>
                        </div>
                      </div>
                          <div className="mt-2 space-y-2 text-sm text-gray-600">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="font-medium">Booking ID:</span> {ride.id}
                              </div>
                              <div>
                                <span className="font-medium">Vehicle:</span> {ride.vehicle}
                              </div>
                              <div>
                                <span className="font-medium">Pickup:</span> {ride.pickup}
                              </div>
                              <div>
                                <span className="font-medium">Dropoff:</span> {ride.dropoff}
                              </div>
                              <div>
                                <span className="font-medium">Payment:</span> {ride.paymentMethod}
                              </div>
                              <div>
                                <span className="font-medium">Amount:</span> {ride.amount}
                              </div>
                            </div>
                          </div>
                        </details>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Map */}
          <div className="col-span-1">
            <div className="grid grid-rows-2 gap-4 h-full">
              <div className="row-span-1 bg-white shadow-md rounded-2xl p-4 flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-2">Live Map</h3>
                <div className="flex-1 min-h-0">
                  <Map />
                </div>
              </div>
              {/* You can add more quick actions or info here if you want */}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-8 relative">
              <button
                onClick={close}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                aria-label="Close dialog"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

              <div className="flex justify-center mb-6">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((stepNumber) => (
                    <div
                      key={stepNumber}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        step >= stepNumber ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 pr-8 mb-6 text-center">
                {step === 1 && "Book Your Ride"}
                {step === 2 && "Choose Your Driver"}
                {step === 3 && "Payment Method"}
                {step === 4 && "Booking Confirmed!"}
              </h3>

              {step === 1 && (
                <>
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                      <input 
                        type="text"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        placeholder="Enter pickup address"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dropoff Location</label>
                      <input 
                        type="text"
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        placeholder="Enter destination address"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                  <div className="mt-6">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                      onClick={handleNext}
                    >
                      Continue
                    </Button>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-gray-600 text-sm">1 driver available</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 text-lg">Uncle Dami</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Keke
                            </span>
                            <span>3 seats</span>
                            <span>⭐ 4.8</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">UD</span>
                        </div>
                      </div>
                      <button 
                        onClick={handleSelectDriver}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                        disabled={isWaiting}
                      >
                        {isWaiting ? "Waiting for response..." : "Select Driver"}
                      </button>
                      {responseStatus === "declined" && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-sm">Driver declined. Please select another driver.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="space-y-4">
                    <p className="text-gray-600 text-center mb-6">Choose your preferred payment method</p>
                    <div className="space-y-3">
                      <div className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold">💰</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">My Wallet</p>
                              <p className="text-sm text-gray-500">Balance: ₦2,500</p>
                            </div>
                          </div>
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                        </div>
                      </div>
                      <div className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">💵</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">Cash Payment</p>
                              <p className="text-sm text-gray-500">Pay after ride</p>
                            </div>
                          </div>
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                      onClick={handleConfirmBooking}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </>
              )}
              {step === 4 && (
                <>
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-green-600 text-2xl">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Booking Successful!</h3>
                      <p className="text-gray-600">Your ride has been confirmed. Your driver will arrive shortly.</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Booking ID:</strong> RUN-2024-001<br/>
                        <strong>Estimated arrival:</strong> 5-10 minutes
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                      onClick={close}
                    >
                      Done
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

