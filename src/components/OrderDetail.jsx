import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Send, CheckCircle2, 
  Clock, Truck, MapPin, CheckCircle, Package
} from 'lucide-react';
import { api } from '../api';
import ReviewForm from './ReviewForm';
import DeliveryPanel from './DeliveryPanel';
import { usePageTitle } from '../lib/usePageTitle';

const TIMELINE_STATES = ['DRAFT', 'FUNDED', 'IN_TRANSIT', 'ARRIVED', 'SETTLING', 'DELIVERED'];
const STATE_LABELS = { SETTLING: 'VERIFIED' };

export default function OrderDetail() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  usePageTitle('Order Details', 'Track delivery status, chat with your counterparty, and manage escrow on your CAS Diesel order.');
  
  const [order, setOrder] = useState(null);
  const [viewerRole, setViewerRole] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const fetchData = async (silent = false) => {
    try {
      if (silent !== true) setLoading(true);
      setError(null);
      
      const [orderRes, docsRes, chatRes] = await Promise.all([
        api.orders.get(orderId),
        api.compliance.getDocuments(orderId).catch(() => []),
        api.chat.getMessages(orderId).catch(() => ({ messages: [] }))
      ]);

      const foundOrder = orderRes?.order || orderRes;
      if (!foundOrder) {
        throw new Error('Order not found');
      }

      setViewerRole(orderRes.role || null);
      setOrder(foundOrder);
      setDocuments(Array.isArray(docsRes) ? docsRes : (docsRes.documents || []));
      setMessages(chatRes.messages || []);
    } catch (err) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orderId]);

  useEffect(() => {
    const panel = chatEndRef.current?.parentElement;
    if (panel) panel.scrollTop = panel.scrollHeight;
  }, [messages]);

  const handleOverdueCancel = async () => {
    if (!window.confirm('The supplier missed a deadline. Cancel this order and refund the escrow in full?')) return;
    try {
      await api.orders.cancel(orderId, { reason: order.overdueFlag });
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleWaybill = async () => {
    try {
      await api.orders.downloadWaybill(orderId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDispute = async () => {
    const reason = window.prompt("Enter reason for dispute (Quality, Shortage, Delay):");
    if (!reason) return;
    try {
      setLoading(true);
      await api.orders.dispute(orderId, { reason });
      await fetchData();
    } catch (err) {
      alert('Failed to file dispute: ' + err.message);
      setLoading(false);
    }
  };

  const mergeMessages = (incoming) => {
    if (!incoming.length) return;
    setMessages((prev) => {
      const seen = new Set(prev.map((m) => m.id));
      const fresh = incoming.filter((m) => !seen.has(m.id));
      return fresh.length ? [...prev, ...fresh] : prev;
    });
  };

  // Poll for new messages every 5 seconds while the tab is visible
  useEffect(() => {
    const timer = setInterval(async () => {
      if (document.hidden || !orderId) return;
      const last = messages[messages.length - 1];
      try {
        const res = await api.chat.getMessages(orderId, last?.createdAt);
        mergeMessages(res.messages || []);
      } catch {
        // transient network error, try again on the next tick
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [orderId, messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    try {
      const res = await api.chat.sendMessage(orderId, { messageContent: chatInput });
      mergeMessages([res.chatMessage]);
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
              {STATE_LABELS[order.status] || order.status}
            </span>
          </h1>
          <p className="text-cas-muted mt-1">Created on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className="text-left md:text-right flex flex-col items-start md:items-end">
          <p className="text-sm text-cas-muted">Total Escrow Amount</p>
          <p className="text-3xl font-extrabold text-cas-slate">₦{(order.totalEscrowAmount ?? order.totalAmount ?? 0).toLocaleString()}</p>
          {order.status !== 'DRAFT' && (
            <button
              onClick={handleWaybill}
              className="mt-3 px-4 py-2 bg-white hover:bg-slate-50 text-cas-slate border border-slate-300 text-sm font-bold rounded-lg transition-colors"
            >
              Download Waybill (PDF)
            </button>
          )}
          {viewerRole === 'BUYER' && order.overdueFlag && ['FUNDED', 'IN_TRANSIT', 'ARRIVED'].includes(order.status) && (
            <button
              onClick={handleOverdueCancel}
              className="mt-3 px-4 py-2 bg-white hover:bg-slate-50 text-cas-slate border border-slate-300 text-sm font-bold rounded-lg transition-colors"
            >
              Cancel and refund (deadline missed)
            </button>
          )}
          {viewerRole === 'BUYER' && ['FUNDED', 'IN_TRANSIT', 'ARRIVED'].includes(order.status) && (
            <button 
              onClick={handleDispute}
              className="mt-3 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              File Dispute
            </button>
          )}
        </div>
      </div>

      {viewerRole === 'VENDOR' && !['CANCELLED', 'DELIVERED'].includes(order.status) && order.delivery && (order.delivery.receiverName || order.delivery.receiverPhone || order.delivery.deliveryAddress || order.delivery.city) && (
        <section className="bg-white p-5 rounded-2xl border border-slate-200 mb-8 shadow-sm">
          <h2 className="text-base font-bold text-cas-slate mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-cas-amberDark" aria-hidden="true" /> Deliver to</h2>
          <dl className="grid sm:grid-cols-3 gap-4 text-sm">
            <div><dt className="text-xs font-bold text-cas-muted">Receiver</dt><dd className="mt-0.5 text-cas-slate">{order.delivery.receiverName || 'Not given'}</dd></div>
            <div><dt className="text-xs font-bold text-cas-muted">Phone</dt><dd className="mt-0.5 text-cas-slate">{order.delivery.receiverPhone ? <a href={`tel:${order.delivery.receiverPhone.replace(/\s/g, '')}`} className="underline underline-offset-2">{order.delivery.receiverPhone}</a> : 'Not given'}</dd></div>
            <div><dt className="text-xs font-bold text-cas-muted">Address</dt><dd className="mt-0.5 text-cas-slate break-words">{[order.delivery.deliveryAddress, [order.delivery.city, order.delivery.state].filter(Boolean).join(', ')].filter(Boolean).join(', ') || 'Not given'}</dd></div>
          </dl>
        </section>
      )}

      {order.lastLatitude != null && ['IN_TRANSIT', 'ARRIVED'].includes(order.status) && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-8 shadow-sm flex items-center justify-between gap-3 text-sm">
          <div>
            <span className="font-bold text-cas-slate block">Truck location</span>
            <span className="text-cas-muted">Last updated {new Date(order.lastLocationAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <a
            href={`https://maps.google.com/?q=${order.lastLatitude},${order.lastLongitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-cas-slate text-white text-xs font-bold rounded-lg"
          >
            View on map
          </a>
        </div>
      )}

      <DeliveryPanel order={order} viewerRole={viewerRole} onChanged={() => fetchData(true)} />

      <ReviewForm order={order} onSubmitted={() => fetchData(true)} />

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
              <div key={status} className="flex flex-col items-center gap-2 bg-white px-1 sm:px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted ? 'bg-cas-blue text-white' : 'bg-slate-100 text-slate-500'
                } ${isCurrent ? 'ring-4 ring-cas-blueLight' : ''}`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                </div>
                <span className={`hidden sm:block text-xs font-bold ${
                  isCurrent ? 'text-cas-blue' : (isCompleted ? 'text-cas-slate' : 'text-slate-500')
                }`}>
                  {(STATE_LABELS[status] || status).replace('_', ' ')}
                </span>
                <span className="sr-only sm:hidden">{(STATE_LABELS[status] || status).replace('_', ' ')}{isCurrent ? ' (current)' : ''}</span>
              </div>
            );
          })}
        </div>
        <p className="sm:hidden mt-4 text-center text-sm font-bold text-cas-blue">
          {order.status.replace('_', ' ')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Details */}
          <div className="bg-white p-6 rounded-2xl border border-cas-border shadow-sm">
            <h2 className="text-lg font-bold text-cas-slate mb-4">Order Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-cas-muted mb-1 flex items-center gap-1"><Package className="w-3 h-3" aria-hidden="true" /> Volume</p>
                <p className="font-bold text-cas-slate">{(order.volumeLiters || 0).toLocaleString()} Litres</p>
              </div>
              <div>
                <p className="text-xs text-cas-muted mb-1">Price per Litre</p>
                <p className="font-bold text-cas-slate">₦{(order.pricePerLiter || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-cas-muted mb-1 flex items-center gap-1"><Truck className="w-3 h-3" aria-hidden="true" /> Driver</p>
                <p className="font-bold text-cas-slate break-words">
                  {order.driver ? `${order.driver.firstName} ${order.driver.lastName}` : 'Unassigned'}
                </p>
                {order.driver?.truckPlateNumber && <p className="text-xs font-mono text-cas-muted">{order.driver.truckPlateNumber}</p>}
              </div>
              <div>
                <p className="text-xs text-cas-muted mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" aria-hidden="true" /> {order.supplier ? 'Supplier' : 'Buyer'}</p>
                <p className="font-bold text-cas-slate break-words">{(order.supplier || order.buyer)?.companyName || 'Unknown'}</p>
              </div>
            </div>
            {order.disputeReason && (
              <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm">
                <p className="font-bold text-rose-700 mb-1">Dispute reason</p>
                <p className="text-slate-700 break-words">{order.disputeReason}</p>
                {order.disputeResolution && (
                  <p className="mt-2 font-bold text-slate-700">Resolution: {order.disputeResolution.replace(/_/g, ' ').toLowerCase()}</p>
                )}
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="bg-white rounded-2xl border border-cas-border shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-cas-border bg-slate-50">
              <h2 className="text-lg font-bold text-cas-slate">Order Chat</h2>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4" role="log" aria-label="Order chat messages" tabIndex={0}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-cas-muted">
                  <p>No messages yet.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col p-3 rounded-lg border max-w-[85%] ${msg.mine ? 'bg-blue-50 border-blue-100 self-end' : 'bg-slate-50 border-slate-100 self-start'}`}
                  >
                    <span className="text-xs font-bold text-cas-blue mb-1">{msg.mine ? 'You' : msg.senderRole || 'User'}</span>
                    <p className="text-sm text-cas-slate whitespace-pre-wrap break-words">{msg.messageContent}</p>
                    <span className="text-xs text-cas-muted mt-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                aria-label="Send message"
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
                {documents.map((doc, i) => {
                  const canOpen = !(doc.source === 'KYC' && !['DRIVER', 'ADMIN'].includes(viewerRole));
                  const open = async () => {
                    try {
                      const { url } = await api.compliance.documentUrl(orderId, doc.id);
                      window.open(url, '_blank', 'noopener,noreferrer');
                    } catch (err) {
                      alert(err.message);
                    }
                  };
                  const Row = canOpen ? 'button' : 'div';
                  return (
                    <li key={doc.id || i}>
                      <Row {...(canOpen ? { type: 'button', onClick: open } : {})} className={`w-full text-left flex items-center justify-between gap-2 p-3 border border-slate-100 rounded-lg transition-colors ${canOpen ? 'hover:border-slate-300 cursor-pointer' : ''}`}>
                        <span className="flex items-center gap-3 min-w-0">
                          <span className="p-2 bg-cas-blueLight rounded text-cas-blue shrink-0"><FileText className="w-4 h-4" /></span>
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-cas-slate break-words">{doc.documentType.replace(/_/g, ' ')}</span>
                            {doc.fileName && <span className="block text-xs text-cas-muted truncate">{doc.fileName}</span>}
                          </span>
                        </span>
                        <span className="text-xs bg-slate-100 text-cas-muted px-2 py-1 rounded shrink-0">{canOpen ? 'Open' : 'On file'}</span>
                      </Row>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
