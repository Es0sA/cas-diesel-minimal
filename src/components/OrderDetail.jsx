import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Send, CheckCircle2, 
  Clock, Truck, MapPin, CheckCircle, Package
} from 'lucide-react';
import { api } from '../api';

const TIMELINE_STATES = ['DRAFT', 'FUNDED', 'IN_TRANSIT', 'ARRIVED', 'DELIVERED'];

export default function OrderDetail() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [orderId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [ordersRes, docsRes, chatRes] = await Promise.all([
        api.orders.list(),
        api.compliance.getDocuments(orderId).catch(() => []),
        api.chat.getMessages(orderId).catch(() => ({ messages: [] }))
      ]);

      const foundOrder = ordersRes.find(o => o.id === orderId || o._id === orderId);
      if (!foundOrder) {
        throw new Error('Order not found');
      }

      setOrder(foundOrder);
      setDocuments(Array.isArray(docsRes) ? docsRes : (docsRes.documents || []));
      setMessages(chatRes.messages || []);
    } catch (err) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    try {
      const newMsg = await api.chat.sendMessage(orderId, { messageContent: chatInput });
      setMessages(prev => [...prev, newMsg]);
      setChatInput('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cas-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error: {error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-cas-slate text-white rounded">
          Go Back
        </button>
      </div>
    );
  }

  if (!order) return null;

  const currentStatusIndex = TIMELINE_STATES.indexOf(order.status);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-cas-canvas min-h-screen">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-cas-muted hover:text-cas-slate mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Back to Orders</span>
      </button>

      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-cas-slate flex items-center gap-3">
            Order #{order.id?.slice(0,8).toUpperCase()}
            <span className="text-sm font-bold px-3 py-1 bg-cas-blueLight text-cas-blue rounded-full">
              {order.status}
            </span>
          </h1>
          <p className="text-cas-muted mt-1">Created on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-cas-muted">Total Escrow Amount</p>
          <p className="text-3xl font-extrabold text-cas-slate">₦{(order.totalAmount || 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-cas-border mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-cas-slate mb-6">Status Timeline</h2>
        <div className="relative flex justify-between items-center w-full">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-cas-blue transition-all duration-500 -z-10"
            style={{ width: `${(Math.max(0, currentStatusIndex) / (TIMELINE_STATES.length - 1)) * 100}%` }}
          ></div>
          
          {TIMELINE_STATES.map((status, index) => {
            const isCompleted = currentStatusIndex >= index;
            const isCurrent = currentStatusIndex === index;
            
            return (
              <div key={status} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted ? 'bg-cas-blue text-white' : 'bg-slate-100 text-slate-400'
                } ${isCurrent ? 'ring-4 ring-cas-blueLight' : ''}`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                </div>
                <span className={`text-xs font-bold ${
                  isCurrent ? 'text-cas-blue' : (isCompleted ? 'text-cas-slate' : 'text-slate-400')
                }`}>
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Details */}
          <div className="bg-white p-6 rounded-2xl border border-cas-border shadow-sm">
            <h2 className="text-lg font-bold text-cas-slate mb-4">Order Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-cas-muted mb-1 flex items-center gap-1"><Package className="w-3 h-3" /> Volume</p>
                <p className="font-bold text-cas-slate">{(order.volume || 0).toLocaleString()} Litres</p>
              </div>
              <div>
                <p className="text-xs text-cas-muted mb-1">Price per Litre</p>
                <p className="font-bold text-cas-slate">₦{(order.pricePerLitre || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-cas-muted mb-1 flex items-center gap-1"><Truck className="w-3 h-3" /> Driver</p>
                <p className="font-bold text-cas-slate">{order.driverName || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-cas-muted mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Supplier</p>
                <p className="font-bold text-cas-slate">{order.supplierName || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="bg-white rounded-2xl border border-cas-border shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-cas-border bg-slate-50">
              <h2 className="text-lg font-bold text-cas-slate">Order Chat</h2>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-cas-muted">
                  <p>No messages yet.</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className="flex flex-col bg-slate-50 p-3 rounded-lg border border-slate-100 max-w-[85%] self-start">
                    <span className="text-xs font-bold text-cas-blue mb-1">{msg.senderRole || 'User'}</span>
                    <p className="text-sm text-cas-slate">{msg.messageContent || msg.content}</p>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-cas-border bg-white flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cas-blue focus:border-transparent"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="bg-cas-slate hover:bg-cas-charcoal text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          {/* Documents */}
          <div className="bg-white p-6 rounded-2xl border border-cas-border shadow-sm">
            <h2 className="text-lg font-bold text-cas-slate mb-4">Compliance Documents</h2>
            
            {documents.length === 0 ? (
              <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-cas-muted">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No documents uploaded yet</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {documents.map((doc, i) => (
                  <li key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cas-blueLight rounded text-cas-blue">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-cas-slate">{doc.documentType}</span>
                    </div>
                    {doc.verified ? (
                      <CheckCircle className="w-4 h-4 text-cas-green" />
                    ) : (
                      <span className="text-xs bg-slate-100 text-cas-muted px-2 py-1 rounded">Pending</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
