import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import BASE_URL from "../config.js";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

function LocationMarker({ position, setPosition }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position ? <Marker position={position} /> : null;
}

const categories = [
    "Wallet / Purse",
    "Electronics",
    "Documents / IDs",
    "Keys",
    "Bags / Luggage",
    "Pets",
    "Other",
];

const tips = [
    { num: "01", text: "Upload a photo — this is the single biggest boost to AI match accuracy" },
    { num: "02", text: "Describe what's inside bags or wallets — finders describe contents" },
    { num: "03", text: "Include any unique marks — scratches, stickers, engravings" },
    { num: "04", text: "Be as specific as possible about the location — neighbourhood or landmark" },
    { num: "05", text: "Enable push notifications so you're alerted the moment a match is found" },
];

export default function ReportItem() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [reportType, setReportType] = useState("lost"); // lost or found
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        item_name: "",
        category: categories[0],
        location: "",
        lat: null,
        lng: null,
        date: "",
        description: "",
        identifiers: "",
        alert_method: "push"
    });

    const location = useLocation();

    const [editId, setEditId] = useState(null);

    React.useEffect(() => {
        if (location.state?.reportType) {
            setReportType(location.state.reportType);
        }

        if (location.state?.editItem) {
            const item = location.state.editItem;
            setEditId(item.id);
            setReportType(item.type);
            setFormData({
                item_name: item.item_name,
                category: item.category,
                location: item.location,
                lat: item.lat || null,
                lng: item.lng || null,
                date: item.date ? new Date(item.date).toISOString().split('T')[0] : "",
                description: item.description,
                identifiers: item.identifiers || "",
                alert_method: item.alert_method || "push"
            });
            if (item.image_url) {
                setImagePreview(`${BASE_URL}/uploads/${item.image_url}`);
            }
        }
    }, [location.state]);

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Image size should be less than 10MB");
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef(null);

    // Close suggestions on outside click
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setDatePickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const datePickerRef = useRef(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const generateDays = () => {
        const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const days = [];

        for (let i = 0; i < start.getDay(); i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
        }

        for (let i = 1; i <= end.getDate(); i++) {
            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isSelected = formData.date === dateStr;
            days.push(
                <div
                    key={i}
                    onClick={() => { setFormData({ ...formData, date: dateStr }); setDatePickerOpen(false); }}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer text-xs font-bold transition-all ${isSelected ? 'bg-[#FF2E7E] text-[#050505] shadow-[0_0_10px_rgba(255,46,126,0.3)]' : 'text-gray-400 hover:bg-[#FF2E7E]/20 hover:text-white'}`}
                >
                    {i}
                </div>
            );
        }
        return days;
    };

    const fetchSuggestions = async (query) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }
        try {
            // Photon API (OpenStreetMap based) - focusing on Maharashtra area
            const res = await fetch(`https://photon.komoot.io/api/?q=${query}&lat=18.97&lon=72.82&limit=5`);
            const data = await res.json();
            const locs = data.features.map(f => {
                const p = f.properties;
                const parts = [p.name, p.street, p.district, p.city, p.state].filter(Boolean);
                // Filter for Maharashtra to be extra helpful, but don't be too strict
                return { name: parts.join(", "), coords: f.geometry.coordinates }; // coords is [lon, lat]
            });
            // Remove duplicates by name
            const unique = [];
            const names = new Set();
            for (const l of locs) {
                if (!names.has(l.name)) {
                    names.add(l.name);
                    unique.push(l);
                }
            }
            setSuggestions(unique);
        } catch (err) {
            console.error("Suggestion fetch error:", err);
        }
    };

    const handleLocationChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, location: value });
        setShowSuggestions(true);

        // Debounce
        clearTimeout(window.suggestionTimeout);
        window.suggestionTimeout = setTimeout(() => {
            fetchSuggestions(value);
        }, 300);
    };

    const selectSuggestion = (loc) => {
        setFormData({ ...formData, location: loc.name, lat: loc.coords[1], lng: loc.coords[0] });
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check auth
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please sign in to submit a report");
            navigate("/auth");
            return;
        }

        // Validation
        if (!formData.item_name || !formData.location || !formData.date || !formData.description) {
            toast.error("Please fill in all required fields (*)");
            return;
        }

        setLoading(true);
        const submitData = new FormData();
        submitData.append("type", reportType);
        submitData.append("item_name", formData.item_name);
        submitData.append("category", formData.category);
        submitData.append("location", formData.location);
        if (formData.lat && formData.lng) {
            submitData.append("lat", formData.lat);
            submitData.append("lng", formData.lng);
        }
        submitData.append("date", formData.date);
        submitData.append("description", formData.description);
        submitData.append("identifiers", formData.identifiers);
        submitData.append("alert_method", formData.alert_method);
        if (image) {
            submitData.append("image", image);
        }

        try {
            const url = editId ? `${BASE_URL}/api/reports/${editId}` : `${BASE_URL}/api/reports`;
            const method = editId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: submitData
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || (editId ? "Report updated successfully!" : "Report submitted successfully!"));
                setTimeout(() => {
                    navigate(editId ? `/item/${editId}` : "/dashboard");
                }, 2000);
            } else {
                throw new Error(result.error || "Failed to process report");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black text-white min-h-screen pt-30 pb-20 px-4">
            <div className="max-w-6xl mx-auto pt-4">

                {/* Header Section */}
                <div className="mb-10">
                    <span className="text-[#FF2E7E] font-bold tracking-[0.2em] text-[10px] uppercase block mb-4">
                        FILE A REPORT
                    </span>
                    <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tight leading-none mb-8">
                        {editId ? "EDIT YOUR REPORT" : "WHAT HAPPENED?"}
                    </h1>

                    {/* Report Type Tabs */}
                    <div className="inline-flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setReportType("lost")}
                            disabled={!!editId}
                            className={`px-8 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all ${reportType === "lost" ? 'bg-[#FF2E7E] text-black shadow-lg shadow-[#FF2E7E]/20' : 'text-gray-400 hover:text-white'} ${editId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            LOST SOMETHING
                        </button>
                        <button
                            onClick={() => setReportType("found")}
                            disabled={!!editId}
                            className={`px-8 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all ${reportType === "found" ? 'bg-[#FF2E7E] text-black shadow-lg shadow-[#FF2E7E]/20' : 'text-gray-400 hover:text-white'} ${editId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            FOUND SOMETHING
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">

                    {/* LEFT SIDE: Form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">

                        <div className="grid md:grid-cols-2 gap-6 items-start">
                            {/* Item Name */}
                            <div>
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">ITEM NAME *</label>
                                <input
                                    type="text"
                                    name="item_name"
                                    value={formData.item_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Blue leather wallet"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-[#FF2E7E] focus:bg-white/[0.05] transition"
                                />
                            </div>

                            {/* Category Dropdown */}
                            <div className="relative">
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">CATEGORY *</label>
                                <div
                                    onClick={() => setCategoryOpen(!categoryOpen)}
                                    className={`w-full bg-white/[0.03] border ${categoryOpen ? 'border-[#FF2E7E]' : 'border-white/5'} rounded-xl px-5 py-3.5 text-white text-sm cursor-pointer flex items-center justify-between transition-all`}
                                >
                                    <span>{formData.category}</span>
                                    <svg className={`w-4 h-4 text-[#FF2E7E] transition-transform ${categoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                                {categoryOpen && (
                                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#111] border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl">
                                        {categories.map((cat) => (
                                            <div
                                                key={cat}
                                                onClick={() => { setFormData({ ...formData, category: cat }); setCategoryOpen(false); }}
                                                className="px-5 py-3 text-sm text-gray-400 hover:text-white hover:bg-[#FF2E7E]/10 cursor-pointer transition-colors"
                                            >
                                                {cat}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 items-start">
                            {/* Location */}
                            <div className="relative" ref={suggestionRef}>
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">LOCATION *</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="location"
                                        autoComplete="off"
                                        value={formData.location}
                                        onChange={handleLocationChange}
                                        onFocus={() => setShowSuggestions(true)}
                                        placeholder="Type city, town or village (e.g. Karad)"
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-[#FF2E7E] transition pl-11"
                                    />
                                    <svg className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>

                                    {showSuggestions && formData.location.length > 0 && (
                                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#111] border border-white/10 rounded-xl overflow-hidden z-30 shadow-2xl animate-fade-in">
                                            {/* Suggestions from API */}
                                            {suggestions.map((loc, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => selectSuggestion(loc)}
                                                    className="px-5 py-3 text-sm text-gray-400 hover:text-white hover:bg-[#FF2E7E]/10 cursor-pointer transition-colors flex items-center gap-3"
                                                >
                                                    <span className="w-1.5 h-1.5 bg-[#FF2E7E] rounded-full opacity-50" />
                                                    {loc.name}
                                                </div>
                                            ))}

                                            {/* Manual Entry Option */}
                                            <div
                                                onClick={() => setShowSuggestions(false)}
                                                className="px-5 py-3 text-[10px] text-gray-500 bg-white/[0.02] border-t border-white/5 uppercase tracking-widest font-bold flex items-center justify-between cursor-pointer"
                                            >
                                                <span>Press enter to use what you typed</span>
                                                <span className="text-[#FF2E7E] opacity-50">MANUAL ENTRY</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Map Box */}
                                <div className="w-full h-48 rounded-xl overflow-hidden border border-white/5 relative z-10 mt-3">
                                    <MapContainer center={formData.lat ? [formData.lat, formData.lng] : [19.0760, 72.8777]} zoom={12} style={{ height: "100%", width: "100%", zIndex: 10 }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationMarker position={formData.lat ? { lat: formData.lat, lng: formData.lng } : null} setPosition={(pos) => setFormData({ ...formData, lat: pos.lat, lng: pos.lng })} />
                                    </MapContainer>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">Click on the map to drop a precise pin</p>
                            </div>

                            {/* Date */}
                            <div className="relative" ref={datePickerRef}>
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">DATE *</label>
                                <div className="relative cursor-pointer" onClick={() => setDatePickerOpen(!datePickerOpen)}>
                                    <input
                                        type="text"
                                        readOnly
                                        value={formData.date ? new Date(formData.date).toLocaleDateString() : "Select a date"}
                                        className={`w-full bg-white/[0.03] border ${datePickerOpen ? 'border-[#FF2E7E]' : 'border-white/5'} rounded-xl px-5 py-3.5 text-white text-sm outline-none cursor-pointer transition pr-11`}
                                    />
                                    <svg className="w-5 h-5 text-[#FF2E7E] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                {datePickerOpen && (
                                    <div className="absolute top-[calc(100%+8px)] left-0 w-full md:w-[320px] bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 z-30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-fade-in">
                                        <div className="flex items-center justify-between mb-4">
                                            <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#FF2E7E]/20 text-gray-400 hover:text-[#FF2E7E] transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                            </button>
                                            <div className="text-xs font-bold text-white uppercase tracking-widest">
                                                {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                            </div>
                                            <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#FF2E7E]/20 text-gray-400 hover:text-[#FF2E7E] transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 mb-2">
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                                <div key={day} className="h-8 flex items-center justify-center text-[10px] font-black text-gray-600 uppercase">{day}</div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-7 gap-1">
                                            {generateDays()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">DESCRIPTION *</label>
                            <textarea
                                rows="3"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe color, size, brand, unique marks, what's inside (for bags/wallets)..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-[#FF2E7E] transition resize-none"
                            />
                        </div>

                        {/* Unique Identifiers */}
                        <div>
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">UNIQUE IDENTIFIERS</label>
                            <input
                                type="text"
                                name="identifiers"
                                value={formData.identifiers}
                                onChange={handleChange}
                                placeholder="Serial number, engraving, stickers, damage..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-[#FF2E7E] transition"
                            />
                        </div>

                        {/* Photo Upload area */}
                        <div>
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">PHOTO</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center bg-white/[0.01] hover:border-[#FF2E7E]/50 hover:bg-white/[0.03] transition-all cursor-pointer group min-h-[160px]"
                            >
                                {imagePreview ? (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(null); }}
                                            className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-1 shadow-lg"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <svg className="w-10 h-10 text-gray-500 group-hover:text-[#FF2E7E] mb-3 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="text-sm text-gray-400">
                                            Drag & drop or <span className="text-[#FF2E7E] font-bold">click to upload</span>
                                        </p>
                                        <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest font-bold">JPG, PNG, WEBP — MAX 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Alert Selection */}
                        <div>
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">ALERT ME VIA</label>
                            <div className="grid grid-cols-3 gap-4">
                                {["PUSH", "EMAIL", "SMS"].map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, alert_method: method.toLowerCase() })}
                                        className={`py-3.5 rounded-xl border font-bold text-[10px] tracking-[0.2em] transition-all ${formData.alert_method === method.toLowerCase() ? 'bg-[#FF2E7E]/10 border-[#FF2E7E] text-[#FF2E7E]' : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/20'}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 bg-[#FF2E7E] text-black font-extrabold uppercase tracking-[0.2em] text-xs rounded-xl shadow-[0_10px_40px_rgba(255,46,126,0.3)] hover:bg-pink-600 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? "PROCESSING..." : (editId ? "SAVE CHANGES" : (reportType === "lost" ? "SUBMIT LOST REPORT" : "REPORT FOUND ITEM"))}
                            {!loading && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                        </button>

                    </form>

                    {/* RIGHT SIDE: Info Boxes */}
                    <div className="lg:col-span-5 space-y-8">

                        {/* Tips Card */}
                        <div className="bg-[#080808] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-[#FF2E7E] rounded-full shadow-[0_0_8px_#FF2E7E]" />
                                <span className="text-[10px] font-bold tracking-[0.2em] text-[#FF2E7E] uppercase">TIPS FOR BETTER MATCHES</span>
                            </div>
                            <div className="p-8 space-y-6">
                                {tips.map((tip) => (
                                    <div key={tip.num} className="flex gap-6">
                                        <span className="text-xs font-bold text-[#FF2E7E] opacity-50">{tip.num}</span>
                                        <p className="text-sm text-gray-400 leading-relaxed">{tip.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What Happens Next Card */}
                        <div className="bg-[#080808] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_green]" />
                                <span className="text-[10px] font-bold tracking-[0.2em] text-green-500 uppercase">WHAT HAPPENS NEXT</span>
                            </div>
                            <div className="p-8 space-y-6">
                                {[
                                    "Your report is stored and the AI scans all existing reports immediately",
                                    "You see your top matches ranked by confidence score",
                                    "You get alerted whenever new matches appear — even days later"
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <span className="text-green-500 text-xs">→</span>
                                        <p className="text-sm text-gray-400 leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <div className="h-20" />
        </div>
    );
}
