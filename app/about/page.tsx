import Image from "next/image";
import Navbar from "../components/nav";
import Footer from "../components/app/footer";
import {
    MapPinIcon,
    UsersIcon,
    FaceSmileIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    ClockIcon,
    StarIcon,
    EnvelopeIcon,
    UserIcon,
    AcademicCapIcon,
    BriefcaseIcon,
    TruckIcon,
    LockClosedIcon,
    PhoneIcon
} from "@heroicons/react/24/outline";

export default function About() {
    return (
        <>
            {/* Hero Section */}
            <header className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white min-h-screen flex items-center relative overflow-hidden">
                <nav className="absolute top-0 left-0 right-0 z-10">
                    <Navbar />
                </nav>

                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/background/bg-3.jpg"
                        alt="Ride booking background"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                </div>

                <div className="container mx-auto px-6 py-20 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Your Trusted Ride Booking Platform
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                            Connecting Redeemer's University students and staff with reliable drivers across campus
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Book Your Ride
                            </button>
                            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-800 font-semibold px-8 py-4 rounded-lg transition-all duration-300">
                                Become a Driver
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="bg-gray-50">
                {/* Key Features Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Why Choose Rungo?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Experience the future of ride booking with our comprehensive platform designed specifically for Redeemer's University students and staff
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                    <AcademicCapIcon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Student & Professional Support</h3>
                                <p className="text-gray-600">
                                    Specialized registration for students with matric number validation and professionals with enhanced features
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                    <MapPinIcon className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Driver Matching</h3>
                                <p className="text-gray-600">
                                    Live driver availability and location tracking for instant ride matching
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                                    <CreditCardIcon className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Multiple Payment Options</h3>
                                <p className="text-gray-600">
                                    Wallet system and cash payments with secure Paystack integration
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                                    <ClockIcon className="w-8 h-8 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">30-Second Response Time</h3>
                                <p className="text-gray-600">
                                    Request-respond workflow with guaranteed 30-second driver response time
                                </p>
                            </div>



                            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                                    <StarIcon className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Driver Rating System</h3>
                                <p className="text-gray-600">
                                    Track driver performance and user ratings for quality assurance
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                How It Works
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Get your ride in three simple steps
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-white text-2xl font-bold">1</span>
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Request a Ride</h3>
                                <p className="text-gray-600">
                                    Select your pickup and destination locations through our intuitive interface
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-white text-2xl font-bold">2</span>
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Driver Response</h3>
                                <p className="text-gray-600">
                                    Drivers receive instant notifications and respond within 30 seconds
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-white text-2xl font-bold">3</span>
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Payment & Ride</h3>
                                <p className="text-gray-600">
                                    Secure payment processing and ride confirmation for a smooth experience
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* User Types Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Designed for Everyone
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Specialized registration and features for different user types
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200">
                                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                                    <AcademicCapIcon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Students</h3>
                                <ul className="text-gray-600 space-y-2">
                                    <li>• Special registration with RUN matric number format</li>
                                    <li>• School email validation</li>
                                    <li>• Campus-specific features</li>
                                    <li>• Student-friendly pricing</li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200">
                                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                                    <BriefcaseIcon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Professionals</h3>
                                <ul className="text-gray-600 space-y-2">
                                    <li>• Standard registration with regular email</li>
                                    <li>• Business account features</li>
                                    <li>• Corporate ride booking</li>
                                    <li>• Expense tracking</li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border border-purple-200">
                                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                                    <TruckIcon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Drivers</h3>
                                <ul className="text-gray-600 space-y-2">
                                    <li>• Verified driver registration</li>
                                    <li>• Car details and availability tracking</li>
                                    <li>• Real-time earnings dashboard</li>
                                    <li>• Performance analytics</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>



                {/* Safety & Security Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Safety & Security First
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Your safety and security are our top priorities
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Verification</h3>
                                <p className="text-gray-600">
                                    Secure account verification system ensures only legitimate users join our platform
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                                    <LockClosedIcon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Authentication</h3>
                                <p className="text-gray-600">
                                    JWT-based authentication with encrypted tokens for secure user sessions
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                                    <UserIcon className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Driver Verification</h3>
                                <p className="text-gray-600">
                                    Comprehensive driver verification process including background checks
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                                    <MapPinIcon className="w-8 h-8 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Tracking</h3>
                                <p className="text-gray-600">
                                    Live location tracking for enhanced safety and ride monitoring
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                                    <CreditCardIcon className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Security</h3>
                                <p className="text-gray-600">
                                    Secure payment processing with Paystack's industry-standard encryption
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                                    <PhoneIcon className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Support</h3>
                                <p className="text-gray-600">
                                    Round-the-clock customer support for any safety concerns or issues
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                            Join hundreds of Redeemer's University students and staff who trust Rungo for their daily campus commute
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Book Your First Ride
                            </button>
                            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-800 font-semibold px-8 py-4 rounded-lg transition-all duration-300">
                                Become a Driver
                            </button>
                        </div>
                        <div className="mt-8 text-blue-100">
                            <p>Need help? Contact our support team</p>
                            <p className="text-lg font-semibold mt-2">support@rungo.com</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
} 