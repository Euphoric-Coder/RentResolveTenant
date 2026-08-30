export const MOCK_USER = {
  id: 'tenant_001',
  name: 'Aarav Sharma',
  email: 'tenant@example.com',
  phone: '+91 98765 43210',
  propertyId: 'property_001',
  unit: 'Flat 3B',
  role: 'tenant' as const,
  emergencyContact: '+91 91234 56789',
  identityVerified: true,
  joinedDate: '2026-01-01',
};

export const MOCK_PROPERTY = {
  id: 'property_001',
  name: 'Green Residency',
  address: 'Bhelupur, Varanasi, Uttar Pradesh',
  fullAddress: '42, Green Residency, Bhelupur Road, Varanasi, UP - 221010',
  unit: 'Flat 3B',
  landlordName: 'Rohit Mehra',
  landlordPhone: '+91 98123 45678',
  propertyManagerName: 'Priya Kapoor',
  propertyManagerPhone: '+91 97654 32100',
  propertyManagerEmail: 'priya@greenresidency.in',
  monthlyRent: 18000,
  securityDeposit: 36000,
  leaseStart: '2026-01-01',
  leaseEnd: '2026-12-31',
  emergencyContact: '+91 112',
  utilityResponsibility: {
    electricity: 'Tenant',
    water: 'Landlord',
    gas: 'Tenant',
    internet: 'Tenant',
    maintenance: 'Landlord',
  },
};

export const CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Appliance',
  'Heating/Cooling',
  'Pest Control',
  'Door/Window',
  'Cleaning',
  'Structural Damage',
  'Internet/Connectivity',
  'Other',
];

export const SUBCATEGORIES: Record<string, string[]> = {
  Plumbing: ['Leaking Tap', 'Blocked Drain', 'Water Pressure', 'Toilet Issue', 'Pipe Burst'],
  Electrical: ['Socket Not Working', 'Light Fixture', 'Wiring Issue', 'Power Outage', 'MCB Tripping'],
  Appliance: ['Washing Machine', 'Refrigerator', 'AC', 'Geyser', 'Microwave'],
  'Heating/Cooling': ['AC Not Cooling', 'Heater Issue', 'Fan Not Working', 'Thermostat'],
  'Pest Control': ['Cockroaches', 'Termites', 'Rats', 'Mosquitoes', 'Ants'],
  'Door/Window': ['Lock Issue', 'Broken Handle', 'Glass Crack', 'Hinge Problem', 'Seal Damaged'],
  Cleaning: ['Deep Cleaning', 'Drain Cleaning', 'Tank Cleaning', 'Common Area'],
  'Structural Damage': ['Wall Crack', 'Ceiling Leak', 'Floor Damage', 'Paint Peeling'],
  'Internet/Connectivity': ['Slow Speed', 'No Connection', 'Router Issue', 'Cable Damage'],
  Other: ['General', 'Safety Concern', 'Noise Complaint', 'Other'],
};

export const PRIORITY_LEVELS = ['Low', 'Medium', 'High', 'Emergency'] as const;

export const REQUEST_STATUSES = [
  'Submitted',
  'Under Review',
  'Approved',
  'Assigned',
  'In Progress',
  'Waiting for Tenant',
  'Waiting for Landlord',
  'Resolved',
  'Reopened',
  'Escalated',
  'Closed',
  'Rejected',
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];
export type Priority = (typeof PRIORITY_LEVELS)[number];

export interface MaintenanceRequest {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  priority: Priority;
  status: RequestStatus;
  propertyArea: string;
  submittedDate: string;
  lastUpdated: string;
  expectedResolution: string;
  assignedTo: string | null;
  technicianName: string | null;
  technicianPhone: string | null;
  isEmergency: boolean;
  permissionToEnter: boolean;
  preferredDate: string;
  preferredTime: string;
  resolutionNotes: string | null;
  evidence: string[];
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  event: string;
  date: string;
  description: string;
  actor: string;
}

