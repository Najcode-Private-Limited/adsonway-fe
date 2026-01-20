import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    ResponsiveContainer,
} from "recharts";
import {
    Users,
    DollarSign,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getItem } from "@/utils/local_storage";

const NewDashboard = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const role = getItem("userRole");
        setUserRole(role || "User");
    }, []);

    // Get current date and time-based greeting
    const today = new Date();
    const hours = today.getHours();

    const getGreeting = () => {
        if (hours >= 5 && hours < 12) {
            return "Good Morning";
        } else if (hours >= 12 && hours < 17) {
            return "Good Afternoon";
        } else {
            return "Good Evening";
        }
    };

    const getRoleLabel = () => {
        switch (userRole) {
            case "admin":
                return "Admin";
            case "agent":
                return "Agent";
            case "user":
                return "User";
            default:
                return userRole || "User";
        }
    };

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayName = days[today.getDay()];
    const monthName = months[today.getMonth()];
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${dayName}, ${monthName} ${day}, ${year}`;

    // Monthly earnings chart data
    const earningsData = [
        { value: 20 },
        { value: 35 },
        { value: 25 },
        { value: 45 },
        { value: 30 },
        { value: 55 },
        { value: 70 },
    ];

    // Visitor value bar chart data
    const visitorData = [
        { value: 40 },
        { value: 65 },
        { value: 45 },
        { value: 80 },
        { value: 55 },
        { value: 70 },
        { value: 60 },
        { value: 50 },
        { value: 75 },
    ];

    // Orders data
    const ordersData = [
        {
            id: 1,
            name: "Advanced Soft Couch",
            price: "$427",
            image: "🪑",
            badge: "2",
        },
        {
            id: 2,
            name: "Handmade Cotton Chair",
            price: "$472",
            image: "🛋️",
            badge: "eye",
        },
        {
            id: 3,
            name: "Rustic Rubber Chair",
            price: "$609",
            image: "🪑",
            badge: "2",
        },
    ];

    const slides = [
        {
            id: 1,
            title: "Smarter selling with",
            titleLine2: "AI tools",
            description: "Automate tasks, reply instantly, and gain helpful insights for growth with less effort.",
            buttonText: "Explore AI",
            icon: "🚀",
            gradient: "linear-gradient(135deg, #0d1f1a 0%, #0a1612 50%, #0d1117 100%)",
        },
        {
            id: 2,
            title: "Boost your sales with",
            titleLine2: "Analytics",
            description: "Track performance metrics, understand customer behavior, and make data-driven decisions.",
            buttonText: "View Analytics",
            icon: "📊",
            gradient: "linear-gradient(135deg, #1a0d1f 0%, #120a16 50%, #0d1117 100%)",
        },
        {
            id: 3,
            title: "Connect with customers",
            titleLine2: "Instantly",
            description: "Real-time chat support, automated responses, and seamless communication tools.",
            buttonText: "Start Chat",
            icon: "💬",
            gradient: "linear-gradient(135deg, #0d1a1f 0%, #0a1216 50%, #0d1117 100%)",
        },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="bg-[#06080A] min-h-screen text-[#e6edf3]">
            <div className="flex flex-col min-[1100px]:flex-row gap-0 max-w-[1800px] mx-auto min-h-screen">
                <div className="w-full min-[1100px]:w-[380px] min-[1100px]:shrink-0 px-6 min-[1100px]:px-8 py-8 min-[1100px]:py-0 border-b min-[1100px]:border-b-0 min-[1100px]:border-r border-[#21262d] bg-sidebar">
                    <div className="pt-4 min-[1100px]:pt-8 pb-8">
                        <p className="text-[#7d8590] text-[13px] mb-2 font-normal">
                            {formattedDate}
                        </p>
                        <h1 className="text-2xl min-[1100px]:text-[26px] font-semibold leading-tight">
                            {getGreeting()}, {getRoleLabel()}!
                        </h1>
                    </div>
                    {/* Stats Section */}
                    <div className="mb-10 border-b border-[#21262d] pb-8">
                        <p className="text-[#7d8590] text-[13px] mb-8 font-normal">
                            Updates from yesterday.
                        </p>

                        <div className="grid grid-cols-1 min-[1100px]:grid-cols-1 gap-7">
                            {/* Visitors */}
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-[#161b22] flex items-center justify-center">
                                    <Users className="w-5 h-5 text-[#3b82f6]" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl min-[1100px]:text-4xl font-bold tracking-tight">2,110</span>
                                    <span className="text-[#7d8590] text-sm font-normal">Visitors</span>
                                </div>
                            </div>

                            {/* Earnings */}
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-[#161b22] flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-[#3b82f6]" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl min-[1100px]:text-4xl font-bold tracking-tight">$8.2M</span>
                                    <span className="text-[#7d8590] text-sm font-normal">Earnings</span>
                                </div>
                            </div>

                            {/* Orders */}
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-[#161b22] flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-[#eab308]" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl min-[1100px]:text-4xl font-bold tracking-tight">1,124</span>
                                    <span className="text-[#7d8590] text-sm font-normal">Orders</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="mb-8 min-[1100px]:mb-0">
                        <p className="text-[#7d8590] text-[13px] mb-5 font-normal">
                            You have 16 orders today.
                        </p>
                        <div className="grid grid-cols-1 min-[1100px]:grid-cols-1 gap-3">
                            {ordersData.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-[#161b22] border border-[#21262d] rounded-xl p-4 flex items-center justify-between hover:bg-[#1c2128] hover:border-[#30363d] transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-12 h-12 shrink-0 rounded-lg bg-[#0d1117] flex items-center justify-center text-2xl">
                                            {order.image}
                                        </div>
                                        <div className="truncate">
                                            <p className="text-[14px] font-medium mb-1 truncate">{order.name}</p>
                                            <p className="text-[#7d8590] text-[13px]">{order.price}</p>
                                        </div>
                                    </div>
                                    <div className="w-9 h-9 shrink-0 rounded-full bg-[#0d1117] border border-[#21262d] flex items-center justify-center cursor-pointer">
                                        <MoreHorizontal className="w-[18px] h-[18px] text-[#7d8590]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Section - Charts Grid */}
                <div className="flex-1 px-6 min-[1100px]:px-8 py-8 flex flex-col gap-6 overflow-hidden">
                    {/* Top Row - Earnings & Visitor Cards */}
                    <div className="grid grid-cols-1 min-[1100px]:grid-cols-2 gap-6">
                        {/* Monthly Earnings */}
                        <div className="bg-[#06080A] border border-[#21262d] rounded-lg p-6 min-[1100px]:p-7 flex flex-col min-h-[240px]">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Monthly Earnings</h3>
                                    <p className="text-[#7d8590] text-[13px]">Total profit gained</p>
                                </div>
                                <MoreHorizontal className="w-5 h-5 text-[#7d8590] cursor-pointer" />
                            </div>

                            <div className="mt-auto flex flex-col min-[1100px]:flex-row min-[1100px]:items-end justify-between gap-4">
                                <div>
                                    <p className="text-3xl min-[1100px]:text-4xl font-bold leading-none mb-3 tracking-tight">$25,049</p>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md text-xs font-semibold">
                                            +4.33%
                                        </span>
                                        <span className="text-[#7d8590] text-[13px]">vs last month</span>
                                    </div>
                                </div>
                                <div className="w-full min-[1100px]:w-[160px] h-[70px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={earningsData}>
                                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Visitor Value */}
                        <div className="bg-[#06080A] border border-[#21262d] rounded-lg p-6 min-[1100px]:p-7 flex flex-col min-h-[240px]">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Visitor Value</h3>
                                    <p className="text-[#7d8590] text-[13px]">Avg. income per site visit</p>
                                </div>
                                <MoreHorizontal className="w-5 h-5 text-[#7d8590] cursor-pointer" />
                            </div>

                            <div className="mt-auto flex flex-col min-[1100px]:flex-row min-[1100px]:items-end justify-between gap-4">
                                <div>
                                    <p className="text-3xl min-[1100px]:text-4xl font-bold leading-none mb-3 tracking-tight">$63.02</p>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-red-500/10 text-red-400 px-2.5 py-1 rounded-md text-xs font-semibold">
                                            -1.03%
                                        </span>
                                        <span className="text-[#7d8590] text-[13px]">vs last month</span>
                                    </div>
                                </div>
                                <div className="w-full min-[1100px]:w-[180px] h-[70px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={visitorData}>
                                            <Bar dataKey="value" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row - AI Tools Carousel Slider */}
                    <div
                        className="rounded-lg p-6 min-[1100px]:p-8 relative overflow-hidden min-h-[320px] min-[1100px]:min-h-[280px] flex items-center"
                        style={{ background: slides[currentSlide].gradient, border: "1px solid #1f2f28" }}
                    >
                        {/* Dots indicator - Top Left */}
                        <div className="absolute top-6 left-6 min-[1100px]:left-8 flex gap-2">
                            {slides.map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-[3px] rounded-[2px] cursor-pointer transition-all duration-300 ${currentSlide === index ? "w-8 bg-[#10b981]" : "w-2 bg-[#374151]"
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Navigation Arrows - Top Right */}
                        <div className="absolute top-5 right-6 flex gap-2.5">
                            <button
                                onClick={prevSlide}
                                className="w-9 h-9 rounded-full border border-[#374151] bg-black/40 flex items-center justify-center transition-all hover:border-[#10b981] hover:bg-[#10b981]/10 group"
                            >
                                <ChevronLeft className="w-[18px] h-[18px] text-[#9ca3af] group-hover:text-[#10b981] transition-colors" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-9 h-9 rounded-full border border-[#374151] bg-black/40 flex items-center justify-center transition-all hover:border-[#10b981] hover:bg-[#10b981]/10 hover:scale-105 group"
                            >
                                <ChevronRight className="w-[18px] h-[18px] text-[#9ca3af] group-hover:text-[#10b981] transition-colors" />
                            </button>
                        </div>

                        {/* Slide Content */}
                        <div className="flex flex-col min-[1100px]:flex-row items-center gap-8 min-[1100px]:gap-12 w-full mt-10 min-[1100px]:mt-4">
                            {/* Icon Illustration */}
                            <div className="text-[80px] sm:text-[110px] min-[1100px]:text-[140px] leading-none [filter:drop-shadow(0_0_20px_rgba(16,185,129,0.3))] animate-[float_3s_ease-in-out_infinite] rotate-[-15deg]">
                                {slides[currentSlide].icon}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 text-center min-[1100px]:text-left">
                                <h3 className="text-2xl min-[1100px]:text-3xl font-bold leading-tight mb-4 tracking-tight">
                                    <span className="text-[#10b981]">{slides[currentSlide].title}</span>
                                    <br />
                                    <span className="text-[#10b981]">{slides[currentSlide].titleLine2}</span>
                                </h3>
                                <p className="text-[#9ca3af] text-[14px] leading-relaxed mb-6 max-w-[420px] mx-auto min-[1100px]:mx-0">
                                    {slides[currentSlide].description}
                                </p>
                                <button className="px-7 py-3 bg-[#3b82f6] rounded-[10px] text-white text-[14px] font-semibold transition-all hover:bg-[#2563eb] hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.4)]">
                                    {slides[currentSlide].buttonText}
                                </button>
                            </div>
                        </div>

                        {/* CSS Animations */}
                        <style>
                            {`
                                @keyframes fadeIn {
                                    from { opacity: 0; transform: translateX(20px); }
                                    to { opacity: 1; transform: translateX(0); }
                                }
                                @keyframes float {
                                    0%, 100% { transform: rotate(-15deg) translateY(0px); }
                                    50% { transform: rotate(-15deg) translateY(-10px); }
                                }
                            `}
                        </style>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewDashboard;
