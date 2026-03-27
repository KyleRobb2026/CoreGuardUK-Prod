import React, { useState, useEffect } from 'react';
import { useSubscription } from './SubscriptionProvider';
import { CreditCard, FileText, AlertTriangle, CheckCircle, Clock, Mail, Building2 } from 'lucide-react';

interface BillingData {
  subscription: any;
  latestInvoice: any;
  canAccessProFeatures: boolean;
  paymentStatus: string;
  invoices: any[];
}

export default function BillingDashboard() {
  const { subscription } = useSubscription();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const response = await fetch('/api/billing/current');
        if (response.ok) {
          const data = await response.json();
          setBillingData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-[#2e2e2e] rounded w-1/4 mb-4"></div>
          <div className="h-3 bg-[#2e2e2e] rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-[#2e2e2e] rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
        <div className="flex items-center gap-3 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <span>Unable to load billing information</span>
        </div>
      </div>
    );
  }

  const { latestInvoice, paymentStatus, invoices } = billingData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'overdue':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Billing Status */}
      <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-[#f7b91c]" />
          <h3 className="text-lg font-semibold text-white">Billing Overview</h3>
        </div>

        {/* Payment Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#676767] text-sm">Payment Status</span>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(paymentStatus)}`}>
              {getStatusIcon(paymentStatus)}
              {paymentStatus}
            </span>
          </div>
          
          {paymentStatus === 'Payment pending' && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-medium mb-1">Invoice Issued</p>
                  <p className="text-[#676767] text-sm">
                    Your invoice has been sent. Pro features will unlock once payment is received.
                  </p>
                </div>
              </div>
            </div>
          )}

          {paymentStatus === 'Overdue - features restricted' && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium mb-1">Payment Overdue</p>
                  <p className="text-[#676767] text-sm">
                    Your payment is overdue. Pro features have been restricted until payment is received.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Latest Invoice */}
        {latestInvoice && (
          <div className="bg-[#1e1e1e] rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Latest Invoice</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#676767]">Reference</span>
                <span className="text-white font-mono">{latestInvoice.referenceNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#676767]">Amount</span>
                <span className="text-white">£{latestInvoice.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#676767]">Plan</span>
                <span className="text-white capitalize">{latestInvoice.plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#676767]">Due Date</span>
                <span className="text-white">
                  {new Date(latestInvoice.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#676767]">Status</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(latestInvoice.status)}`}>
                  {getStatusIcon(latestInvoice.status)}
                  {latestInvoice.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice History */}
      {invoices && invoices.length > 0 && (
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-[#f7b91c]" />
            <h3 className="text-lg font-semibold text-white">Invoice History</h3>
          </div>

          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-[#1e1e1e] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">{invoice.referenceNumber}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          {invoice.status}
                        </span>
                      </div>
                      <div className="text-[#676767] text-sm">
                        {invoice.plan.charAt(0).toUpperCase() + invoice.plan.slice(1)} Plan • 
                        Due {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">£{invoice.amount.toFixed(2)}</div>
                    <div className="text-[#676767] text-xs">
                      {new Date(invoice.issuedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Instructions */}
      {latestInvoice && latestInvoice.status === 'pending' && (
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-[#f7b91c]" />
            <h3 className="text-lg font-semibold text-white">Payment Instructions</h3>
          </div>

          <div className="bg-[#1e1e1e] rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Bank Transfer</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#676767]">Account Name:</span>
                <span className="text-white">CoreGuard UK Limited</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#676767]">Sort Code:</span>
                <span className="text-white font-mono">12-34-56</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#676767]">Account Number:</span>
                <span className="text-white font-mono">12345678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#676767]">Reference:</span>
                <span className="text-white font-mono">{latestInvoice.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#676767]">Amount:</span>
                <span className="text-white">£{latestInvoice.amount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#2e2e2e]">
              <p className="text-[#676767] text-sm">
                Please include the reference number in your payment. Features will be unlocked automatically once payment is received.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