export const MOCK_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'REQ-001',
    title: 'Kitchen sink leaking badly',
    category: 'Plumbing',
    subcategory: 'Leaking Tap',
    description: 'The kitchen sink faucet has been leaking continuously for the past 2 days. Water is collecting under the cabinet and causing damage to the wood.',
    priority: 'High',
    status: 'In Progress',
    propertyArea: 'Kitchen',
    submittedDate: '2026-06-18',
    lastUpdated: '2026-06-22',
    expectedResolution: '2026-06-25',
    assignedTo: 'Priya Kapoor',
    technicianName: 'Rajesh Kumar',
    technicianPhone: '+91 98765 11111',
    isEmergency: false,
    permissionToEnter: true,
    preferredDate: '2026-06-23',
    preferredTime: '10:00 AM - 12:00 PM',
    resolutionNotes: null,
    evidence: ['kitchen_leak_1.jpg', 'kitchen_leak_2.jpg'],
    timeline: [
      { id: 't1', event: 'Request Submitted', date: '2026-06-18 09:30', description: 'Tenant submitted maintenance request', actor: 'Aarav Sharma' },
      { id: 't2', event: 'Landlord Reviewed', date: '2026-06-18 14:00', description: 'Request reviewed and approved', actor: 'Priya Kapoor' },
      { id: 't3', event: 'Technician Assigned', date: '2026-06-19 10:00', description: 'Rajesh Kumar assigned to fix the issue', actor: 'Priya Kapoor' },
      { id: 't4', event: 'Visit Scheduled', date: '2026-06-20 11:00', description: 'Visit scheduled for June 23', actor: 'System' },
      { id: 't5', event: 'Work Started', date: '2026-06-22 10:30', description: 'Technician started repair work', actor: 'Rajesh Kumar' },
    ],
  },
  {
    id: 'REQ-002',
    title: 'AC not cooling in bedroom',
    category: 'Heating/Cooling',
    subcategory: 'AC Not Cooling',
    description: 'The bedroom AC is running but not cooling at all. The temperature remains high even after running for hours.',
    priority: 'Medium',
    status: 'Assigned',
    propertyArea: 'Bedroom',
    submittedDate: '2026-06-20',
    lastUpdated: '2026-06-21',
    expectedResolution: '2026-06-27',
    assignedTo: 'Priya Kapoor',
    technicianName: 'Sunil Verma',
    technicianPhone: '+91 98765 22222',
    isEmergency: false,
    permissionToEnter: false,
    preferredDate: '2026-06-25',
    preferredTime: '2:00 PM - 4:00 PM',
    resolutionNotes: null,
    evidence: [],
    timeline: [
      { id: 't1', event: 'Request Submitted', date: '2026-06-20 16:00', description: 'Tenant submitted maintenance request', actor: 'Aarav Sharma' },
      { id: 't2', event: 'Landlord Reviewed', date: '2026-06-21 09:30', description: 'Request reviewed and assigned', actor: 'Priya Kapoor' },
      { id: 't3', event: 'Technician Assigned', date: '2026-06-21 10:00', description: 'Sunil Verma assigned for AC repair', actor: 'Priya Kapoor' },
    ],
  },
  {
    id: 'REQ-003',
    title: 'Bathroom door lock jammed',
    category: 'Door/Window',
    subcategory: 'Lock Issue',
    description: 'The bathroom door lock is jammed and cannot be locked from inside. This is a privacy and safety concern.',
    priority: 'High',
    status: 'Resolved',
    propertyArea: 'Bathroom',
    submittedDate: '2026-06-10',
    lastUpdated: '2026-06-15',
    expectedResolution: '2026-06-14',
    assignedTo: 'Priya Kapoor',
    technicianName: 'Amit Yadav',
    technicianPhone: '+91 98765 33333',
    isEmergency: false,
    permissionToEnter: true,
    preferredDate: '2026-06-12',
    preferredTime: '9:00 AM - 11:00 AM',
    resolutionNotes: 'Lock mechanism replaced with a new one. Door tested and working properly.',
    evidence: ['door_lock_1.jpg'],
    timeline: [
      { id: 't1', event: 'Request Submitted', date: '2026-06-10 08:00', description: 'Tenant submitted request', actor: 'Aarav Sharma' },
      { id: 't2', event: 'Landlord Reviewed', date: '2026-06-10 12:00', description: 'Approved for immediate repair', actor: 'Priya Kapoor' },
      { id: 't3', event: 'Technician Assigned', date: '2026-06-11 09:00', description: 'Amit Yadav assigned', actor: 'Priya Kapoor' },
      { id: 't4', event: 'Work Completed', date: '2026-06-13 14:00', description: 'Lock replaced successfully', actor: 'Amit Yadav' },
      { id: 't5', event: 'Request Resolved', date: '2026-06-15 10:00', description: 'Tenant confirmed fix', actor: 'System' },
    ],
  },
  {
    id: 'REQ-004',
    title: 'Cockroach infestation in kitchen',
    category: 'Pest Control',
    subcategory: 'Cockroaches',
    description: 'Severe cockroach infestation in kitchen cabinets. Found multiple cockroaches near food storage area.',
    priority: 'Emergency',
    status: 'Submitted',
    propertyArea: 'Kitchen',
    submittedDate: '2026-06-25',
    lastUpdated: '2026-06-25',
    expectedResolution: '2026-06-27',
    assignedTo: null,
    technicianName: null,
    technicianPhone: null,
    isEmergency: true,
    permissionToEnter: true,
    preferredDate: '2026-06-26',
    preferredTime: '9:00 AM - 11:00 AM',
    resolutionNotes: null,
    evidence: ['pest_1.jpg', 'pest_2.jpg', 'pest_3.jpg'],
    timeline: [
      { id: 't1', event: 'Request Submitted', date: '2026-06-25 07:30', description: 'Emergency request submitted', actor: 'Aarav Sharma' },
    ],
  },
  {
    id: 'REQ-005',
    title: 'Power socket sparking in living room',
    category: 'Electrical',
    subcategory: 'Socket Not Working',
    description: 'The main power socket in the living room is sparking when plugging in devices. Very dangerous.',
    priority: 'Emergency',
    status: 'Under Review',
    propertyArea: 'Living Room',
    submittedDate: '2026-06-24',
    lastUpdated: '2026-06-24',
    expectedResolution: '2026-06-26',
    assignedTo: null,
    technicianName: null,
    technicianPhone: null,
    isEmergency: true,
    permissionToEnter: true,
    preferredDate: '2026-06-25',
    preferredTime: 'ASAP',
    resolutionNotes: null,
    evidence: ['socket_spark.jpg'],
    timeline: [
      { id: 't1', event: 'Request Submitted', date: '2026-06-24 19:00', description: 'Emergency request submitted', actor: 'Aarav Sharma' },
      { id: 't2', event: 'Landlord Reviewed', date: '2026-06-24 19:30', description: 'Under urgent review', actor: 'Priya Kapoor' },
    ],
  },
  {
    id: 'REQ-006',
    title: 'Wall paint peeling in bedroom',
    category: 'Structural Damage',
    subcategory: 'Paint Peeling',
    description: 'The paint on the bedroom wall near the window is peeling off due to moisture seepage.',
    priority: 'Low',
    status: 'Closed',
    propertyArea: 'Bedroom',
    submittedDate: '2026-05-15',
    lastUpdated: '2026-06-01',
    expectedResolution: '2026-05-30',
    assignedTo: 'Priya Kapoor',
    technicianName: 'Manoj Tiwari',
    technicianPhone: '+91 98765 44444',
    isEmergency: false,
    permissionToEnter: true,
    preferredDate: '2026-05-20',
    preferredTime: '10:00 AM - 12:00 PM',
    resolutionNotes: 'Wall repaired, moisture treated, and repainted. Waterproofing applied.',
    evidence: ['paint_peel_1.jpg'],
    timeline: [
      { id: 't1', event: 'Request Submitted', date: '2026-05-15 10:00', description: 'Request submitted', actor: 'Aarav Sharma' },
      { id: 't2', event: 'Technician Assigned', date: '2026-05-17 09:00', description: 'Painter assigned', actor: 'Priya Kapoor' },
      { id: 't3', event: 'Work Completed', date: '2026-05-25 16:00', description: 'Painting and waterproofing done', actor: 'Manoj Tiwari' },
      { id: 't4', event: 'Feedback Submitted', date: '2026-05-28 11:00', description: 'Tenant submitted positive feedback', actor: 'Aarav Sharma' },
      { id: 't5', event: 'Request Closed', date: '2026-06-01 09:00', description: 'Request closed after feedback', actor: 'System' },
    ],
  },
];

