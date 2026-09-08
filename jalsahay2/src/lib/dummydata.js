export const dummyComplaints = [
  {
    id: "JAL-84920",
    full_name: "Aarav Sharma",
    phone: "9876543210",
    email: "aarav@example.com",
    category: "Pipeline Leakage",
    priority: "High",
    description: "Major main line pipe leak flooding the street front near Gate 3.",
    ward_number: 12,
    address: "102 Park Avenue, Ward 12",
    latitude: 18.5204,
    longitude: 73.8567,
    status: "In Progress",
    created_at: "2026-03-28T10:30:00Z",
    estimated_completion: "2026-03-31",
    assigned_engineer: "Rajesh Kumar (Senior Hydro Tech)"
  },
  {
    id: "JAL-10294",
    full_name: "Priya Patel",
    phone: "9823011223",
    email: "priya@example.com",
    category: "Dirty Water",
    priority: "Emergency",
    description: "Discolored and foul smelling tap water coming since morning.",
    ward_number: 5,
    address: "Block B, Flat 402, Sunshine Heights",
    latitude: 18.5314,
    longitude: 73.8447,
    status: "Submitted",
    created_at: "2026-03-29T08:15:00Z",
    estimated_completion: "2026-03-30",
    assigned_engineer: "Unassigned"
  },
  {
    id: "JAL-55102",
    full_name: "Rohan Verma",
    phone: "9911223344",
    email: "rohan@example.com",
    category: "Low Pressure",
    priority: "Low",
    description: "Very low pressure on 2nd floor during supply hours.",
    ward_number: 8,
    address: "House 45, Green Glen Layout",
    latitude: 18.5104,
    longitude: 73.8627,
    status: "Resolved",
    created_at: "2026-03-20T14:00:00Z",
    estimated_completion: "2026-03-22",
    assigned_engineer: "Anil Deshmukh"
  }
];

export const dummyAnalytics = {
  monthlyComplaints: [
    { month: "Jan", complaints: 240, resolved: 220 },
    { month: "Feb", complaints: 300, resolved: 280 },
    { month: "Mar", complaints: 420, resolved: 390 }
  ],
  categoryData: [
    { name: "Pipeline Leakage", value: 40 },
    { name: "No Water Supply", value: 25 },
    { name: "Dirty Water", value: 15 },
    { name: "Low Pressure", value: 12 },
    { name: "Others", value: 8 }
  ]
};

export const dummyBlogs = [
  {
    id: 1,
    title: "10 Proven Ways to Save Water at Home Daily",
    category: "Water Conservation",
    date: "March 25, 2026",
    summary: "Simple changes in daily routines can save up to 100 liters of water per household.",
    author: "JalSahay Eco Team"
  },
  {
    id: 2,
    title: "Municipal Smart Water Grid Project Update 2026",
    category: "Government Schemes",
    date: "March 18, 2026",
    summary: "New pressure sensors installed across 15 wards to detect micro-leakages automatically.",
    author: "Civic Infra Bureau"
  }
];