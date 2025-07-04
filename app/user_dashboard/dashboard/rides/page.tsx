"use client";
import Image from "next/image";
import { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'

export default function RidesPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [isWaiting, setIsWaiting] = useState(false);
  const [responseStatus, setResponseStatus] = useState<"accepted" | "declined" | null>(null);

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
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

  const handleSelectDriver = async () => {
    setIsWaiting(true);
    setResponseStatus(null);
    // API call to select a driver

    try{
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
    return(
        <div>
            <div className="mx-8">
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-col justify-center items-start mt-8">
                            <p className="text-xl font-bold">Rides</p>
                            <p className="text-gray-500 mt-2">Your ride history and upcoming trips, all in one place.</p>
                            </div>
                            <div className="cursor-pointer mt-8 flex flex-row items-center justify-between gap-2">
                                <div className="text-sm flex flex-row items-center justify-center">
                                    <div className="mr-2">
                                        <Image src="/user.png" alt="" width={10} height={10} className="border rounded-full" />
                                        
                                    </div>
                                    <div className="flex flex-col items-start justify-center">
                                    <p className="font-semibold">John Doe</p>
                                    <p className="text-xs">johndoe@gmail.com</p>
                                    </div>
                                    
                                </div>
                                <div>
                                    <ChevronDownIcon className="size-4 text-gray-500 ml-2" />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="col-span-2 grid grid-rows-5 gap-4 mt-8">
                                <div className="row-span-1 flex flex-row gap-4">
                                    <div className="bg-white shadow-md rounded-lg p-4 w-full flex justify-between items-center">
                                        <div>
                                      
                                        <button className="bg-blue-700 text-white px-6 py-2 my-2 bottom-4 rounded-lg shadow-md hover:bg-blue-600 transition" onClick={open}>
                                            + Book Ride
                                        </button>
                                        <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                                          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                            <div className="flex min-h-full items-center justify-center p-4">
                                              <DialogPanel
                                                transition
                                                className="w-full max-w-md rounded-xl bg-white shadow-md p-6 backdrop-blur-4xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                                              >
                                                <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                                                  book ride
                                                </DialogTitle>
                                                {step === 1 && (
                                                  <>
                                                  <div className="flex flex-col items-center justify-center my-4">
                                                    <input 
                                                      type="text"
                                                      value={pickup}
                                                      onChange={(e) => setPickup(e.target.value)}
                                                      placeholder="PickUp Location"
                                                      className="p-4 my-4 rounded w-full border-2 border-gray-300 focus:outline-foreground" />
                                                    <input 
                                                      type="text"
                                                      value={dropoff}
                                                      onChange={(e) => setDropoff(e.target.value)}
                                                      placeholder="DropOff Location"
                                                      className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground" />
                                                    </div>
                                                    <p className="text-red-500 text-xs">{error}</p>
                                                    <div className="mt-4">
                                                      <Button
                                                        className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-6 py-1 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                                        onClick={handleNext}
                                                      >
                                                        Next
                                                      </Button>
                                                    </div>
                                                  </>
                                                )}
                                                {step === 2 && (
                                                  <>
                                                  <p className="text-xl font-bold">Available Rides</p>
                                                  <p className="text-gray-500 mt-2 text-sm">1 rides found</p>
                                                    <div className="flex flex-col items-center justify-center my-4">
                                                      <div className="p-4 rounded w-full border-2 border-gray-300 focus:outline-foreground">
                                                        <p>Uncle Dami</p>
                                                        <div className="flex flex-row items-center text-gray-400 text-sm py-4 rounded-md">
                                                          <div className="px-1.5">Keke</div>
                                                          <div className="px-1.5">3 seats</div>
                                                          <div className="px-1.5">ratings</div>
                                                        </div>
                                                        <div className="p-2 rounded w-full border-2 border-gray-300 focus:outline-foreground text-center text-black/50 cursor-pointer" onClick={handleSelectDriver}>Select Driver</div>
                                                        {isWaiting && <p className="text-sm text-gray-500">Waiting for driver response...</p>}
                                                        {responseStatus === "declined" && (
                                                          <p className="text-red-500  text-xs mt-2">Driver declined the ride. Please select another driver.</p>)}
                                                      </div>
                                                    </div>
                                                    
                                                  </>
                                                )}
                                                {step === 3 && (
                                                  <>
                                                  <p>Select Payment Method</p>
                                                  <div className="flex flex-col items-center justify-center my-4">
                                                    <div className="p-4 rounded w-full border-2 border-gray-300 cursor-pointer hover:border-foreground mb-2">
                                                      My Wallet
                                                    </div>
                                                    <div className="p-4 rounded w-full border-2 border-gray-300 cursor-pointer hover:border-foreground">
                                                      Cash
                                                    </div>
                                                  <div className="mt-4">
                                                      <Button
                                                        className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-6 py-1 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                                        onClick={() => setStep(4)}
                                                      >
                                                        Confirm Booking
                                                      </Button>
                                                    </div>
                                                  </div>

                                                  </>
                                                )}
                                                {step === 4 && (
                                                  <>
                                                  <p className="text-xl font-bold">Thank you</p>
                                                  <p className="text-gray-500 mt-2 text-sm">Your ride has been successfully booked.</p>
                                                  <div className="mt-4">
                                                    <Button
                                                      className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-6 py-1 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                                      onClick={close}
                                                    >
                                                      Close
                                                    </Button>
                                                  </div>
                                                  </>
                                                )}

                                              </DialogPanel>
                                            </div>
                                          </div>
                                        </Dialog>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md">Keke</div>
                                            <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md">Toyota</div>
                                            <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md">Small Bus</div>
                                            <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md">Big Shuttle</div>
                                        </div>
                                        
                                        
                                        </div>
                                        <div>
                                                <Image src="/images/kekepic2.png" alt="Ride Image" width={300} height={300} className="rounded-lg mt-4" />
                                        </div>
                                    </div>                                                                                
                                </div>
                                <div className="">
                                  {/* row-span-4 flex flex-row gap-4 */}
                                    <div className="bg-white shadow-md rounded-lg p-4 w-full">
                                        <p>Upcoming Rides</p>
                                        <hr className="my-2"/>
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
                        <div className="col-span-1 gap-4 mt-8 grid grid-rows-2">
                            <div className="row-span-1">
                            <div className=" bg-white shadow-md rounded-lg p-4 w-full border-2 h-1/2">
                                <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center h-full">
                                   <p>Map Shows here</p>
                                </div>
                            </div>
                            </div>
                        </div>
            
                      </div>
                        
                        
                    </div>
        </div>
    )
};