export interface Attachment {
  id: string;
  type: 'image' | 'document';
  name: string;
  url: string | null;
}

export interface Message {
  id: string;
  conversationId?: string;
  senderId: string;
  senderRole?: string;
  senderName: string;
  text: string;
  timestamp: string;
  createdAt?: string;
  isRead: boolean;
  status?: 'sent' | 'delivered' | 'read';
  attachments?: Attachment[];
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string | null;
  responseTime: string;
  propertyId: string;
}

export const mockContacts: Contact[] = [
  {
    id: 'landlord_001',
    name: 'Rohit Mehra',
    role: 'Landlord',
    email: 'rohit.mehra@example.com',
    phone: '+91 98765 10001',
    avatar: null,
    responseTime: 'Usually replies within 2 hours',
    propertyId: 'prop_001',
  },
  {
    id: 'manager_001',
    name: 'Priya Kapoor',
    role: 'Property Manager',
    email: 'priya.kapoor@example.com',
    phone: '+91 98765 10002',
    avatar: null,
    responseTime: 'Usually replies within 30 minutes',
    propertyId: 'prop_001',
  },
];

export interface Conversation {
  id: string;
  propertyId?: string;
  participantId?: string;
  participantName: string;
  participantRole: string;
  linkedRequestId: string | null;
  linkedRequestTitle: string | null;
  conversationType?: 'general' | 'issue_linked';
  lastMessage: string;
  lastMessageTime: string;
  lastMessageAt?: string;
  unreadCount: number;
  status?: string;
  messages: Message[];
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_001',
    participantName: 'Priya Kapoor',
    participantRole: 'Property Manager',
    linkedRequestId: 'REQ-001',
    linkedRequestTitle: 'Kitchen sink leaking badly',
    lastMessage: 'The technician will visit tomorrow morning between 10-12.',
    lastMessageTime: '2026-06-22 15:30',
    unreadCount: 1,
    messages: [
      { id: 'm1', senderId: 'tenant_001', senderName: 'You', text: 'Hi, the kitchen sink is leaking very badly. Can you please send someone urgently?', timestamp: '2026-06-18 09:30', isRead: true },
      { id: 'm2', senderId: 'manager_001', senderName: 'Priya Kapoor', text: 'Thank you for reporting. I have noted this and will assign a plumber today.', timestamp: '2026-06-18 14:05', isRead: true },
      { id: 'm3', senderId: 'tenant_001', senderName: 'You', text: 'Thank you. When can I expect the visit?', timestamp: '2026-06-19 08:00', isRead: true },
      { id: 'm4', senderId: 'manager_001', senderName: 'Priya Kapoor', text: 'Rajesh Kumar has been assigned. He will come on June 23rd.', timestamp: '2026-06-19 10:15', isRead: true },
      { id: 'm5', senderId: 'manager_001', senderName: 'Priya Kapoor', text: 'The technician will visit tomorrow morning between 10-12.', timestamp: '2026-06-22 15:30', isRead: false },
    ],
  },
  {
    id: 'conv_002',
    participantName: 'Rohit Mehra',
    participantRole: 'Landlord',
    linkedRequestId: null,
    linkedRequestTitle: null,
    lastMessage: 'Sure, I will have the rent receipt sent to you by email.',
    lastMessageTime: '2026-06-20 11:00',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'tenant_001', senderName: 'You', text: 'Good morning sir, could you please share the rent receipt for May?', timestamp: '2026-06-20 09:00', isRead: true },
      { id: 'm2', senderId: 'landlord_001', senderName: 'Rohit Mehra', text: 'Sure, I will have the rent receipt sent to you by email.', timestamp: '2026-06-20 11:00', isRead: true },
    ],
  },
  {
    id: 'conv_003',
    participantName: 'Priya Kapoor',
    participantRole: 'Property Manager',
    linkedRequestId: 'REQ-005',
    linkedRequestTitle: 'Power socket sparking in living room',
    lastMessage: 'This is urgent. Please do not use that socket. I am arranging an electrician immediately.',
    lastMessageTime: '2026-06-24 19:35',
    unreadCount: 1,
    messages: [
      { id: 'm1', senderId: 'tenant_001', senderName: 'You', text: 'The power socket in the living room is sparking! This is very dangerous.', timestamp: '2026-06-24 19:00', isRead: true },
      { id: 'm2', senderId: 'manager_001', senderName: 'Priya Kapoor', text: 'This is urgent. Please do not use that socket. I am arranging an electrician immediately.', timestamp: '2026-06-24 19:35', isRead: false },
    ],
  },
];

