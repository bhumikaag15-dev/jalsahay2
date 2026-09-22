import React, { useEffect, useState } from 'react';
import { CreditCard, ReceiptText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCustomerPayments } from '../lib/marketplaceApi';
import { useLanguage } from '../context/LanguageContext';

export default function Payments() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getCustomerPayments(user.id).then(({ data, error: paymentError }) => {
      if (!active) return;
      if (paymentError) setError(paymentError.message || 'Unable to load payment history.');
      setPayments(data || []);
    });
    return () => { active = false; };
  }, [user.id]);

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t.customerWallet}</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{t.paymentsAndReceipts}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.everyBooking}</p>
      </div>

      <div className="glass-card rounded-3xl border border-slate-200 p-6 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"><CreditCard className="w-5 h-5" /></div>
          <div>
            <p className="text-sm text-slate-500">{t.recordedPayments}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{payments.length}</p>
          </div>
        </div>

        {error && <p className="mt-5 text-sm font-medium text-rose-600">{error}</p>}
        {payments.length === 0 && !error && <p className="mt-6 text-sm text-slate-500">{t.noPaymentRecords}</p>}

        <div className="mt-6 space-y-3">
          {payments.map((payment) => (
            <div key={payment.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <ReceiptText className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">₹{payment.amount}</p>
                  <p className="text-xs text-slate-500">{payment.method} · {new Date(payment.created_at).toLocaleString()}</p>
                </div>
              </div>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-700 dark:text-slate-200">{payment.status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
