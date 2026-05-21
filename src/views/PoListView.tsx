import React, { useState } from 'react';
import { ViewState } from '../types';
import { Card, Badge, Button } from '../components/ui';
import { Filter, Search, Download, Settings2, Package, Clock, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../App';

interface Props {
  onNavigate: (view: ViewState) => void;
}

export default function PoListView({ onNavigate }: Props) {
  const { pos } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'action' | 'transit'>('all');

  const filteredPOs = pos.filter(po => {
    if (filter === 'action') return po.status === 'Pending Ack.' || po.status === 'Readiness Req.' || po.status === 'Amended';
    if (filter === 'transit') return po.status === 'In Transit' || po.status === 'Delivered';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search POs, Items..."
              className="w-full bg-[var(--color-card)] border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] shadow-sm"
            />
          </div>
          <div className="flex bg-[var(--color-card)] border border-gray-200 shadow-sm rounded-lg p-1">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-md transition-colors ${filter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              All POs
            </button>
            <button 
              onClick={() => setFilter('action')}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-md transition-colors flex items-center gap-1 ${filter === 'action' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-500 hover:text-yellow-600'}`}
            >
              <ShieldAlert size={12} />
              Action Needed
            </button>
            <button 
              onClick={() => setFilter('transit')}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-md transition-colors flex items-center gap-1 ${filter === 'transit' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-blue-600'}`}
            >
              <Package size={12} />
              In Transit
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="md">
            <Filter size={16} />
            Filters
          </Button>
          <Button variant="ghost" size="md">
            <Settings2 size={16} />
            Columns
          </Button>
          <Button variant="ghost" size="md">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Tabe List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-4 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">PO Details</th>
                <th className="px-5 py-4 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">Items / Value</th>
                <th className="px-5 py-4 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">Status & SLA</th>
                <th className="px-5 py-4 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">Logistics</th>
                <th className="px-5 py-4 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPOs.map(po => (
                <tr 
                  key={po.id} 
                  className={`hover:bg-gray-50 cursor-pointer transition-colors group ${
                    po.status === 'Pending Ack.' ? 'bg-yellow-50/50' : ''
                  }`}
                  onClick={() => onNavigate({ page: 'po-detail', poId: po.id })}
                >
                  <td className="px-5 py-4">
                    <div className="font-mono text-xs text-gray-900 font-bold mb-1 group-hover:text-[var(--color-primary)] transition-colors">{po.id}</div>
                    <div className="text-[11px] text-gray-500">{po.description}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-bold text-gray-800 mb-0.5">{po.qty.toLocaleString()} units</div>
                    <div className="text-[11px] text-gray-400 font-mono">${po.value.toLocaleString()}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="mb-2">
                       <Badge 
                          variant={
                            po.status === 'Confirmed' || po.status === 'Booked' ? 'green' : 
                            po.status === 'Delivered' || po.status === 'Closed' ? 'gray' :
                            po.status === 'Pending Ack.' ? 'red' :
                            po.status === 'Readiness Req.' || po.status === 'Amended' ? 'amber' : 'blue'
                          }
                        >
                          {po.status}
                        </Badge>
                    </div>
                    {po.sla && (
                      <div className={`flex items-center gap-1 text-[10px] font-mono font-bold ${
                        po.status === 'Pending Ack.' || po.status === 'Readiness Req.' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                         <Clock size={10} />
                         {po.sla}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs text-gray-500 mb-0.5"><strong className="text-gray-900">Delivery:</strong> {po.requiredDelivery}</div>
                    <div className="flex gap-2 text-[10px] text-gray-400 font-mono">
                      <span>{po.incoterms}</span>
                      <span>·</span>
                      <span>{po.mode}</span>
                      <span>·</span>
                      <span>{po.origin}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onNavigate({ page: 'po-detail', poId: po.id }); }}>View Details</Button>
                  </td>
                </tr>
              ))}
              {filteredPOs.length === 0 && (
                 <tr>
                   <td colSpan={5} className="px-5 py-12 text-center text-gray-500 text-sm">
                     No purchase orders found matching your filters.
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
    </div>
  );
}