export const mockMessagingConversations: Conversation[] = [
  {
    id: 'conv_001',
    propertyId: 'prop_001',
    participantId: 'manager_001',
    participantName: 'Priya Kapoor',
    participantRole: 'Property Manager',
    linkedRequestId: 'REQ-1024',
    linkedRequestTitle: 'Bathroom water leakage',
    conversationType: 'issue_linked',
    lastMessage: 'The technician will visit tomorrow between 10 AM and 12 PM.',
    lastMessageTime: '2026-08-28 10:30',
    lastMessageAt: '2026-08-28T10:30:00',
    unreadCount: 2,
    status: 'active',
    messages: [
      { id: 'msg_001', conversationId: 'conv_001', senderId: 'tenant_001', senderRole: 'tenant', senderName: 'You', text: 'Hello, the bathroom leakage has become worse since morning.', timestamp: '2026-08-28 09:10', createdAt: '2026-08-28T09:10:00', isRead: true, status: 'read', attachments: [] },
      { id: 'msg_002', conversationId: 'conv_001', senderId: 'manager_001', senderRole: 'property_manager', senderName: 'Priya Kapoor', text: 'Thank you for informing us. Can you please share one more photo of the affected area?', timestamp: '2026-08-28 09:18', createdAt: '2026-08-28T09:18:00', isRead: true, attachments: [] },
      { id: 'msg_003', conversationId: 'conv_001', senderId: 'tenant_001', senderRole: 'tenant', senderName: 'You', text: 'Sure, I have attached the latest photo here.', timestamp: '2026-08-28 09:25', createdAt: '2026-08-28T09:25:00', isRead: true, status: 'read', attachments: [{ id: 'att_001', type: 'image', name: 'leakage-photo.jpg', url: null }] },
      { id: 'msg_004', conversationId: 'conv_001', senderId: 'manager_001', senderRole: 'property_manager', senderName: 'Priya Kapoor', text: 'The technician will visit tomorrow between 10 AM and 12 PM.', timestamp: '2026-08-28 10:30', createdAt: '2026-08-28T10:30:00', isRead: false, status: 'delivered', attachments: [] },
    ],
  },
  {
    id: 'conv_002',
    propertyId: 'prop_001',
    participantId: 'landlord_001',
    participantName: 'Rohit Mehra',
    participantRole: 'Landlord',
    linkedRequestId: null,
    linkedRequestTitle: null,
    conversationType: 'general',
    lastMessage: 'Please share the rent receipt once the payment is completed.',
    lastMessageTime: '2026-08-27 18:15',
    lastMessageAt: '2026-08-27T18:15:00',
    unreadCount: 0,
    status: 'active',
    messages: [
      { id: 'msg_005', conversationId: 'conv_002', senderId: 'tenant_001', senderRole: 'tenant', senderName: 'You', text: 'Good morning sir, I have completed the rent payment for this month.', timestamp: '2026-08-27 17:50', createdAt: '2026-08-27T17:50:00', isRead: true, status: 'read', attachments: [] },
      { id: 'msg_006', conversationId: 'conv_002', senderId: 'landlord_001', senderRole: 'landlord', senderName: 'Rohit Mehra', text: 'Please share the rent receipt once the payment is completed.', timestamp: '2026-08-27 18:15', createdAt: '2026-08-27T18:15:00', isRead: true, attachments: [] },
    ],
  },
  {
    id: 'conv_003',
    propertyId: 'prop_001',
    participantId: 'manager_001',
    participantName: 'Priya Kapoor',
    participantRole: 'Property Manager',
    linkedRequestId: 'REQ-1019',
    linkedRequestTitle: 'Bedroom fan not working',
    conversationType: 'issue_linked',
    lastMessage: 'This issue has been marked as resolved. Please confirm from your side.',
    lastMessageTime: '2026-08-26 14:40',
    lastMessageAt: '2026-08-26T14:40:00',
    unreadCount: 0,
    status: 'active',
    messages: [
      { id: 'msg_007', conversationId: 'conv_003', senderId: 'tenant_001', senderRole: 'tenant', senderName: 'You', text: 'The bedroom fan has stopped working completely.', timestamp: '2026-08-26 10:00', createdAt: '2026-08-26T10:00:00', isRead: true, status: 'read', attachments: [] },
      { id: 'msg_008', conversationId: 'conv_003', senderId: 'manager_001', senderRole: 'property_manager', senderName: 'Priya Kapoor', text: 'I have arranged an electrician to check the fan.', timestamp: '2026-08-26 11:20', createdAt: '2026-08-26T11:20:00', isRead: true, attachments: [] },
      { id: 'msg_009', conversationId: 'conv_003', senderId: 'manager_001', senderRole: 'property_manager', senderName: 'Priya Kapoor', text: 'This issue has been marked as resolved. Please confirm from your side.', timestamp: '2026-08-26 14:40', createdAt: '2026-08-26T14:40:00', isRead: true, attachments: [] },
    ],
  },
];

