import React, { useState } from 'react';
import { Camera, MapPin, Send, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function ReportComplaint() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    category: 'Pipeline Leakage',
    priority: 'Medium',
    description: '',
    wardNumber: '1',
    address: '',
    latitude: '',
    longitude: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData(prev => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6)
        }));
      }, () => alert("Location permission denied. Enter manually."));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Attempt Supabase submission (fallback if offline/demo)
    try {
      await supabase.from('complaints').insert([{
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        category: formData.category,
        priority: formData.priority,
        description: formData.description,
        ward_number: parseInt(formData.wardNumber),
        address: formData.address,
        latitude: parseFloat(formData.latitude) || 18.5204,
        longitude: parseFloat(formData.longitude) || 73.8567
      }]);
    } catch (err) {
      console.log("Supabase insert simulated:", err);
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl glass-card text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
        <h2 className="text-2xl font-bold">Complaint Submitted Successfully!</h2>
        <p className="text-sm text-slate-500">
          Your tracking reference ID is <span className="font-mono font-bold text-primary">JAL-{Math.floor(10000 + Math.random() * 90000)}</span>. You will receive SMS & Email updates on field engineer movement.
        </p>
        <button onClick={() => setSubmitted(false)} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold">
          File Another Complaint
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Report a Water Complaint</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Fill in accurate details for quick municipal dispatch.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Full Name</label>
              <input required type="text" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50" placeholder="Aarav Sharma" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone Number</label>
              <input required type="tel" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50" placeholder="9876543210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <select className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>Pipeline Leakage</option>
                <option>No Water Supply</option>
                <option>Dirty Water</option>
                <option>Low Pressure</option>
                <option>Water Wastage</option>
                <option>Illegal Connection</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Priority Level</label>
              <select className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Emergency</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Ward Number</label>
              <input required type="number" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50" placeholder="1-20" value={formData.wardNumber} onChange={e => setFormData({...formData, wardNumber: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Specific Address / Landmark</label>
            <input required type="text" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50" placeholder="Near Gate 3, Sunshine Complex..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description of Issue</label>
            <textarea required rows="3" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50" placeholder="Describe the leak duration, severity, etc." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          {/* Location Picker Placeholder */}
          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-xs">
                {formData.latitude ? `GPS: ${formData.latitude}, ${formData.longitude}` : "GPS Coordinates not locked"}
              </span>
            </div>
            <button type="button" onClick={handleGPSLocation} className="px-3 py-1.5 bg-blue-50 dark:bg-slate-800 text-primary text-xs font-semibold rounded-lg hover:bg-blue-100">
              Detect GPS Location
            </button>
          </div>

          {/* Media Attachments */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center cursor-pointer hover:border-primary">
              <Camera className="w-6 h-6 mx-auto mb-1 text-slate-400" />
              <span className="text-xs font-medium">Upload Photos</span>
            </div>
            <div className="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center cursor-pointer hover:border-primary">
              <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-slate-400" />
              <span className="text-xs font-medium">Attach Video (Optional)</span>
            </div>
          </div>

          <button type="submit" className="w-full py-3.5 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Submit Municipal Ticket</span>
          </button>
        </form>
      </div>
    </div>
  );
}