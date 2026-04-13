export const alumniDocuments = [
  { id: 'tor', name: 'Transcript of Records', subtitle: 'Official academic record', price: 150 },
  { id: 'diploma', name: 'Diploma Copy', subtitle: 'Certified duplicate diploma', price: 200 },
  { id: 'enrollment', name: 'Certificate of Enrollment', subtitle: 'Proof of enrollment', price: 150 },
  { id: 'good-moral', name: 'Good Moral Certificate', subtitle: 'Character clearance', price: 200 },
  { id: 'other', name: 'Other', subtitle: 'Specify your document request', price: null },
];

export const staffRequestsSeed = [
  { id: 'REF-TOR-2026-001', document: 'Transcript of Records', student: 'John Doe', status: 'approved', date: 'Mar 15, 2026', time: '10:00 AM' },
  { id: 'REF-DIP-2026-002', document: 'Diploma Copy', student: 'John Doe', status: 'ready', date: 'Feb 26, 2026', time: '9:00 PM' },
  { id: 'REF-GMC-2026-003', document: 'Good Moral Certificate', student: 'Jane Smith', status: 'pending', date: 'Mar 18, 2026', time: '11:00 AM' },
];

export const trackerSteps = [
  { id: 'placed', title: 'Order Placed', detail: 'February 22, 2026 - 10:50 AM' },
  { id: 'processing', title: 'Processing', detail: 'Document being prepared by the Registrar' },
  { id: 'quality', title: 'Quality Check', detail: 'Document is being reviewed by the Admin' },
  { id: 'delivery', title: 'Out for Delivery', detail: 'On the way to address' },
  { id: 'delivered', title: 'Delivered', detail: 'Document has been issued' },
];
