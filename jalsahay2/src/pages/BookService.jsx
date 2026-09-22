import React, { useState } from 'react';
import { MapPin, Clock3, CreditCard, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createServiceRequest, serviceOptions } from '../lib/marketplaceApi';
import { useLanguage } from '../context/LanguageContext';

export default function BookService() {
  const [selectedService, setSelectedService] = useState(serviceOptions[0]);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [submitted, setSubmitted] = useState(false);
  const [request, setRequest] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { data, error: requestError } = await createServiceRequest({
      userId: user.id,
      service: selectedService,
      address,
      arrivalWindow: 'Today, 6:00 PM - 7:00 PM',
      paymentMethod
    });

    if (requestError) {
      setError(requestError.message || t.unableCreateRequest);
      return;
    }

    setRequest(data);
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t.customerService}</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{t.bookWaterService}</h1>
      </div>

      {submitted ? (
        <div className="max-w-xl rounded-3xl border border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-600 p-2 text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.serviceRequestBooked}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">{t.requestSentAuthority}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-4 text-sm shadow-sm dark:bg-slate-900">
            <p><span className="font-semibold">{t.service}:</span> {selectedService.title}</p>
            <p><span className="font-semibold">{t.eta}:</span> {selectedService.eta}</p>
            <p><span className="font-semibold">{t.amount}:</span> ₹{request?.total_amount || selectedService.price + 49}</p>
            <p><span className="font-semibold">{t.payment}:</span> {request?.payment_status === 'pending' ? t.pendingConfirmation : paymentMethod}</p>
            <p><span className="font-semibold">{t.location}:</span> {request?.address || address}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card rounded-3xl border border-slate-200 p-6 dark:border-slate-800">
            <h2 className="text-xl font-bold">{t.chooseService}</h2>
            <div className="mt-5 space-y-4">
              {serviceOptions.map((service) => (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedService.id === service.id
                      ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/20'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{service.title}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">₹{service.price}</p>
                      <p className="text-xs text-slate-500">{service.eta}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl border border-slate-200 p-6 dark:border-slate-800">
            <h2 className="text-xl font-bold">{t.bookingDetails}</h2>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">{t.serviceAddress}</label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t.enterFullServiceLocation}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">{t.preferredArrivalWindow}</label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <Clock3 className="w-4 h-4 text-slate-500" />
                  <input type="text" defaultValue="Today, 6:00 PM - 7:00 PM" className="w-full bg-transparent text-sm outline-none" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">{t.paymentMethod}</label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  >
                    <option>UPI</option>
                    <option>Wallet</option>
                    <option>Credit Card</option>
                    <option>Cash on service</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-300">{t.serviceFee}</span>
                  <span className="font-semibold">₹{selectedService.price}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-300">{t.platformFee}</span>
                  <span className="font-semibold">₹49</span>
                </div>
                <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>{t.total}</span>
                    <span>₹{selectedService.price + 49}</span>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                {t.payConfirmBooking}
              </button>
              {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
