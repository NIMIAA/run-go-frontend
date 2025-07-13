import Image from "next/image";
import Navbar from "../components/nav";
import Footer from "../components/app/footer";
import Map from "../components/Map";
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon,
    QuestionMarkCircleIcon,
    AcademicCapIcon,
    TruckIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    UserIcon
} from "@heroicons/react/24/outline";

export default function Contact() {
    const faqs = [
        {
            question: "How do I register as a student?",
            answer: "Students can register using their Redeemer's University email address and RUN matric number format (RUN/XXX/YY/XXXXX). The system will validate your student credentials automatically."
        },
        {
            question: "How do I become a driver on Rungo?",
            answer: "To become a driver, you need to register through the driver signup page, provide your vehicle details, and complete our verification process. We'll review your application within 24-48 hours."
        },
        {
            question: "What payment methods are accepted?",
            answer: "We accept multiple payment methods including wallet payments, cash payments, and Paystack integration for secure online transactions."
        },
        {
            question: "How long does it take for a driver to respond?",
            answer: "Drivers are required to respond within 30 seconds of receiving a ride request. If no driver responds within this time, your request will be automatically cancelled."
        },
        {
            question: "Is my ride safe and secure?",
            answer: "Yes! All our drivers are verified and trained. We have real-time tracking, driver rating systems, and 24/7 support to ensure your safety throughout the ride."
        },
        {
            question: "What areas does Rungo cover?",
            answer: "Rungo currently covers the entire Redeemer's University campus including hostels, lecture halls, libraries, and all key campus locations."
        },
        {
            question: "How do I report an issue with my ride?",
            answer: "You can report any issues through our support channels: email at support@rungo.com, call us at +234-XXX-XXX-XXXX, or use the in-app support feature."
        },
        {
            question: "Can I cancel my ride after booking?",
            answer: "Yes, you can cancel your ride within 2 minutes of booking without any charges. Cancellations after this period may incur a small fee."
        },
        {
            question: "How do I update my profile information?",
            answer: "You can update your profile information anytime through your dashboard. Go to Profile section and click on 'Edit Profile' to make changes."
        },
        {
            question: "What if I lose something in the ride?",
            answer: "Contact our support team immediately with your ride details. We'll help you connect with the driver to recover your lost item."
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <header className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white min-h-[60vh] flex items-center relative overflow-hidden">
                <nav className="absolute top-0 left-0 right-0 z-10">
                    <Navbar />
                </nav>

                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/background/bg-3.jpg"
                        alt="Contact background"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                </div>

                <div className="container mx-auto px-6 py-20 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Get in Touch
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                            We're here to help with any questions about Rungo
                        </p>
                    </div>
                </div>
            </header>

            <main className="bg-gray-50">
                {/* Contact Information Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Contact Information
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Reach out to our support team for assistance with your account, rides, or any other inquiries
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4 lg:px-0">
                            {/* General Support */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200">
                                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                                    <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">General Support</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <EnvelopeIcon className="w-5 h-5 text-blue-600 mr-3" />
                                        <span className="text-gray-700">support@rungo.com</span>
                                    </div>
                                    <div className="flex items-center">
                                        <PhoneIcon className="w-5 h-5 text-blue-600 mr-3" />
                                        <span className="text-gray-700">+234-XXX-XXX-XXXX</span>
                                    </div>
                                    <div className="flex items-center">
                                        <ClockIcon className="w-5 h-5 text-blue-600 mr-3" />
                                        <span className="text-gray-700">24/7 Support</span>
                                    </div>
                                </div>
                            </div>

                            {/* Student Support */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200">
                                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                                    <AcademicCapIcon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Student Support</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <EnvelopeIcon className="w-5 h-5 text-green-600 mr-3" />
                                        <span className="text-gray-700">students@rungo.com</span>
                                    </div>
                                    <div className="flex items-center">
                                        <PhoneIcon className="w-5 h-5 text-green-600 mr-3" />
                                        <span className="text-gray-700">+234-XXX-XXX-XXXX</span>
                                    </div>
                                    <div className="flex items-center">
                                        <ClockIcon className="w-5 h-5 text-green-600 mr-3" />
                                        <span className="text-gray-700">Mon-Fri: 8AM-6PM</span>
                                    </div>
                                </div>
                            </div>

                            {/* Driver Support */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border border-purple-200">
                                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                                    <TruckIcon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Driver Support</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <EnvelopeIcon className="w-5 h-5 text-purple-600 mr-3" />
                                        <span className="text-gray-700">drivers@rungo.com</span>
                                    </div>
                                    <div className="flex items-center">
                                        <PhoneIcon className="w-5 h-5 text-purple-600 mr-3" />
                                        <span className="text-gray-700">+234-XXX-XXX-XXXX</span>
                                    </div>
                                    <div className="flex items-center">
                                        <ClockIcon className="w-5 h-5 text-purple-600 mr-3" />
                                        <span className="text-gray-700">Mon-Sat: 7AM-8PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Office Location Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Visit Our Office
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Located at Redeemer's University for easy access to our support team
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex items-center mb-6">
                                        <MapPinIcon className="w-8 h-8 text-blue-600 mr-4" />
                                        <h3 className="text-2xl font-semibold text-gray-900">Office Address</h3>
                                    </div>
                                    <div className="space-y-4 text-gray-700">
                                        <p className="text-lg">
                                            <strong>Rungo Support Office</strong><br />
                                            Redeemer's University<br />
                                            Ede, Osun State<br />
                                            Nigeria
                                        </p>
                                        <div className="flex items-center">
                                            <ClockIcon className="w-5 h-5 text-blue-600 mr-3" />
                                            <span>Monday - Friday: 8:00 AM - 6:00 PM</span>
                                        </div>
                                        <div className="flex items-center">
                                            <PhoneIcon className="w-5 h-5 text-blue-600 mr-3" />
                                            <span>+234-XXX-XXX-XXXX</span>
                                        </div>
                                    </div>
                                </div>
                                <Map />
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Find answers to the most common questions about Rungo
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="space-y-6">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
                                        <div className="flex items-start">
                                            <QuestionMarkCircleIcon className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                    {faq.question}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Send Us a Message
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours
                            </p>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            <form className="bg-white p-6 lg:p-8 rounded-xl shadow-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="student">Student Support</option>
                                        <option value="driver">Driver Support</option>
                                        <option value="technical">Technical Issue</option>
                                        <option value="billing">Billing Question</option>
                                        <option value="safety">Safety Concern</option>
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Tell us how we can help you..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
} 