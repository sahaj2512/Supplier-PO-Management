import { PO, ActionItem } from './types';

const PRE_SHIPMENT_URL = 'https://prod-aps1-unifyapps-com-cloudstorage-142.s3.ap-south-1.amazonaws.com/workflow_uploads/142/LD-AA552602DOKSSPA.pdf?response-content-disposition=attachment%3Bfilename%3D%22LD-AA552602DOKSSPA.pdf%22&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDwaCmFwLXNvdXRoLTEiSDBGAiEA3kGwfvXAfhW0XyzOOnAodWY2phG2ATfv4I0SsIcdqBMCIQDm5Zr8nNR2RZroQLA7AzwYJkE8z%2FvFTeI1G9ui1ts3iiq%2FBQgFEAAaDDA1ODI2NDE5MDE2NyIMGskX%2BDfufDOd68EFKpwFVPjAQDnfiJj78U0WJAx9izj2ZPC9z%2BrgULycPv2srmLhwZvLRx9QjtZvpLwmg%2B%2BgltdUzgXzAaordjzMQZ44GahRJ07mOwzOb4lrnumYqEMaLkE7QaDggkk9sP%2B%2BTF9x1awvyHgYCIp8URTGU6RrAzd2%2BrB6JyvPAWDt6h8ObafffXoUQKxfVofZhuplvaFEO%2F9y7vTIj0lnDIwh%2FTtJetsUkFlx%2BnySJ6h%2FzL6MMmcl86UPfrCZq%2FWsy%2B%2FVLWmK5TLeb%2FPInrQqZEn%2FuEzI2%2BDDNBM4YbpFaopsczFg2IVoJmeMJz8PyfbBW0kjVM4GAfvXNQoqt1DRG%2Fcx27ikZRUaVstvFyh4PBRO5vUWvIETVQBai1dXmq6AkdnJiFt4mp8O15gNWIfyXstGzZBKw8AM3zzlPxZfLeVtb%2Fx%2BSZsU7rp3Kzj2EDFKGZHQ%2FQHsDUQgDl80qNv8n3jK9txgO8mTYbDLx8alXrf366Yd8TWX6GG%2BW4Cz8oKUeeq5TiEZ54vSN2%2Beo%2BSvO2NGtF9OzCfeCaY4gS2tuTWMief4c%2BOyacO1eqzzVEiQPxlgNd3Iw9r6zyWeC1KwYq8gbyMIMhfsEnK2AB6xUk8%2F59CgIEBXpUH7opdwpNeSqCvZ4kWTjhcvS19jOMSC%2FYALVxzXHy0ehS55aNM0b5ZYZNY8cAOF%2FdGVsvg6I2ZQqxKlJOco46IgJznbdCmnbMiQNR3dsntMmnSa2RJUGOqwk6%2BVrGUmvaGd1d1fFWo0jgKiZtnNLQyY8CrM6FlYTqeCSPAW%2FlzghD2yzu98izVjSTjTjy9VDYBcB1QRYLdmimbavJK70KM0GB58q7uAOeOwrWsUFU4EjOBsT770ZJ254n1sD48SNQMsXQPnEkq%2FKlIwveu70AY6sAG6BZj4bFEse8enGlEWT7kIxcg5Y8gKG%2FJmj50%2Fk4v%2BVwsSIsoEfI9SZlWQRBhkRzZ23nNpKApu%2BYWLzZQZBZLI4Vpj0PqIppwAcN1qrsce5FyfRio2pVvwIzndSpMTbnKnzYIkLtEB4DGRn3P5F04THfr6j8L3cTgtIl7rWPnydohGZWNHtpFNDSYIOdHpwgc7wt%2BbjT%2BIKdc53I6ctxJTfdcQPVNkn6LMDALD5AkoQg%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260521T135705Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ3EGQ7TL5QLY5IPK%2F20260521%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Expires=3600&X-Amz-Signature=40459c113458b51b32a6cec391e38ef778fc2c91a56455d64793867eeae0b672';
const POST_SHIPMENT_URL = 'https://prod-aps1-unifyapps-com-cloudstorage-142.s3.ap-south-1.amazonaws.com/workflow_uploads/142/LD-AA504583TOYAMAJPDHLDocs.pdf?response-content-disposition=attachment%3Bfilename%3D%22LD-AA504583TOYAMAJPDHLDocs.pdf%22&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCmFwLXNvdXRoLTEiRzBFAiEA9FygPxZOj0agoWCHXtF3sQ6FDXdZ4alInXnAjb%2Fie9ACIEny7Hrs64qSXMO7Aa4JMT%2FdluEauP9DeNqJcXaHMGS%2BKr0FCAQQABoMMDU4MjY0MTkwMTY3IgxY%2BXL65uPJEZpKv7wqmgW6JxRq6KzwFMtZha5vIQ%2FscJnJaZ7F2qZvhXI1Z4Ktdclhy68eus5gIDQ2fMh4zN0%2FS3Yko6QOCtGS0nEuXEeLvm3FGZnZKt44y1JSjJ6ggg34dnjB8CM2H6DilMoKKEE9wkmVWXDRKi2rHreaHMna%2FnoimbkAppKjrwQNAtqzXOTt46%2FVxGbtV5OAIiMZUgSWf53SNhrN07PAPLiUIldBHJY9iuZlkX3Pt%2Fdh8aM3pru4eL1bZZJj%2FuU6zpSHSbXfMH25PgI0%2BsxMllDpinfbZKx4W6J0fqCnSfybCTK51nXBtm3yxXcBLEzVp%2FA9Wz2091UPNOoq8R6CXp1RG1PiHayrPTGCUcax8yo99JI2zbOKFDqTDsS1vYkXhz6Fbk4PyGf6OPZTjywd7uJIICud5lIU2OqkujhwY1LfBXhcsQJBBSpeB0WKGy5oZCqzMB9JRFlaQhXfbWZzRQoUkbF5gP0URLt9C74ydbZyi7PJWGdP%2FY%2FZYJrjQwuusdn7AdUbHAp%2BJbJMm%2BfPciIit0iSvzM4fZmcLiJls2r4Hbq%2FjCAWsZHjWvPZ0jpvxrb622MCvRdqpsTypZwIlwkfdTpFTq78fatCtg72ScyZZz3%2BjlGyjnFyq7Zv587OFm%2FFtp6GiUmiNIDAF7p7ZS3esOMLrkZ78rhRyNFPGDoAZ2iJqH%2FdfUHquRinfF0Q5P7wxIsewkRuzYBx9MOxBIZJJdmgNBsvMpeAb6%2BZMC48QRqOrozA2P4mJHeo5DcEiszFsDJZOtBZ%2FcXug0M%2BhjL357SgB%2BNKHJuBzIU36PQX9a5E8aSExXFn57eH3MABuXWI9sVswACNY7489JBs%2Fvf4uZ5YQ1OnSC%2FWGVS0nZhw9hE1P7WBvXxL9VoPnI8w%2FdC70AY6sQHuZehTTvq1xuGird9pyGZ1tJSUrfbKlp%2BrZt45G95VGWLqr4xKpG194aL6OI28qpXzmFZAAbvlcHYTU3cztFy05YXTh4%2B6VQpoX454KqaMMNNofho1jsVkrjJ5i5ROLfG%2BQIVvtv6ey4tvu6A81%2B%2B%2B8i2xDCJ%2B6viV06y7LkEaFL8sbAIXeY5mltLN2C8nuk05GDoaFdL0fyJTkNltHu1EWhJIu%2FkImkOfKADSFnIEWJ4%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260521T135240Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAQ3EGQ7TL3HFEOBL3%2F20260521%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Expires=3600&X-Amz-Signature=49a7d32bc20d36fd74e410dc77bb1d62dff5e83367ad18e39cd97eb1341ab166';
const TRACKING_URL_DELIVERED = 'https://www.dhl.com/in-en/home/tracking.html?tracking-id=1049608630&submit=1';
const TRACKING_URL = 'https://www.dhl.com/in-en/home/tracking.html?tracking-id=2090068326&submit=1';