export const mockLinkableRequests = [
  { id: 'REQ-1024', title: 'Bathroom water leakage', status: 'In Progress' },
  { id: 'REQ-1019', title: 'Bedroom fan not working', status: 'Resolved' },
  { id: 'REQ-1015', title: 'Kitchen sink blockage', status: 'Submitted' },
];

export interface RentPayment {
  id: string;
  month: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Late' | 'Overdue';
  dueDate: string;
  paidDate: string | null;
  hasReceipt: boolean;
}

export const MOCK_RENT_PAYMENTS: RentPayment[] = [
  { id: 'rent_001', month: 'January 2026', amount: 18000, status: 'Paid', dueDate: '2026-01-05', paidDate: '2026-01-03', hasReceipt: true },
  { id: 'rent_002', month: 'February 2026', amount: 18000, status: 'Paid', dueDate: '2026-02-05', paidDate: '2026-02-04', hasReceipt: true },
  { id: 'rent_003', month: 'March 2026', amount: 18000, status: 'Paid', dueDate: '2026-03-05', paidDate: '2026-03-05', hasReceipt: true },
  { id: 'rent_004', month: 'April 2026', amount: 18000, status: 'Paid', dueDate: '2026-04-05', paidDate: '2026-04-03', hasReceipt: true },
  { id: 'rent_005', month: 'May 2026', amount: 18000, status: 'Paid', dueDate: '2026-05-05', paidDate: '2026-05-06', hasReceipt: true },
  { id: 'rent_006', month: 'June 2026', amount: 18000, status: 'Paid', dueDate: '2026-06-05', paidDate: '2026-06-04', hasReceipt: false },
  { id: 'rent_007', month: 'July 2026', amount: 18000, status: 'Pending', dueDate: '2026-07-05', paidDate: null, hasReceipt: false },
];

