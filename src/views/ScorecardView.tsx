import React, { useState } from 'react';
import { ViewState } from '../types';
import { Card, CardTitle, Badge, Button } from '../components/ui';
import { TrendingUp, Clock, PackageCheck, AlertOctagon, ThumbsUp, ShieldCheck, X } from 'lucide-react';

interface Props {
  onNavigate: (view: ViewState) => void;
}

const carriers = [
  { id: 'DHL', name: 'DHL' },
  { id: 'FEDEX', name: 'FedEx Express' },
  { id: 'DACHSER', name: 'Dachser' },
  { id: 'GW', name: 'Gebrüder Weiss' },
  { id: 'KWE', name: 'KINTETSU WORLD EXPRESS' },
];

export default function ScorecardView({ onNavigate }: Props) {
  const [activeMetric, setActiveMetric] = useState<{ id: string, title: string, target: string } | null>(null);

  const renderCarrierMetric = (carrierId: string) => {
    switch (activeMetric?.id) {
      case 'otif':
        const otifScores: Record<string, string> = { 'DHL': '98.5%', 'FEDEX': '92.1%', 'DACHSER': '96.2%', 'GW': '88.4%', 'KWE': '99.5%' };
        return <span className="font-extrabold text-[var(--color-primary)]">{otifScores[carrierId] || '95.0%'}</span>;
      case 'poAck':
        const ackScores: Record<string, string> = { 'DHL': '1.2h', 'FEDEX': '3.4h', 'DACHSER': '2.8h', 'GW': '6.5h', 'KWE': '0.5h' };
        return <span className="font-extrabold text-[var(--color-primary)]">{ackScores[carrierId] || '2.0h'}</span>;
      case 'readiness':
        const leadScores: Record<string, string> = { 'DHL': '5.2d', 'FEDEX': '6.1d', 'DACHSER': '7.2d', 'GW': '8.5d', 'KWE': '4.1d' };
        return <span className="font-extrabold text-[var(--color-primary)]">{leadScores[carrierId] || '6.0d'}</span>;
      case 'docQual':
        const docScores: Record<string, string> = { 'DHL': '99.8%', 'FEDEX': '97.5%', 'DACHSER': '99.1%', 'GW': '92.0%', 'KWE': '100%' };
        return <span className="font-extrabold text-[var(--color-primary)]">{docScores[carrierId] || '98.0%'}</span>;
      default:
        return '-';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl font-extrabold text-gray-900 font-sans mb-1">Supplier Scorecard</h1>
           <p className="text-[13px] text-gray-500">Aggregate Performance metrics (All Partners)</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Overall Rating</div>
              <div className="text-[13px] font-bold text-[var(--color-primary)]">Strategic Partner</div>
           </div>
           <div className="w-10 h-10 rounded-full bg-[var(--color-primary-dim)] flex items-center justify-center border border-[var(--color-primary)]/30 text-[var(--color-primary)]">
              <ShieldCheck size={20} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         
         {/* OTIF Rate */}
         <Card className="p-6 relative overflow-hidden group border-l-4 border-[var(--color-primary)] cursor-pointer hover:shadow-md transition-all" onClick={() => setActiveMetric({ id: 'otif', title: 'OTIF Rate (On Time In Full)', target: '≥ 95%' })}>
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-gray-900 group-hover:scale-110 transition-transform">
               <TrendingUp size={80} />
            </div>
            <CardTitle className="text-gray-900 mb-6">OTIF Rate (On Time In Full)</CardTitle>
            <div className="flex items-end gap-4 mb-2">
               <div className="text-5xl font-extrabold text-gray-900 font-sans tracking-tight">96.2<span className="text-3xl text-gray-400">%</span></div>
               <div className="flex items-center gap-1 text-[13px] font-bold text-[var(--color-primary)] pb-1.5">
                  <TrendingUp size={16} /> +1.4%
               </div>
            </div>
            <div className="text-[11px] text-gray-500 mt-2">vs last month · <strong className="text-gray-900">Target: ≥ 95%</strong></div>
            <div className="mt-6">
               <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--color-primary)] h-full" style={{ width: '96.2%' }}></div>
               </div>
            </div>
         </Card>

         {/* PO Ack SLA */}
         <Card className="p-6 relative overflow-hidden group cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-gray-200" onClick={() => setActiveMetric({ id: 'poAck', title: 'PO Acknowledgment SLA', target: '< 4h' })}>
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-gray-900 group-hover:scale-110 transition-transform">
               <Clock size={80} />
            </div>
            <CardTitle className="text-gray-900 mb-6">PO Acknowledgment SLA</CardTitle>
            <div className="flex items-end gap-3 mb-2">
               <div className="text-5xl font-extrabold text-gray-900 font-sans tracking-tight">2.8<span className="text-3xl text-gray-400">h</span></div>
            </div>
            <div className="text-[11px] text-gray-500 mt-3 pt-1 border-t border-gray-200 flex items-center gap-2">
               Target: {'<'} 4h <Badge variant="green" className="ml-2 py-0">Achieved</Badge>
            </div>
         </Card>

         {/* Readiness Lead */}
         <Card className="p-6 relative overflow-hidden group cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-gray-200" onClick={() => setActiveMetric({ id: 'readiness', title: 'Readiness Lead Time', target: '6 Days' })}>
             <div className="absolute top-0 right-0 p-6 opacity-10 text-yellow-500 group-hover:scale-110 transition-transform">
               <PackageCheck size={80} />
            </div>
            <CardTitle className="text-gray-900 mb-6">Readiness Lead Time</CardTitle>
            <div className="flex items-end gap-3 mb-2">
               <div className="text-5xl font-extrabold text-gray-900 font-sans tracking-tight">7.2<span className="text-3xl text-gray-400">d</span></div>
               <div className="flex items-center gap-1 text-[13px] font-bold text-red-500 pb-1.5">
                  <AlertOctagon size={16} /> +1.1d
               </div>
            </div>
            <div className="text-[11px] text-gray-500 mt-3 pt-1 border-t border-gray-200 flex items-center gap-2">
               Target: 6 Days <Badge variant="red" className="ml-2 py-0">Needs Attention</Badge>
            </div>
         </Card>

         {/* Document Quality */}
         <Card className="p-6 relative overflow-hidden group cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-gray-200" onClick={() => setActiveMetric({ id: 'docQual', title: 'First Pass Document Quality', target: 'N/A' })}>
             <div className="absolute top-0 right-0 p-6 opacity-10 text-blue-500 group-hover:scale-110 transition-transform">
               <ThumbsUp size={80} />
            </div>
            <CardTitle className="text-gray-900 mb-6">First Pass Document Quality</CardTitle>
            <div className="flex items-end gap-4 mb-2">
               <div className="text-5xl font-extrabold text-gray-900 font-sans tracking-tight">99.1<span className="text-3xl text-gray-400">%</span></div>
               <div className="flex items-center gap-1 text-[13px] font-bold text-[var(--color-primary)] pb-1.5">
                  <TrendingUp size={16} /> +0.2%
               </div>
            </div>
            <div className="text-[11px] text-gray-500 mt-3 pt-1 border-t border-gray-200">
               <span className="text-gray-900 font-medium">1</span> compliance rejection in the last 30 days
            </div>
         </Card>

      </div>

      {activeMetric && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 relative">
             <div className="bg-gray-50 border-b border-gray-200 p-5 flex justify-between items-center shrink-0">
               <div>
                 <h2 className="text-lg font-extrabold text-gray-900 font-sans">{activeMetric.title} Breakdown</h2>
                 <p className="text-xs text-gray-500 mt-0.5">Carrier performance metric distribution.</p>
               </div>
               <div className="flex items-center gap-3">
                 <button onClick={() => setActiveMetric(null)} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors">
                   <X size={16} />
                 </button>
               </div>
             </div>

             <div className="p-0 overflow-y-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white sticky top-0 z-10 border-b border-gray-100">
                     <tr>
                        <th className="font-bold text-[10px] uppercase tracking-wider text-gray-500 px-5 py-3">Partner / Carrier</th>
                        <th className="font-bold text-[10px] uppercase tracking-wider text-gray-500 px-5 py-3 text-right">Score</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {carriers.map(carrier => (
                        <tr key={carrier.id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-5 py-4 font-semibold text-gray-900">{carrier.name}</td>
                           <td className="px-5 py-4 text-right text-lg">
                              {renderCarrierMetric(carrier.id)}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
             
             <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                 <span className="text-[11px] text-gray-500">Target: <strong>{activeMetric.target}</strong></span>
                 <Button variant="ghost" size="sm" onClick={() => setActiveMetric(null)}>Close</Button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