export const initialPOs: PO[] = [
  {
    id: 'PO-VAT-20251',
    description: 'Actuator Assembly × 20',
    qty: 20,
    deliveredQty: 0,
    pendingQty: 20,
    incoterms: 'CIF - ZRH',
    origin: 'SIN',
    destination: 'Zurich, Switzerland',
    mode: 'Sea',
    date: 'May 14',
    requiredDelivery: 'Jun 10',
    status: 'Pending Ack.',
    sla: '2.5h left',
    value: 25600,
    urgency: 'high',
    lineItems: [
      { id: '001', sku: 'ACT-A2-STD', description: 'Actuator Assembly Type A2', qty: 12, unit: 'EA', value: 14400 },
      { id: '002', sku: 'ACT-B1-HV', description: 'Actuator Assembly HV-Grade', qty: 8, unit: 'EA', value: 11200 },
    ],
    amendments: [],
    documents: [
      { id: 'd1', type: 'Proforma', name: 'Proforma Invoice', phase: 'Pre-shipment', status: 'Validated', date: 'May 14, 2026', url: PRE_SHIPMENT_URL }
    ]
  },
  {
    id: 'PO-VAT-20248',
    description: 'Vacuum Valves × 400',
    qty: 400,
    deliveredQty: 0,
    pendingQty: 400,
    incoterms: 'DAP',
    origin: 'KUL',
    destination: 'Haag, Switzerland',
    mode: 'Air',
    date: 'May 11',
    requiredDelivery: 'Jun 02',
    status: 'Readiness Req.',
    sla: 'Due May 21',
    value: 45000,
    urgency: 'medium',
    lineItems: [
       { id: '001', sku: 'VAL-V4', description: 'Vacuum Valve V4', qty: 400, unit: 'EA', value: 45000 }
    ],
    amendments: [
      { id: 'a3', type: 'Quantity Increase', originalValue: '400 units', newValue: '450 units', reason: 'Increased demand', impact: 'Extra weight for shipping', requestedBy: 'VAT Procurement', date: 'May 15, 2026', status: 'Pending' }
    ],
    documents: [
      { id: 'd1', type: 'Proforma', name: 'Proforma Invoice', phase: 'Pre-shipment', status: 'Validated', date: 'May 13, 2026', url: PRE_SHIPMENT_URL }
    ]
  },
  {
    id: 'PO-VAT-20245',
    description: 'Seal Kit B-Series × 150',
    qty: 150,
    deliveredQty: 50,
    pendingQty: 100,
    incoterms: 'EXW',
    origin: 'SIN',
    destination: 'Penang, Malaysia',
    mode: 'Air',
    date: 'May 06',
    requiredDelivery: 'May 28',
    status: 'In Transit',
    trackingNumber: 'AWB-772-9182',
    trackingLink: TRACKING_URL,
    sla: '3.2h ✓',
    value: 8500,
    urgency: 'low',
    lineItems: [
      { id: '001', sku: 'SEAL-B', description: 'Seal Kit B-Series', qty: 150, unit: 'SET', value: 8500 }
    ],
    amendments: [],
    documents: [
      { id: 'd1', type: 'PackingList', name: 'Packing List', phase: 'Pre-shipment', status: 'Validated', date: 'May 14, 2026', notes: 'v1.0', url: PRE_SHIPMENT_URL },
      { id: 'd2', type: 'Invoice', name: 'Proforma Invoice', phase: 'Pre-shipment', status: 'Validated', date: 'May 14, 2026', url: PRE_SHIPMENT_URL },
      { id: 'd3', type: 'COO', name: 'Certificate of Origin (COO)', phase: 'Post-shipment', status: 'Missing' },
      { id: 'd4', type: 'AWB', name: 'Airway Bill (AWB)', phase: 'Post-shipment', status: 'Pending Booking' }
    ]
  },
  {
    id: 'PO-VAT-20243',
    description: 'Pressure Sensor M12 × 200',
    qty: 200,
    deliveredQty: 200,
    pendingQty: 0,
    incoterms: 'FCA',
    origin: 'KUL',
    destination: 'Haag, Switzerland',
    mode: 'Air',
    date: 'May 04',
    requiredDelivery: 'Jun 01',
    status: 'Delivered',
    trackingNumber: 'AWB-119-2041',
    trackingLink: TRACKING_URL_DELIVERED,
    sla: '2.1h ✓',
    value: 12000,
    urgency: 'medium',
    lineItems: [
        { id: '001', sku: 'SENS-M12', description: 'Pressure Sensor M12', qty: 200, unit: 'EA', value: 12000 }
    ],
    amendments: [
      { id: 'a1', type: 'Quantity Increase', originalValue: '200 units', newValue: '220 units', reason: 'Buffer stock request', impact: 'Additional packing required', requestedBy: 'VAT Procurement', date: 'May 18, 2026', status: 'Pending' }
    ],
    documents: [
      { id: 'd1', type: 'PackingList', name: 'Packing List', phase: 'Pre-shipment', status: 'Validated', date: 'May 10, 2026', url: PRE_SHIPMENT_URL },
      { id: 'd2', type: 'Invoice', name: 'Commercial Invoice', phase: 'Pre-shipment', status: 'Validated', date: 'May 10, 2026', url: PRE_SHIPMENT_URL },
      { id: 'd3', type: 'AWB', name: 'Airway Bill (AWB)', phase: 'Post-shipment', status: 'Validated', date: 'May 11, 2026', url: POST_SHIPMENT_URL },
      { id: 'd4', type: 'POD', name: 'Proof of Delivery', phase: 'Post-shipment', status: 'Validated', date: 'May 15, 2026', url: POST_SHIPMENT_URL }
    ]
  },
  {
    id: 'PO-VAT-20241',
    description: 'Vacuum Gate V4.2 × 50',
    qty: 50,
    deliveredQty: 50,
    pendingQty: 0,
    incoterms: 'DAP',
    origin: 'SIN',
    destination: 'Penang, Malaysia',
    mode: 'Air',
    date: 'Apr 28',
    requiredDelivery: 'May 20',
    status: 'Closed',
    trackingNumber: 'AWB-501-1123',
    trackingLink: TRACKING_URL_DELIVERED,
    sla: '1.4h ✓',
    value: 54000,
    urgency: 'low',
    lineItems: [
       { id: '001', sku: 'GATE-V4', description: 'Vacuum Gate V4.2', qty: 50, unit: 'EA', value: 54000 }
    ],
    amendments: [
      { id: 'a1', type: 'Quantity Reduction', originalValue: '50 units', newValue: '42 units', reason: 'Demand forecast revision', impact: 'Packing list & invoice to be updated before delivery', requestedBy: 'VAT Procurement', date: 'May 15, 2026', status: 'Pending' }
    ],
    documents: [
      { id: 'd1', type: 'PackingList', name: 'Packing List', phase: 'Pre-shipment', status: 'Validated', date: 'May 12, 2026', url: PRE_SHIPMENT_URL },
      { id: 'd2', type: 'Invoice', name: 'Commercial Invoice', phase: 'Pre-shipment', status: 'Validated', date: 'May 12, 2026', url: PRE_SHIPMENT_URL },
      { id: 'd3', type: 'AWB', name: 'Airway Bill (AWB)', phase: 'Post-shipment', status: 'Validated', date: 'May 13, 2026', url: POST_SHIPMENT_URL },
      { id: 'd4', type: 'POD', name: 'Proof of Delivery', phase: 'Post-shipment', status: 'Validated', date: 'May 18, 2026', url: POST_SHIPMENT_URL }
    ]
  },
  {
    id: 'PO-VAT-20237',
    description: 'Flange Assembly × 80',
    qty: 80,
    deliveredQty: 0,
    pendingQty: 80,
    incoterms: 'FCA',
    origin: 'SIN',
    destination: 'Zurich, Switzerland',
    mode: 'Sea',
    date: 'Apr 20',
    requiredDelivery: 'May 25',
    status: 'Booked',
    trackingNumber: 'HBL-992-12',
    trackingLink: TRACKING_URL,
    sla: '1.9h ✓',
    value: 3200,
    urgency: 'low',
    lineItems: [
        { id: '001', sku: 'FLANGE-M', description: 'Flange Assembly M-Type', qty: 80, unit: 'EA', value: 3200 }
    ],
    amendments: [],
    documents: [
      { id: 'd1', type: 'Proforma', name: 'Proforma Invoice', phase: 'Pre-shipment', status: 'Validated', date: 'May 06, 2026', url: PRE_SHIPMENT_URL },
      { id: 'd2', type: 'PackingList', name: 'Packing List', phase: 'Pre-shipment', status: 'Validated', date: 'May 08, 2026', url: PRE_SHIPMENT_URL }
    ]
  },
  {
    id: 'PO-VAT-20235',
    description: 'Thermal Sensors × 120 (Partial)',
    qty: 120,
    deliveredQty: 100,
    pendingQty: 20,
    incoterms: 'DAP',
    origin: 'TPE',
    destination: 'Haag, Switzerland',
    mode: 'Air',
    date: 'Apr 10',
    requiredDelivery: 'May 15',
    status: 'Delivered',
    trackingNumber: 'AWB-201-8899',
    trackingLink: TRACKING_URL_DELIVERED,
    sla: '1.2h ✓',
    value: 6000,
    urgency: 'low',
    lineItems: [
        { id: '001', sku: 'SENS-THM', description: 'Thermal Sensor Standard', qty: 120, unit: 'EA', value: 6000 }
    ],
    amendments: [],
    documents: [
      { id: 'd1', type: 'Commercial Invoice', name: 'Commercial Invoice', phase: 'Pre-shipment', status: 'Validated', date: 'May 10, 2026', url: PRE_SHIPMENT_URL },
      { id: 'd2', type: 'AWB', name: 'Airway Bill (AWB)', phase: 'Post-shipment', status: 'Validated', date: 'May 11, 2026', url: POST_SHIPMENT_URL },
      { id: 'd3', type: 'POD', name: 'Proof of Delivery', phase: 'Post-shipment', status: 'Validated', date: 'May 14, 2026', url: POST_SHIPMENT_URL }
    ]
  },
];

export const mockActions: ActionItem[] = [
  {
    id: 'a1',
    type: 'urgency',
    title: 'PO-VAT-20251 — Actuator Assembly × 20',
    description: 'Delivery: Jun 10 · Origin: SIN · Mode: Sea',
    poId: 'PO-VAT-20251',
    deadline: 'SLA: 4h from issue · Expires in 2.5 hours',
    actionText: 'Acknowledge PO'
  },
  {
    id: 'a2',
    type: 'readiness',
    title: 'PO-VAT-20248 — Vacuum Valves × 400',
    description: 'Delivery: Jun 02 · Origin: KUL · Air Freight',
    poId: 'PO-VAT-20248',
    deadline: 'Readiness required by May 21 (T-7 rule)',
    actionText: 'Confirm Readiness'
  },
  {
    id: 'a3',
    type: 'document',
    title: 'PO-VAT-20245 — Certificate of Origin',
    description: 'Seal Kit B-Series × 150 · Booking on hold until uploaded',
    poId: 'PO-VAT-20245',
    deadline: 'GRID compliance check failed — COO missing',
    actionText: 'Upload COO'
  }
];