export interface LeaseDocument {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  status: 'Available' | 'Pending' | 'Expired';
}

export const MOCK_DOCUMENTS: LeaseDocument[] = [
  { id: 'doc_001', name: 'Rent Agreement 2026', type: 'Agreement', uploadedDate: '2026-01-01', status: 'Available' },
  { id: 'doc_002', name: 'Move-in Inspection Report', type: 'Inspection', uploadedDate: '2026-01-02', status: 'Available' },
  { id: 'doc_003', name: 'House Rules & Regulations', type: 'Rules', uploadedDate: '2026-01-01', status: 'Available' },
  { id: 'doc_004', name: 'May 2026 Rent Receipt', type: 'Receipt', uploadedDate: '2026-05-10', status: 'Available' },
  { id: 'doc_005', name: 'Maintenance Records Q1', type: 'Maintenance', uploadedDate: '2026-04-01', status: 'Available' },
  { id: 'doc_006', name: 'ID Verification - Aadhaar', type: 'Identity', uploadedDate: '2026-01-01', status: 'Available' },
  { id: 'doc_007', name: 'Lease Renewal Notice', type: 'Notice', uploadedDate: '2026-06-15', status: 'Pending' },
];

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  linkedRequestId: string | null;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'not_001', title: 'Emergency Request Submitted', message: 'Your emergency request REQ-004 has been submitted successfully.', type: 'warning', timestamp: '2026-06-25 07:30', isRead: false, linkedRequestId: 'REQ-004' },
  { id: 'not_002', title: 'Technician Assigned', message: 'Rajesh Kumar has been assigned to fix your kitchen sink issue.', type: 'info', timestamp: '2026-06-22 10:00', isRead: false, linkedRequestId: 'REQ-001' },
  { id: 'not_003', title: 'Socket Issue Under Review', message: 'Your emergency report about the sparking socket is being reviewed.', type: 'warning', timestamp: '2026-06-24 19:30', isRead: true, linkedRequestId: 'REQ-005' },
  { id: 'not_004', title: 'Visit Scheduled', message: 'AC technician visit scheduled for June 25 between 2-4 PM.', type: 'info', timestamp: '2026-06-21 10:30', isRead: true, linkedRequestId: 'REQ-002' },
  { id: 'not_005', title: 'Request Resolved', message: 'Your bathroom door lock issue has been resolved.', type: 'success', timestamp: '2026-06-15 10:00', isRead: true, linkedRequestId: 'REQ-003' },
  { id: 'not_006', title: 'Feedback Requested', message: 'Please submit feedback for the resolved door lock repair.', type: 'info', timestamp: '2026-06-15 10:05', isRead: true, linkedRequestId: 'REQ-003' },
  { id: 'not_007', title: 'Rent Due Reminder', message: 'Your July rent of Rs. 18,000 is due on July 5th.', type: 'warning', timestamp: '2026-06-25 08:00', isRead: false, linkedRequestId: null },
  { id: 'not_008', title: 'Lease Renewal Notice', message: 'Your lease renewal document has been uploaded. Please review.', type: 'info', timestamp: '2026-06-15 12:00', isRead: true, linkedRequestId: null },
  { id: 'not_009', title: 'New Message from Property Manager', message: 'Priya Kapoor sent you a message about the bathroom leakage.', type: 'info', timestamp: '2026-08-28 10:30', isRead: false, linkedRequestId: 'REQ-1024' },
  { id: 'not_010', title: 'New Message from Landlord', message: 'Rohit Mehra replied to your rent receipt request.', type: 'info', timestamp: '2026-08-27 18:15', isRead: true, linkedRequestId: null },
  { id: 'not_011', title: 'Message Reply on Request', message: 'Priya Kapoor replied on the conversation linked to REQ-1019.', type: 'info', timestamp: '2026-08-26 14:40', isRead: true, linkedRequestId: 'REQ-1019' },
  { id: 'not_012', title: 'Landlord Read Your Message', message: 'Rohit Mehra has read your message about the rent receipt.', type: 'success', timestamp: '2026-08-27 18:20', isRead: true, linkedRequestId: null },
];

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  postedBy: string;
}

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'ann_001', title: 'Water Supply Interruption', message: 'Water supply will be interrupted on June 28 from 10 AM to 2 PM for tank cleaning. Please store water in advance.', date: '2026-06-25', priority: 'High', postedBy: 'Priya Kapoor' },
  { id: 'ann_002', title: 'Monthly Pest Control', message: 'Monthly pest control treatment scheduled for June 30 in all common areas. Individual flats on request.', date: '2026-06-24', priority: 'Medium', postedBy: 'Priya Kapoor' },
  { id: 'ann_003', title: 'Electricity Maintenance', message: 'Scheduled electricity maintenance on July 2 from 9 AM to 12 PM. Backup generator will be available.', date: '2026-06-23', priority: 'High', postedBy: 'Rohit Mehra' },
  { id: 'ann_004', title: 'Parking Rules Update', message: 'Please park only in designated spots. Vehicles in visitor parking after 10 PM will be towed.', date: '2026-06-20', priority: 'Medium', postedBy: 'Priya Kapoor' },
  { id: 'ann_005', title: 'Building Inspection Notice', message: 'Annual building inspection scheduled for July 10. Please ensure your flat is accessible.', date: '2026-06-18', priority: 'Low', postedBy: 'Rohit Mehra' },
  { id: 'ann_006', title: 'Rent Due Reminder', message: 'Friendly reminder that July rent is due by July 5, 2026. Late payments attract a 2% penalty.', date: '2026-06-25', priority: 'High', postedBy: 'Rohit Mehra' },
];

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  linkedRequestId: string | null;
}

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'act_001', type: 'request_created', title: 'Request Created', description: 'You raised a pest control emergency request (REQ-004)', timestamp: '2026-06-25 07:30', linkedRequestId: 'REQ-004' },
  { id: 'act_002', type: 'status_changed', title: 'Status Updated', description: 'REQ-005 moved to Under Review', timestamp: '2026-06-24 19:30', linkedRequestId: 'REQ-005' },
  { id: 'act_003', type: 'comment_added', title: 'New Message', description: 'Priya Kapoor replied about the kitchen sink issue', timestamp: '2026-06-22 15:30', linkedRequestId: 'REQ-001' },
  { id: 'act_004', type: 'technician_assigned', title: 'Technician Assigned', description: 'Sunil Verma assigned for AC repair (REQ-002)', timestamp: '2026-06-21 10:00', linkedRequestId: 'REQ-002' },
  { id: 'act_005', type: 'visit_scheduled', title: 'Visit Scheduled', description: 'AC technician visit confirmed for June 25', timestamp: '2026-06-21 10:30', linkedRequestId: 'REQ-002' },
  { id: 'act_006', type: 'rent_paid', title: 'Rent Paid', description: 'June 2026 rent of Rs. 18,000 paid successfully', timestamp: '2026-06-04 10:00', linkedRequestId: null },
  { id: 'act_007', type: 'request_resolved', title: 'Issue Resolved', description: 'Bathroom door lock issue resolved (REQ-003)', timestamp: '2026-06-15 10:00', linkedRequestId: 'REQ-003' },
  { id: 'act_008', type: 'feedback_submitted', title: 'Feedback Submitted', description: 'You submitted feedback for REQ-006 wall painting repair', timestamp: '2026-05-28 11:00', linkedRequestId: 'REQ-006' },
  { id: 'act_009', type: 'document_uploaded', title: 'Document Uploaded', description: 'Lease renewal notice uploaded by landlord', timestamp: '2026-06-15 12:00', linkedRequestId: null },
  { id: 'act_010', type: 'request_created', title: 'Request Created', description: 'You raised a sparking socket emergency request (REQ-005)', timestamp: '2026-06-24 19:00', linkedRequestId: 'REQ-005' },
];

