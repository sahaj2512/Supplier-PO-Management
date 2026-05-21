export type PageView = 'dashboard' | 'pos' | 'po-detail' | 'scorecard';

export interface ViewState {
  page: PageView;
  poId?: string;
}

export type POStatus = 'Pending Ack.' | 'Readiness Req.' | 'Booked' | 'In Transit' | 'Confirmed' | 'Amended' | 'Delivered' | 'Closed';

export interface POLineItem {
  id: string;
  sku: string;
  description: string;
  qty: number;
  unit: string;
  value: number;
}

export interface POAmendment {
  id: string;
  type: string;
  originalValue: string;
  newValue: string;
  reason: string;
  impact: string;
  requestedBy: string;
  date: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

export interface PODocument {
  id: string;
  type: string;
  name: string;
  status: 'Validated' | 'Missing' | 'Pending Booking' | 'Uploaded';
  date?: string;
  notes?: string;
  phase: 'Pre-shipment' | 'Post-shipment';
  url?: string;
}

export interface PO {
  id: string;
  description: string;
  qty: number;
  deliveredQty?: number;
  pendingQty?: number;
  incoterms: string;
  origin: string;
  destination?: string;
  trackingNumber?: string;
  trackingLink?: string;
  mode: 'Air' | 'Sea' | 'Road';
  requiredDelivery: string;
  date: string;
  status: POStatus;
  sla?: string;
  value: number;
  urgency?: 'high' | 'medium' | 'low';
  lineItems: POLineItem[];
  amendments: POAmendment[];
  documents: PODocument[];
}

export interface ActionItem {
  id: string;
  type: 'urgency' | 'readiness' | 'document';
  title: string;
  description: string;
  poId: string;
  deadline: string;
  actionText: string;
}
