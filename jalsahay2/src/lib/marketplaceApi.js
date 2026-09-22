import { supabase, supabaseConfigError } from './supabaseClient';

export const serviceOptions = [
  {
    id: 'leak-repair',
    title: 'Leak Repair',
    description: 'Urgent pipeline or household leak intervention',
    eta: '25-40 mins',
    price: 499
  },
  {
    id: 'pressure-fix',
    title: 'Pressure Restoration',
    description: 'Water pressure checks and improvement service',
    eta: '30-45 mins',
    price: 399
  },
  {
    id: 'water-quality',
    title: 'Water Quality Check',
    description: 'Testing for contamination, quality, and filtration issue',
    eta: '45-60 mins',
    price: 599
  }
];

const localRequestsKey = 'jalsahay-service-requests';

const readLocalRequests = () => {
  try {
    return JSON.parse(localStorage.getItem(localRequestsKey) || '[]');
  } catch {
    return [];
  }
};

const writeLocalRequests = (requests) => {
  localStorage.setItem(localRequestsKey, JSON.stringify(requests));
};

export async function createServiceRequest({ userId, service, address, arrivalWindow, paymentMethod }) {
  const totalAmount = service.price + 49;
  const request = {
    customer_id: userId,
    service_type: service.id,
    service_title: service.title,
    address,
    arrival_window: arrivalWindow,
    service_amount: service.price,
    platform_fee: 49,
    total_amount: totalAmount,
    payment_method: paymentMethod,
    payment_status: paymentMethod === 'Cash on service' ? 'cash_pending' : 'pending',
    status: 'requested'
  };

  if (supabaseConfigError) {
    const localRequest = {
      ...request,
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    writeLocalRequests([localRequest, ...readLocalRequests()]);
    return { data: localRequest, error: null, isLocal: true };
  }

  const { data, error } = await supabase
    .from('service_requests')
    .insert(request)
    .select()
    .single();

  if (!error && data) {
    const { error: paymentError } = await supabase
      .from('payment_transactions')
      .insert({
        service_request_id: data.id,
        customer_id: userId,
        amount: totalAmount,
        method: paymentMethod,
        status: request.payment_status
      });

    if (paymentError) return { data: null, error: paymentError, isLocal: false };
  }

  return { data, error, isLocal: false };
}

export async function getCustomerRequests(userId) {
  if (supabaseConfigError) {
    return { data: readLocalRequests().filter((request) => request.customer_id === userId), error: null, isLocal: true };
  }

  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('customer_id', userId)
    .order('created_at', { ascending: false });

  return { data: data || [], error, isLocal: false };
}

export async function getCustomerPayments(userId) {
  if (supabaseConfigError) {
    return { data: [], error: null, isLocal: true };
  }

  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('customer_id', userId)
    .order('created_at', { ascending: false });

  return { data: data || [], error, isLocal: false };
}

export async function getAuthorityRequests() {
  if (supabaseConfigError) {
    return { data: readLocalRequests(), error: null, isLocal: true };
  }

  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .in('status', ['requested', 'accepted', 'in_progress'])
    .order('created_at', { ascending: false });

  return { data: data || [], error, isLocal: false };
}

export async function updateServiceRequestStatus(requestId, status, authorityId) {
  if (supabaseConfigError) {
    const requests = readLocalRequests().map((request) => (
      request.id === requestId ? { ...request, status, authority_id: authorityId } : request
    ));
    writeLocalRequests(requests);
    return { data: requests.find((request) => request.id === requestId), error: null, isLocal: true };
  }

  const { data, error } = await supabase
    .from('service_requests')
    .update({ status, authority_id: authorityId })
    .eq('id', requestId)
    .select()
    .single();

  return { data, error, isLocal: false };
}

export async function getRewardSummary(userId) {
  if (!userId) {
    return { data: { points: 0, verifiedReports: 0, resolvedFollowUps: 0, isLocal: true }, error: null };
  }

  if (supabaseConfigError) {
    return { data: { points: 0, verifiedReports: 0, resolvedFollowUps: 0, isLocal: true }, error: null };
  }

  const [{ data: ledger, error: ledgerError }, { count: reportCount, error: reportError }, { count: resolvedCount, error: resolvedError }] = await Promise.all([
    supabase.from('reward_ledger').select('points').eq('user_id', userId),
    supabase.from('complaints').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('complaints').select('id', { count: 'exact', head: true }).eq('user_id', userId).in('status', ['Resolved', 'Closed'])
  ]);

  const error = ledgerError || reportError || resolvedError;
  const points = (ledger || []).reduce((total, entry) => total + entry.points, 0);

  return {
    data: { points, verifiedReports: reportCount || 0, resolvedFollowUps: resolvedCount || 0, isLocal: false },
    error
  };
}
