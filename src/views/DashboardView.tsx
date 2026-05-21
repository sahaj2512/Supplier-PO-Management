import React from 'react';
import { ViewState } from '../types';
import { Card, CardTitle, Alert, Button, Badge } from '../components/ui';
import { mockActions } from '../data';
import { useAppContext } from '../App';
import { ArrowRight, AlertCircle, PackageCheck, FileText, ChevronRight } from 'lucide-react';

interface Props {
  onNavigate: (view: ViewState) => void;
}

export default function DashboardView({ onNavigate }: Props) {
  const { pos } = useAppContext();
  
  const KpiCard = ({ label, value, sub, color }: { label: string, value: string, sub: string, color: 'green' | 'amber' | 'red' | 'blue' | 'vat' }) => {
    const borders = {
      vat: 'border-l-4 border-[var(--color-primary)]',
      amber: 'border-l-4 border-yellow-500',
      red: 'border-l-4 border-red-500',
      blue: 'border-l-4 border-blue-500',
      green: 'border-l-4 border-green-500',
    };
    
    return (
      <div className={`bg-[var(--color-card)] shadow-sm border border-gray-200 border-l-4 rounded-r-lg p-5 ${borders[color]}`}>
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-bold mb-1">{label}</p>
        <div className="flex items-end gap-3 mb-1">
          <span className="text-2xl font-bold tracking-tighter text-gray-900 font-sans">{value}</span>
        </div>
        <p className="text-[10px] text-gray-500 italic font-medium">{sub}</p>
      </div>
    );
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'urgency': return <AlertCircle size={18} className="text-red-400" />;
      case 'readiness': return <PackageCheck size={18} className="text-amber-400" />;
      case 'document': return <FileText size={18} className="text-blue-400" />;
      default: return <AlertCircle size={18} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard label="Pending Ack." value="2" sub="SLA active on both" color="amber" />
        <KpiCard label="Open POs" value="12" sub="Active & in progress" color="vat" />
        <KpiCard label="Readiness Due" value="2" sub="Within 10 days" color="amber" />
        <KpiCard label="PO Amendments" value="2" sub="Re-confirmation needed" color="blue" />
        <KpiCard label="Missing Docs" value="1" sub="COO upload pending" color="red" />
        <KpiCard label="OTIF (MTD)" value="96.2%" sub="Target ≥ 95% ✓" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Col: PO Summary */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              <h2 className="text-[13px] font-extrabold font-sans text-gray-900">Recent POs</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate({ page: 'pos' })}>
              See All <ArrowRight size={14} />
            </Button>
          </div>
          
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">PO Number</th>
                    <th className="px-4 py-3 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">Delivery</th>
                    <th className="px-4 py-3 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pos.slice(0, 5).map(po => (
                    <tr 
                      key={po.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                        po.status === 'Pending Ack.' ? 'bg-yellow-50' : ''
                      }`}
                      onClick={() => onNavigate({ page: 'po-detail', poId: po.id })}
                    >
                      <td className="px-4 py-3">
                        <div className="font-mono text-[11px] text-gray-900 font-bold mb-0.5">{po.id}</div>
                        <div className="text-[10px] text-gray-500 truncate max-w-[120px]">{po.description}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 font-medium">{po.requiredDelivery}</td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant={
                            po.status === 'Confirmed' || po.status === 'Booked' ? 'green' : 
                            po.status === 'Pending Ack.' ? 'red' :
                            po.status === 'Readiness Req.' || po.status === 'Amended' ? 'amber' : 'blue'
                          }
                        >
                          {po.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Col: Immediate Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h2 className="text-[13px] font-extrabold font-sans text-gray-900">Immediate Actions</h2>
          </div>
          <Alert variant="red" className="mb-0">
            <span className="text-base leading-none">🔴</span>
            <div>
              You have <strong className="font-bold text-red-900">3 open actions</strong> requiring immediate response.
            </div>
          </Alert>

          <Card className="border-gray-200">
            <div className="divide-y divide-gray-100">
              {mockActions.map((action, idx) => (
                <div key={action.id} className={`flex gap-3 p-4 hover:bg-gray-50 transition-colors ${idx === 0 ? 'bg-red-50/50' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    action.type === 'urgency' ? 'bg-red-100 text-red-600' :
                    action.type === 'readiness' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {getActionIcon(action.type)}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="text-xs font-bold text-gray-800 mb-0.5 truncate">{action.title}</div>
                    <div className="text-[11px] text-gray-500 mb-1.5">{action.description}</div>
                    <div className="text-[10px] text-gray-400 font-mono flex items-center gap-2">
                      <span className={action.type==='urgency' ? 'text-red-600 font-semibold' : ''}>{action.deadline}</span>
                    </div>
                  </div>
                  <div className="pt-1 flex items-start">
                    <Button 
                      variant={action.type === 'urgency' ? 'primary' : action.type === 'readiness' ? 'amber' : 'ghost'} 
                      size="sm"
                      onClick={() => onNavigate({ page: 'po-detail', poId: action.poId })}
                    >
                      {action.actionText}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
