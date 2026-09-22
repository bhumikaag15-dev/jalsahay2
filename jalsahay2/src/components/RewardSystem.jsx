import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CheckCircle2,
  CircleDollarSign,
  Droplets,
  Gift,
  ShieldCheck,
  TrendingUp,
  Wrench
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getRewardSummary } from '../lib/marketplaceApi';

const rewardBenefits = [
  {
    threshold: 500,
    titleKey: 'basicInspectionCredit',
    benefitKey: 'freeLeakInspection',
    valueKey: 'complimentaryVisit',
    active: true
  },
  {
    threshold: 1500,
    titleKey: 'priorityServiceSupport',
    benefitKey: 'priorityScheduling',
    valueKey: 'fastTrackService',
    active: false
  },
  {
    threshold: 3000,
    titleKey: 'quarterlyWaterCheck',
    benefitKey: 'freeWaterQuality',
    valueKey: 'freeUtilityCheck',
    active: false
  },
  {
    threshold: 5000,
    titleKey: 'annualCivicCredit',
    benefitKey: 'waivedServiceFee',
    valueKey: 'freeServiceBundle',
    active: false
  }
];

const earningRules = [
  { labelKey: 'submitVerifiedComplaint', value: '+120 pts', descriptionKey: 'requiredForReporting' },
  { labelKey: 'trackComplaintProgress', value: '+80 pts', descriptionKey: 'helpsTransparency' },
  { labelKey: 'successfulResolutionUpdate', value: '+150 pts', descriptionKey: 'rewardsFixConfirmation' },
  { labelKey: 'repeatedQualityReporting', value: '+200 pts', descriptionKey: 'sustainedCivicEngagement' }
];

export default function RewardSystem() {
  const [summary, setSummary] = useState({ points: 0, verifiedReports: 0, resolvedFollowUps: 0 });
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    let active = true;
    getRewardSummary(user?.id).then(({ data, error: summaryError }) => {
      if (!active) return;
      if (summaryError) setError(summaryError.message || 'Unable to load your reward balance.');
      if (data) setSummary(data);
    });
    return () => { active = false; };
  }, [user?.id]);

  const points = summary.points;

  const nextBenefit = useMemo(() => {
    return rewardBenefits.find((item) => item.threshold > points) || rewardBenefits[rewardBenefits.length - 1];
  }, [points]);

  const progressToNextBenefit = useMemo(() => {
    const currentIndex = rewardBenefits.findIndex((item) => item.threshold > points);
    if (currentIndex === -1) return 100;

    const previousThreshold = currentIndex === 0 ? 0 : rewardBenefits[currentIndex - 1].threshold;
    const target = rewardBenefits[currentIndex].threshold;
    const progress = ((points - previousThreshold) / (target - previousThreshold)) * 100;

    return Math.min(Math.max(progress, 0), 100);
  }, [points]);

  const earnedBenefits = rewardBenefits.filter((item) => points >= item.threshold);

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Award className="w-3.5 h-3.5" />
            {t.civicRewards}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
            {t.rewardingVerifiedParticipation}
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            {t.rewardDescription}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{t.currentBalance}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-2 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{points}</p>
              <p className="text-xs text-slate-500">{t.civicPoints}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard icon={<Droplets className="w-5 h-5" />} label={t.verifiedReports} value={summary.verifiedReports} tone="blue" />
        <MetricCard icon={<ShieldCheck className="w-5 h-5" />} label={t.resolvedFollowUps} value={summary.resolvedFollowUps} tone="green" />
        <MetricCard icon={<TrendingUp className="w-5 h-5" />} label={t.nextBenefit} value={`${nextBenefit.threshold - points} pts`} tone="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
        <div className="glass-card rounded-3xl border border-slate-200 p-6 dark:border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{t.currentStatus}</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{earnedBenefits.length > 0 ? t.benefitTierActive : t.progressTowardBenefit}</h2>
            </div>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
              {earnedBenefits.length > 0 ? t.eligible : t.inProgressLabel}
            </span>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>{t.progressTo} {t[nextBenefit.titleKey]}</span>
              <span>{Math.round(progressToNextBenefit)}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${progressToNextBenefit}%` }} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-blue-600 p-2 text-white">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.nextUnlockedBenefit}</p>
                <p className="mt-1 text-lg font-bold text-blue-700 dark:text-blue-200">{t[nextBenefit.titleKey]}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t[nextBenefit.benefitKey]}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl border border-slate-200 p-6 dark:border-slate-800">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{t.pointEarning}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{t.howPointsEarned}</h2>

          <div className="mt-5 space-y-4">
            {earningRules.map((rule) => (
              <div key={rule.labelKey} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900 dark:text-white">{t[rule.labelKey]}</p>
                  <span className="text-sm font-bold text-emerald-600">{rule.value}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t[rule.descriptionKey]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

      <div className="glass-card rounded-3xl border border-slate-200 p-6 dark:border-slate-800">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{t.benefits}</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{t.citizenServiceRewards}</h2>
          </div>
          <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200 md:inline-flex">
            {t.verifiedParticipationOnly}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {rewardBenefits.map((item) => {
            const isUnlocked = points >= item.threshold;

            return (
              <div
                key={item.threshold}
                className={`rounded-2xl border p-5 ${
                  isUnlocked
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="rounded-xl bg-slate-900 p-2 text-white dark:bg-slate-700">
                    {isUnlocked ? <CheckCircle2 className="w-4 h-4" /> : <CircleDollarSign className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.threshold} pts</span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{t[item.titleKey]}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t[item.benefitKey]}</p>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{t[item.valueKey]}</span>
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
                      {t.activeStatus} <ArrowRight className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="font-medium text-slate-500">{t.lockedStatus}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{t.programPolicy}</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{t.eligibilityText}</h3>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">
            <Wrench className="w-4 h-4 text-blue-600" />
            {t.serviceSupportText}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, tone }) {
  const tones = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200'
  };

  return (
    <div className="glass-card rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
      <div className={`mb-4 inline-flex rounded-2xl p-2 ${tones[tone]}`}>{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