export interface Dispute {
  id: string;
  title: string;
  category: string;
  description: string;
  linkedRequestId: string | null;
  status: 'Submitted' | 'Under Review' | 'Landlord Responded' | 'Awaiting Tenant Response' | 'Resolved' | 'Closed';
  submittedDate: string;
  expectedResolution: string;
}

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'DIS-001',
    title: 'Delayed repair for kitchen sink',
    category: 'Issue delayed beyond expected date',
    description: 'The kitchen sink repair was expected to be resolved by June 22 but is still in progress. This is causing major inconvenience.',
    linkedRequestId: 'REQ-001',
    status: 'Submitted',
    submittedDate: '2026-06-23',
    expectedResolution: '2026-06-28',
  },
];

export const DISPUTE_CATEGORIES = [
  'No response from landlord',
  'Issue delayed beyond expected date',
  'Emergency issue ignored',
  'Repair denied unfairly',
  'Security deposit dispute',
  'Rent-related disagreement',
  'Lease violation',
  'Unfair charges',
  'Harassment or repeated conflict',
];

export const REOPEN_REASONS = [
  'Issue not fully fixed',
  'Problem returned again',
  'Poor repair quality',
  'Wrong issue resolved',
  'No technician visit happened',
  'Damage increased after repair',
];

export interface SelectedProperty {
  id: string;
  name: string;
  address: string;
  selectedUnit?: string;
  landlordName: string;
  propertyManagerName: string;
  verificationMethod: string;
  approvalStatus?: string;
  matchConfidence?: string;
  distance?: string;
  monthlyRent?: number;
  securityDeposit?: number;
  leaseStart?: string;
  tenantNote?: string;
  requestId?: string;
  submittedTime?: string;
}

