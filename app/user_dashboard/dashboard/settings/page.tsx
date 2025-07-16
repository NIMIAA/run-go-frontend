"use client";
import React, { useState } from "react";
import { getUserData } from "@/app/utils/auth";
import Link from "next/link";
import {
    UserIcon,
    BellIcon,
    ShieldCheckIcon,
    PaintBrushIcon,
    TrashIcon,
    KeyIcon,
    EnvelopeIcon,
    PhoneIcon
} from "@heroicons/react/24/outline";

// Toggle Switch Component
const ToggleSwitch = ({
    enabled,
    onChange,
    label
}: {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label: string;
}) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <button
            type="button"
            className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            onClick={() => onChange(!enabled)}
        >
            <span
                className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
        </button>
    </div>
);

// Settings Card Component
const SettingsCard = ({
    title,
    icon: Icon,
    children
}: {
    title: string;
    icon: any;
    children: React.ReactNode;
}) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
                <Icon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
        </div>
        {children}
    </div>
);

// Main Settings Page Component
export default function SettingsPage() {
    const user = getUserData();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [theme, setTheme] = useState("light");
    const [language, setLanguage] = useState("english");

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h2>
                <p className="text-gray-600">Manage your account preferences and settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Information */}
                <SettingsCard title="Account Information" icon={UserIcon}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div className="flex items-center">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Email</p>
                                    <p className="text-sm text-gray-500">{user?.email || "Not provided"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div className="flex items-center">
                                <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Full Name</p>
                                    <p className="text-sm text-gray-500">
                                        {user ? `${user.firstName} ${user.lastName}` : "Not provided"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center">
                                <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Phone Number</p>
                                    <p className="text-sm text-gray-500">{user?.phoneNumber || "Not provided"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Link
                                href="/authentication/set-new-password"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                                <KeyIcon className="h-4 w-4 mr-2" />
                                Change Password
                            </Link>
                        </div>
                    </div>
                </SettingsCard>

                {/* Notifications */}
                <SettingsCard title="Notifications" icon={BellIcon}>
                    <div className="space-y-4">
                        <ToggleSwitch
                            enabled={emailNotifications}
                            onChange={setEmailNotifications}
                            label="Email Notifications"
                        />
                        <ToggleSwitch
                            enabled={smsNotifications}
                            onChange={setSmsNotifications}
                            label="SMS Notifications"
                        />
                        <ToggleSwitch
                            enabled={pushNotifications}
                            onChange={setPushNotifications}
                            label="Push Notifications"
                        />
                        <div className="pt-2">
                            <p className="text-xs text-gray-500">
                                Receive notifications about your rides and account updates
                            </p>
                        </div>
                    </div>
                </SettingsCard>

                {/* Appearance */}
                <SettingsCard title="Appearance" icon={PaintBrushIcon}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Theme</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={`p-3 rounded-lg border-2 transition-all ${theme === "light"
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="text-sm font-medium">Light</div>
                                    <div className="text-xs text-gray-500">Clean and bright</div>
                                </button>
                                <button
                                    onClick={() => setTheme("dark")}
                                    className={`p-3 rounded-lg border-2 transition-all ${theme === "dark"
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="text-sm font-medium">Dark</div>
                                    <div className="text-xs text-gray-500">Easy on the eyes</div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="english">English</option>
                                <option value="spanish">Spanish</option>
                                <option value="french">French</option>
                                <option value="german">German</option>
                            </select>
                        </div>
                    </div>
                </SettingsCard>

                {/* Privacy & Security */}
                <SettingsCard title="Privacy & Security" icon={ShieldCheckIcon}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-500">Add an extra layer of security</p>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Enable
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Login Sessions</p>
                                <p className="text-sm text-gray-500">Manage your active sessions</p>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                View
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Data Export</p>
                                <p className="text-sm text-gray-500">Download your personal data</p>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Export
                            </button>
                        </div>
                    </div>
                </SettingsCard>
            </div>

            {/* Danger Zone */}
            <div className="mt-8">
                <SettingsCard title="Danger Zone" icon={TrashIcon}>
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <TrashIcon className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Delete Account</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>
                                            Once you delete your account, there is no going back. Please be certain.
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => alert("Account deletion is not implemented yet.")}
                                            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SettingsCard>
            </div>
        </div>
    );
} 