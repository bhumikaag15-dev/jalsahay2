import React, { useEffect, useState } from 'react';
import { Camera, MapPin, Send, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function ReportComplaint() {
  const { user } = useAuth();

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
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get the logged-in user's details from Supabase
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.user_metadata?.full_name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      alert('GPS is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6)
        }));
      },
      () => {
        alert('Location permission denied. You can enter the address manually.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login before submitting a complaint.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('complaints')
        .insert([
          {
            full_name: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            category: formData.category,
            priority: formData.priority,
            description: formData.description,
            ward_number: parseInt(formData.wardNumber, 10),
            address: formData.address,
            latitude: formData.latitude
              ? parseFloat(formData.latitude)
              : null,
            longitude: formData.longitude
              ? parseFloat(formData.longitude)
              : null,
            status: 'Submitted',
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Complaint submission error:', error);
        alert('Complaint submission failed: ' + error.message);
        return;
      }

      console.log('Complaint saved successfully:', data);

      setSubmittedComplaint(data);
      setSubmitted(true);

    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Something went wrong while submitting the complaint.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl glass-card text-center space-y-4">

        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>

        <h2 className="text-2xl font-bold">
          Complaint Submitted Successfully!
        </h2>

        <p className="text-sm text-slate-500">
          Your complaint has been saved successfully.
        </p>

        {submittedComplaint && (
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <p className="text-xs text-slate-500 mb-1">
              Complaint Reference ID
            </p>

            <p className="font-mono font-bold text-primary break-all">
              {submittedComplaint.id}
            </p>
          </div>
        )}

        <p className="text-xs text-slate-500">
          You can use this reference ID to track your complaint.
        </p>

        <button
          onClick={() => {
            setSubmitted(false);
            setSubmittedComplaint(null);

            setFormData(prev => ({
              ...prev,
              phone: '',
              category: 'Pipeline Leakage',
              priority: 'Medium',
              description: '',
              wardNumber: '1',
              address: '',
              latitude: '',
              longitude: ''
            }));
          }}
          className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold"
        >
          File Another Complaint
        </button>

      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">

        <div>
          <h1 className="text-2xl font-bold">
            Report a Water Complaint
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Fill in accurate details for quick municipal dispatch.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block font-semibold mb-1">
                Full Name
              </label>

              <input
                required
                type="text"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value
                  })
                }
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Phone Number
              </label>

              <input
                required
                type="tel"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value
                  })
                }
              />
            </div>

          </div>

          {/* Category + Priority + Ward */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div>
              <label className="block font-semibold mb-1">
                Category
              </label>

              <select
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value
                  })
                }
              >
                <option>Pipeline Leakage</option>
                <option>No Water Supply</option>
                <option>Dirty Water</option>
                <option>Low Pressure</option>
                <option>Water Wastage</option>
                <option>Illegal Connection</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Priority Level
              </label>

              <select
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value
                  })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Emergency</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Ward Number
              </label>

              <input
                required
                type="number"
                min="1"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
                placeholder="1-20"
                value={formData.wardNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    wardNumber: e.target.value
                  })
                }
              />
            </div>

          </div>

          {/* Address */}
          <div>
            <label className="block font-semibold mb-1">
              Specific Address / Landmark
            </label>

            <input
              required
              type="text"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
              placeholder="Enter the complaint location"
              value={formData.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: e.target.value
                })
              }
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-1">
              Description of Issue
            </label>

            <textarea
              required
              rows="3"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
              placeholder="Describe the leak duration, severity, etc."
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
              }
            />
          </div>

          {/* GPS */}
          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">

            <div className="flex items-center space-x-2">

              <MapPin className="w-5 h-5 text-primary" />

              <span className="text-xs">
                {formData.latitude
                  ? `GPS: ${formData.latitude}, ${formData.longitude}`
                  : 'GPS Coordinates not locked'}
              </span>

            </div>

            <button
              type="button"
              onClick={handleGPSLocation}
              className="px-3 py-1.5 bg-blue-50 dark:bg-slate-800 text-primary text-xs font-semibold rounded-lg hover:bg-blue-100"
            >
              Detect GPS Location
            </button>

          </div>

          {/* Media */}
          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center cursor-pointer hover:border-primary">

              <Camera className="w-6 h-6 mx-auto mb-1 text-slate-400" />

              <span className="text-xs font-medium">
                Upload Photos
              </span>

            </div>

            <div className="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center cursor-pointer hover:border-primary">

              <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-slate-400" />

              <span className="text-xs font-medium">
                Attach Video (Optional)
              </span>

            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2"
          >

            <Send className="w-4 h-4" />

            <span>
              {loading
                ? 'Submitting Complaint...'
                : 'Submit Municipal Ticket'}
            </span>

          </button>

        </form>

      </div>

    </div>
  );
}