export interface NearbyProperty {
  id: string;
  name: string;
  address: string;
  distance: string;
  landlordName: string;
  propertyManagerName: string;
  unitsAvailable: string[];
  matchConfidence: string;
  monthlyRent: number;
  securityDeposit: number;
}

export const mockNearbyProperties: NearbyProperty[] = [
  {
    id: 'prop_001',
    name: 'Green Residency',
    address: 'Bhelupur, Varanasi, Uttar Pradesh',
    distance: '120 m away',
    landlordName: 'Rohit Mehra',
    propertyManagerName: 'Priya Kapoor',
    unitsAvailable: ['Flat 3B', 'Flat 4A'],
    matchConfidence: 'High Match',
    monthlyRent: 18000,
    securityDeposit: 36000,
  },
  {
    id: 'prop_002',
    name: 'Shivam Heights',
    address: 'Lanka, Varanasi, Uttar Pradesh',
    distance: '450 m away',
    landlordName: 'Anil Verma',
    propertyManagerName: 'Neha Singh',
    unitsAvailable: ['Flat 2A', 'Flat 5C'],
    matchConfidence: 'Possible Match',
    monthlyRent: 16500,
    securityDeposit: 33000,
  },
  {
    id: 'prop_003',
    name: 'River View Apartments',
    address: 'Assi Ghat Road, Varanasi, Uttar Pradesh',
    distance: '850 m away',
    landlordName: 'Meera Sharma',
    propertyManagerName: 'Karan Malhotra',
    unitsAvailable: ['Flat 1B'],
    matchConfidence: 'Nearby',
    monthlyRent: 22000,
    securityDeposit: 44000,
  },
];

export interface InvitationProperty {
  id: string;
  name: string;
  address: string;
  selectedUnit: string;
  landlordName: string;
  propertyManagerName: string;
  verificationMethod: string;
  approvalStatus: string;
  monthlyRent: number;
  securityDeposit: number;
}

export const mockInvitationCodes: Record<string, InvitationProperty> = {
  'RR-GREEN-3B': {
    id: 'prop_001',
    name: 'Green Residency',
    address: 'Bhelupur, Varanasi, Uttar Pradesh',
    selectedUnit: 'Flat 3B',
    landlordName: 'Rohit Mehra',
    propertyManagerName: 'Priya Kapoor',
    verificationMethod: 'Invitation Code',
    approvalStatus: 'pre_verified',
    monthlyRent: 18000,
    securityDeposit: 36000,
  },
};

export const FAQ_ITEMS = [
  { question: 'How do I raise a maintenance request?', answer: 'Go to the Dashboard and tap "Raise Request" or navigate to the Requests tab and tap the + button. Fill in the details including category, priority, and description.' },
  { question: 'How do I reopen a resolved issue?', answer: 'Open the resolved request from My Requests, then tap "Reopen Request". Select the reason and provide additional details.' },
  { question: 'How do I raise a dispute?', answer: 'Go to Profile > Help & Support or use the Dispute option from a request detail page. Fill in the dispute form with category and description.' },
  { question: 'What is an emergency request?', answer: 'Emergency requests are for urgent issues like gas leaks, fire hazards, flooding, or electrical dangers. Toggle the emergency switch when creating a request for immediate attention.' },
  { question: 'How do I contact my landlord?', answer: 'Use the Messages tab to send a message to your landlord or property manager. You can also find contact details in Property Info.' },
  { question: 'When is my rent due?', answer: 'Rent is due on the 5th of every month. Check the Rent tab for detailed payment history and upcoming dues.' },
  { question: 'How do I schedule a technician visit?', answer: 'When creating or viewing a request, you can set preferred date and time slots. The property manager will confirm the schedule.' },
  { question: 'Where can I find my lease agreement?', answer: 'Go to Profile > Lease Documents to view all your important documents including the rent agreement.' },
];
