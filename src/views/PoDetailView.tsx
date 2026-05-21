import React, { useState } from 'react';
import { ViewState, PO, POAmendment, PODocument } from '../types';
import { Card, CardTitle, Badge, Button, Alert } from '../components/ui';
import { useAppContext } from '../App';
import { ArrowLeft, CheckCircle2, ChevronRight, Download, Upload, AlertTriangle, FileCheck, PackageCheck, History, Edit3, Truck } from 'lucide-react';

interface Props {
  view: ViewState;
  onNavigate: (view: ViewState) => void;
}

export default function PoDetailView({ view, onNavigate }: Props) {
  const { pos, updatePO, showSnackbar } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'amendments' | 'documents'>('overview');
  
  const [showAckModal, setShowAckModal] = useState(false);
  const [showReadinessModal, setShowReadinessModal] = useState(false);
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);
  const [showRequestChangeModal, setShowRequestChangeModal] = useState(false);
  
  const [newVal, setNewVal] = useState('');
  const [requestedChangeReason, setRequestedChangeReason] = useState('');
  
  const [docUploadType, setDocUploadType] = useState('Invoice');
  const [docUploadName, setDocUploadName] = useState('');
  const [readinessData, setReadinessData] = useState({ date: '', qty: 0, grossWeight: '', cartons: '', packaging: 'Complete', preDispatch: 'Required - Full QC', notes: '' });

  const po = pos.find(p => p.id === view.poId);
  if (!po) return <div>PO Not found</div>;

  const handleAcknowledge = () => {
    updatePO({ ...po, status: 'Readiness Req.', sla: 'Due dynamically' });
    showSnackbar('PO Acknowledged successfully');
    setShowAckModal(false);
  };

  const handleReadiness = () => {
    updatePO({ ...po, status: 'Booked', sla: 'Ready for booking', qty: readinessData.qty, pendingQty: readinessData.qty - (po.deliveredQty || 0) });
    showSnackbar('Readiness Confirmed');
    setShowReadinessModal(false);
  };

  const handleUploadDoc = () => {
    if (!docUploadName) return;
    const newDoc: PODocument = {
      id: Math.random().toString(),
      type: docUploadType,
      name: docUploadName,
      status: 'Uploaded',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      phase: docUploadType === 'AWB' || docUploadType === 'COO' ? 'Post-shipment' : 'Pre-shipment'
    };
    updatePO({ ...po, documents: [...po.documents, newDoc] });
    showSnackbar(`${docUploadName} uploaded successfully`);
    setShowDocUploadModal(false);
    setDocUploadName('');
  };

  const handleRequestChange = () => {
    if (!newVal) return;
    const amendment: POAmendment = {
      id: Math.random().toString(),
      type: 'Quantity Change',
      originalValue: `${po.qty} units`,
      newValue: `${newVal} units`,
      reason: requestedChangeReason || 'Supplier Request',
      impact: 'Requires approval',
      requestedBy: 'VAT Procurement',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Pending'
    };
    
    updatePO({ ...po, status: 'Amended', amendments: [...po.amendments, amendment] });
    showSnackbar('Amendment requested');
    setShowRequestChangeModal(false);
    setNewVal('');
    setRequestedChangeReason('');
  };

  const handleAcceptChange = (aId: string) => {
    const amd = po.amendments.find(a => a.id === aId);
    if (!amd) return;
    
    const newQty = parseInt(amd.newValue.replace(/\D/g, '')) || po.qty;
    const updAmds = po.amendments.map(a => a.id === aId ? { ...a, status: 'Accepted' as const } : a);
    
    updatePO({ ...po, qty: newQty, pendingQty: newQty - (po.deliveredQty || 0), amendments: updAmds });
    showSnackbar('Amendment Accepted & values updated');
  };

  const handleRejectChange = (aId: string) => {
    const updAmds = po.amendments.map(a => a.id === aId ? { ...a, status: 'Rejected' as const } : a);
    updatePO({ ...po, amendments: updAmds });
    showSnackbar('Amendment Rejected');
  };

  const renderFulfillmentProgress = () => {
    const stages = ['Pending Ack.', 'Readiness Req.', 'Booked', 'In Transit', 'Delivered', 'Closed'];
    let currentIndex = stages.indexOf(po.status);
    if (po.status === 'Confirmed' || po.status === 'Amended') currentIndex = 1;
    if (currentIndex === -1) currentIndex = 0;

    return (
      <div className="relative pt-4 pb-16 w-full max-w-2xl mx-auto overflow-hidden">
        <div className="absolute top-7 left-[5%] right-[5%] h-1 bg-gray-200"></div>
        <div className="absolute top-7 left-[5%] h-1 bg-[var(--color-primary)] transition-all duration-500" style={{ width: `${(currentIndex / 5) * 90}%` }}></div>
        
        <div className="flex justify-between relative z-10 w-full px-[5%]">
          {stages.map((stage, idx) => {
             const isPast = idx < currentIndex;
             const isCurrent = idx === currentIndex;
             return (
               <div key={stage} className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mb-2 z-10 border-2 transition-all duration-300 ${isPast || isCurrent ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-gray-100 border-gray-300 text-gray-400'} ${isCurrent && 'ring-4 ring-[var(--color-primary)]/20 shadow-md scale-110'}`}>
                    {isPast || isCurrent ? <CheckCircle2 size={12}/> : idx + 1}
                  </div>
                  <div className={`text-[10px] font-bold absolute top-10 whitespace-nowrap text-center ${isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>{stage === 'Pending Ack.' ? 'Ack' : stage === 'Readiness Req.' ? 'Ready' : stage}</div>
               </div>
             )
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate({ page: 'pos' })}
            className="w-8 h-8 rounded shrink-0 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-extrabold text-gray-900 font-sans">{po.id}</h1>
              <Badge 
                variant={
                  po.status === 'Confirmed' || po.status === 'Booked' ? 'green' : 
                  po.status === 'Closed' || po.status === 'Delivered' ? 'gray' : 
                  po.status === 'Pending Ack.' ? 'red' :
                  po.status === 'Readiness Req.' || po.status === 'Amended' ? 'amber' : 'blue'
                }
              >
                {po.status}
              </Badge>
            </div>
            <div className="text-[13px] text-gray-500 font-medium">{po.description}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {po.status === 'Pending Ack.' && (
            <Button variant="primary" onClick={() => setShowAckModal(true)}>Acknowledge PO</Button>
          )}
          {po.status === 'Readiness Req.' && (
            <Button variant="amber" onClick={() => { setReadinessData(prev => ({ ...prev, qty: po.qty })); setShowReadinessModal(true); }}>Confirm Readiness</Button>
          )}
        </div>
      </div>

      {po.status === 'Pending Ack.' && po.sla && (
         <Alert variant="red">
            <span className="text-base leading-none">🔴</span>
            <div>
              Acknowledgment required within <strong className="font-bold text-red-900">{po.sla}</strong> to maintain SLA compliant status.
            </div>
          </Alert>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 pb-0">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-[13px] font-bold tracking-wide uppercase border-b-2 transition-colors ${activeTab === 'overview' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          PO Overview
        </button>
        <button 
          onClick={() => setActiveTab('amendments')}
          className={`px-4 py-2.5 text-[13px] font-bold tracking-wide uppercase border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'amendments' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          Amendments {po.amendments.length > 0 && <span className="bg-yellow-100 text-yellow-700 py-0.5 px-1.5 rounded-full text-[10px]">{po.amendments.length}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2.5 text-[13px] font-bold tracking-wide uppercase border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'documents' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          Document Workbench
          {po.documents.filter(d => d.status === 'Missing').length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          )}
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <CardTitle className="mb-0 text-gray-900">Line Items</CardTitle>
              </div>
              <div className="divide-y divide-gray-100">
                {po.lineItems.map(item => (
                  <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                    <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                      <PackageCheck size={20} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[11px] text-[var(--color-primary)] mb-1">{item.sku}</div>
                      <div className="font-bold text-[13px] text-gray-900">{item.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-gray-900 font-sans">{item.qty} <span className="text-[11px] text-gray-500 font-normal">{item.unit}</span></div>
                      <div className="text-[11px] text-gray-500">${item.value.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                {po.lineItems.length === 0 && (
                   <div className="p-6 text-center text-sm text-gray-500">No line items loaded.</div>
                )}
              </div>
            </Card>

            <Card>
              <div className="p-5">
                 <CardTitle className="mb-4 text-gray-900">Fulfillment Progress</CardTitle>
                 {renderFulfillmentProgress()}
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <div className="p-5 border-b border-gray-200 bg-gray-50">
                <CardTitle className="mb-0 text-gray-900">Logistics Terms</CardTitle>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Incoterms</div>
                  <div className="font-mono text-[13px] text-gray-900 font-bold flex items-center gap-2">
                    {po.incoterms} <Badge variant="gray">Sender bears local cost</Badge>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Mode, Origin & Destination</div>
                  <div className="text-[13px] text-gray-900 font-bold flex items-center gap-2 flex-wrap">
                    {po.mode} Freight <ChevronRight size={14} className="text-gray-400" /> {po.origin} <ChevronRight size={14} className="text-gray-400" /> {po.destination || 'Unspecified'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Required Delivery</div>
                  <div className="text-[13px] text-gray-900 font-bold">{po.requiredDelivery}</div>
                  <div className="text-[10px] text-gray-400 font-medium italic mt-1">Expected 6 days transit time</div>
                </div>

                {(po.status === 'Closed' || po.status === 'In Transit' || po.status === 'Booked' || po.status === 'Delivered') && po.trackingNumber && (
                   <div className="mt-4 pt-4 border-t border-gray-100">
                     <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Shipment Tracking</div>
                     <a href={po.trackingLink} target="_blank" rel="noreferrer" className="text-[13px] font-bold text-[var(--color-primary)] flex items-center gap-1.5 hover:underline">
                        <Truck size={14}/> {po.trackingNumber}
                     </a>
                   </div>
                )}
              </div>
            </Card>

            <Card>
              <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <CardTitle className="mb-0 text-gray-900">Commercial Setup</CardTitle>
              </div>
              <div className="p-5 flex flex-col gap-3">
                 <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Ordered Qty</span>
                    <span className="font-bold text-gray-900">{po.qty.toLocaleString()} units</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Delivered Qty</span>
                    <span className="font-bold text-[var(--color-primary)]">{po.deliveredQty !== undefined ? po.deliveredQty.toLocaleString() : 0} units</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Pending Qty</span>
                    <span className="font-bold text-amber-600">{po.pendingQty !== undefined ? po.pendingQty.toLocaleString() : (po.qty - (po.deliveredQty || 0)).toLocaleString()} units</span>
                 </div>
                 <div className="flex justify-between items-end pt-1">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Value</span>
                    <span className="font-sans font-extrabold text-[15px] text-gray-900">${po.value.toLocaleString()}</span>
                 </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* AMENDMENTS TAB */}
      {activeTab === 'amendments' && (
        <Card className="animate-in fade-in slide-in-from-bottom-2">
           <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
             <CardTitle className="mb-0 text-gray-900 flex items-center gap-2"><History size={14} /> Change Requests & Amendments</CardTitle>
             <Button variant="ghost" size="sm" onClick={() => setShowRequestChangeModal(true)}><Edit3 size={14}/> Request Change</Button>
           </div>
           
           <div className="divide-y divide-gray-100">
              {po.amendments.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                   <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                     <History size={24} />
                   </div>
                   <div className="text-sm font-bold text-gray-900">No Amendments</div>
                   <div className="text-xs text-gray-500 mt-1 max-w-sm">There are no active change requests for this Purchase Order.</div>
                   <Button variant="ghost" size="md" className="mt-6 border-gray-200" onClick={() => setShowRequestChangeModal(true)}>Propose Amendment</Button>
                </div>
              ) : (
                po.amendments.map(amendment => (
                  <div key={amendment.id} className="p-5 flex gap-6">
                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${amendment.status === 'Accepted' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      <AlertTriangle size={16} className={`${amendment.status === 'Accepted' ? 'text-green-600' : 'text-yellow-600'}`} />
                    </div>
                    <div className="flex-1 space-y-3">
                       <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-[13px] font-bold text-gray-900">{amendment.type}</h3>
                              <Badge variant={amendment.status === 'Accepted' ? 'green' : 'amber'}>{amendment.status}</Badge>
                            </div>
                            <div className="text-[11px] text-gray-500">Requested by <strong className="text-gray-900 font-semibold">{amendment.requestedBy}</strong> on {amendment.date}</div>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                         <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                           <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Original Value</div>
                           <div className="font-mono text-xs text-gray-500 line-through decoration-red-500/50">{amendment.originalValue}</div>
                         </div>
                         <div className="bg-[var(--color-primary-dim)] border border-[var(--color-primary)] rounded-lg p-3">
                           <div className="text-[10px] text-[var(--color-primary)] uppercase tracking-widest font-bold mb-1">Proposed Value</div>
                           <div className="font-mono text-xs text-gray-900 font-bold bg-white inline-block px-1 rounded shadow-sm">{amendment.newValue}</div>
                         </div>
                       </div>

                       <div className="text-[11px] text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-900 font-bold block mb-1">Reason for change:</strong>
                         {amendment.reason}
                         <div className="mt-2 text-gray-600"><strong className="text-gray-800 font-bold">Impact:</strong> {amendment.impact}</div>
                       </div>

                       {amendment.status === 'Pending' && (
                         <div className="flex items-center gap-3 pt-2">
                           <Button variant="primary" size="md" onClick={() => handleAcceptChange(amendment.id)}>Accept Change</Button>
                           <Button variant="ghost" size="md" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleRejectChange(amendment.id)}>Reject</Button>
                         </div>
                       )}
                    </div>
                  </div>
                ))
              )}
           </div>
        </Card>
      )}

      {/* DOCUMENT WORKBENCH TAB */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
           <div className="lg:col-span-2 space-y-6">
             <Card>
               <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                 <CardTitle className="mb-0 text-gray-900">Pre-Shipment Documents</CardTitle>
                 <Button variant="primary" size="sm" className="gap-2" onClick={() => setShowDocUploadModal(true)}><Upload size={14}/> Upload Doc</Button>
               </div>
               <div className="divide-y divide-gray-100">
                 {po.documents.filter(d => d.phase !== 'Post-shipment').map(doc => (
                   <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                     <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${
                          doc.status === 'Validated' || doc.status === 'Uploaded' ? 'bg-green-100 text-green-600' :
                          doc.status === 'Missing' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                       }`}>
                         <FileCheck size={20} />
                       </div>
                       <div>
                         <div className="font-bold text-[13px] text-gray-900 mb-1">{doc.name}</div>
                         <div className="text-[11px] text-gray-500 flex items-center gap-2">
                           <Badge variant={doc.status === 'Validated' || doc.status === 'Uploaded' ? 'green' : doc.status === 'Missing' ? 'red' : 'blue'}>{doc.status}</Badge>
                           {doc.date && <span>{doc.date}</span>}
                           {doc.notes && <span className="bg-gray-100 text-gray-600 px-1.5 rounded text-[9px]">{doc.notes}</span>}
                         </div>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       {doc.status === 'Validated' || doc.status === 'Uploaded' ? (
                          <Button variant="ghost" size="sm" onClick={() => doc.url && window.open(doc.url, '_blank')}><Download size={14}/></Button>
                       ) : (
                          <Button variant={doc.status === 'Missing' ? 'red' : 'primary'} size="sm" onClick={() => setShowDocUploadModal(true)}><Upload size={14}/> Upload</Button>
                       )}
                     </div>
                   </div>
                 ))}
                 {po.documents.filter(d => d.phase !== 'Post-shipment').length === 0 && (
                   <div className="p-8 text-center text-sm text-gray-500">No Pre-shipment documents.</div>
                 )}
               </div>
             </Card>

             <Card>
               <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                 <CardTitle className="mb-0 text-gray-900">Post-Shipment Documents</CardTitle>
               </div>
               <div className="divide-y divide-gray-100">
                 {po.documents.filter(d => d.phase === 'Post-shipment').map(doc => (
                   <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                     <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${
                          doc.status === 'Validated' || doc.status === 'Uploaded' ? 'bg-green-100 text-green-600' :
                          doc.status === 'Missing' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                       }`}>
                         <FileCheck size={20} />
                       </div>
                       <div>
                         <div className="font-bold text-[13px] text-gray-900 mb-1">{doc.name}</div>
                         <div className="text-[11px] text-gray-500 flex items-center gap-2">
                           <Badge variant={doc.status === 'Validated' || doc.status === 'Uploaded' ? 'green' : doc.status === 'Missing' ? 'red' : 'blue'}>{doc.status}</Badge>
                           {doc.date && <span>{doc.date}</span>}
                         </div>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       {doc.status === 'Validated' || doc.status === 'Uploaded' ? (
                          <Button variant="ghost" size="sm" onClick={() => doc.url && window.open(doc.url, '_blank')}><Download size={14}/></Button>
                       ) : (
                          <Button variant={doc.status === 'Missing' ? 'red' : 'primary'} size="sm" onClick={() => setShowDocUploadModal(true)}><Upload size={14}/> Upload</Button>
                       )}
                     </div>
                   </div>
                 ))}
                 {po.documents.filter(d => d.phase === 'Post-shipment').length === 0 && (
                   <div className="p-8 text-center text-sm text-gray-500">No Post-shipment documents.</div>
                 )}
               </div>
             </Card>
           </div>

           <div className="space-y-6">
              <Card>
                 <div className="p-5 border-b border-gray-200 bg-gray-50">
                    <CardTitle className="mb-0 text-gray-900">Required Documents</CardTitle>
                 </div>
                 <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                       <div className="flex items-center gap-2 text-gray-700 font-medium"><CheckCircle2 size={14} className="text-green-500"/> Proforma Invoice</div>
                       <span className="text-[10px] text-gray-400">Pre-shipment</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                       <div className="flex items-center gap-2 text-gray-700 font-medium"><CheckCircle2 size={14} className="text-green-500"/> Packing List</div>
                       <span className="text-[10px] text-gray-400">Pre-shipment</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                       <div className="flex items-center gap-2 text-gray-900 font-bold"><span className="w-3.5 h-3.5 border border-gray-300 rounded-full shrink-0"></span> Commercial Invoice</div>
                       <span className="text-[10px] text-gray-400">Post-shipment</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                       <div className="flex items-center gap-2 text-gray-900 font-bold"><span className="w-3.5 h-3.5 border border-gray-300 rounded-full shrink-0"></span> Airway Bill (AWB)</div>
                       <span className="text-[10px] text-gray-400">Post-shipment</span>
                    </div>
                 </div>
              </Card>

              <Alert variant="blue">
                <span className="text-base leading-none">ℹ️</span>
                 <div className="space-y-2">
                   <strong className="text-blue-900 block font-bold">SOP Library</strong>
                   <span className="block mb-2 text-blue-800">Need help formatting your CI? Check the VAT compliance guide.</span>
                   <Button variant="ghost" size="sm" className="border-blue-200 text-blue-600">View Guidelines <ChevronRight size={14}/></Button>
                 </div>
              </Alert>
           </div>
        </div>
      )}

      {/* MODALS */}
      {showAckModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-card)] w-full max-w-2xl rounded-xl shadow-lg border border-gray-200 p-6 animate-in zoom-in-95 duration-200 relative">
             <h2 className="text-xl font-extrabold text-gray-900 font-sans flex items-center gap-2 mb-6">
               📋 Acknowledge Purchase Order – {po.id}
             </h2>
             <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 flex items-center gap-2 text-sm text-gray-700">
               {po.description} • Delivery: {po.requiredDelivery} {po.sla && <>• SLA expires in <strong className="text-red-600 font-bold">{po.sla}</strong></>}
             </div>
             <div className="flex justify-end gap-3 mt-6">
               <Button variant="ghost" onClick={() => setShowAckModal(false)}>Cancel</Button>
               <Button variant="primary" onClick={handleAcknowledge}>✓ Submit Acknowledgement</Button>
             </div>
          </div>
        </div>
      )}

      {showReadinessModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-card)] w-full max-w-2xl rounded-xl shadow-lg border border-gray-200 p-6 animate-in zoom-in-95 duration-200 relative">
             <h2 className="text-xl font-extrabold text-gray-900 font-sans flex items-center gap-2 mb-6">
               📦 Readiness Confirmation – {po.id}
             </h2>
             <div className="grid grid-cols-2 gap-4 mb-6">
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Goods Ready Date</label>
                 <input type="date" className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={readinessData.date} onChange={e => setReadinessData({ ...readinessData, date: e.target.value })} />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Confirmed Quantity</label>
                 <input type="number" className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={readinessData.qty || ''} onChange={e => setReadinessData({ ...readinessData, qty: parseInt(e.target.value) || 0 })} />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Gross Weight (KG)</label>
                 <input type="number" className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={readinessData.grossWeight} onChange={e => setReadinessData({ ...readinessData, grossWeight: e.target.value })} />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">No. of Cartons</label>
                 <input type="number" className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={readinessData.cartons} onChange={e => setReadinessData({ ...readinessData, cartons: e.target.value })} />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Packaging Status</label>
                 <select className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={readinessData.packaging} onChange={e => setReadinessData({ ...readinessData, packaging: e.target.value })}>
                   <option value="Complete">Complete</option>
                   <option value="In Progress">In Progress</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Pre-Dispatch Inspection</label>
                 <select className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={readinessData.preDispatch} onChange={e => setReadinessData({ ...readinessData, preDispatch: e.target.value })}>
                   <option value="Required - Full QC">Required — Full QC</option>
                   <option value="Required - Sample QC">Required — Sample QC</option>
                   <option value="Not Required">Not Required</option>
                 </select>
               </div>
               <div className="col-span-2">
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Shortfall Notes (If Any)</label>
                 <textarea className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 min-h-[80px]" placeholder="Leave blank if full quantity is ready" value={readinessData.notes} onChange={e => setReadinessData({ ...readinessData, notes: e.target.value })}></textarea>
               </div>
             </div>
             <div className="flex justify-end gap-3 mt-6">
               <Button variant="ghost" onClick={() => setShowReadinessModal(false)}>Cancel</Button>
               <Button variant="primary" onClick={handleReadiness}>✓ Submit Readiness</Button>
             </div>
          </div>
        </div>
      )}

      {showDocUploadModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg border border-gray-200 p-6 animate-in zoom-in-95 duration-200 relative">
             <h2 className="text-xl font-extrabold text-gray-900 font-sans mb-6">Upload Document</h2>
             <div className="space-y-4 mb-6">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Document Type</label>
                  <select className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" value={docUploadType} onChange={e => setDocUploadType(e.target.value)}>
                    <option value="Invoice">Invoice</option>
                    <option value="PackingList">Packing List</option>
                    <option value="AWB">Airway Bill (AWB)</option>
                    <option value="COO">Certificate of Origin</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Document Name</label>
                  <input type="text" className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" placeholder="e.g. Inv-9281.pdf" value={docUploadName} onChange={e => setDocUploadName(e.target.value)} />
               </div>
               <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="text-gray-400 mb-2" size={24} />
                  <div className="text-sm font-bold text-[var(--color-primary)]">Click to upload</div>
                  <div className="text-[10px] text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</div>
               </div>
             </div>
             <div className="flex justify-end gap-3 mt-6">
               <Button variant="ghost" onClick={() => setShowDocUploadModal(false)}>Cancel</Button>
               <Button variant="primary" onClick={handleUploadDoc}>✓ Upload</Button>
             </div>
          </div>
        </div>
      )}

      {showRequestChangeModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg border border-gray-200 p-6 animate-in zoom-in-95 duration-200 relative">
             <h2 className="text-xl font-extrabold text-gray-900 font-sans mb-6">Request PO Change</h2>
             <div className="space-y-4 mb-6">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Proposed Quantity</label>
                  <input type="number" className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" placeholder={po.qty.toString()} value={newVal} onChange={e => setNewVal(e.target.value)} />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Reason for change</label>
                  <textarea rows={3} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" placeholder="Explain why you are requesting this change" value={requestedChangeReason} onChange={e => setRequestedChangeReason(e.target.value)}></textarea>
               </div>
             </div>
             <div className="flex justify-end gap-3 mt-6">
               <Button variant="ghost" onClick={() => setShowRequestChangeModal(false)}>Cancel</Button>
               <Button variant="primary" onClick={handleRequestChange}>Submit Request</Button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
