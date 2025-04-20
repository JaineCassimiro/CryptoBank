import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { ArrowDown, ArrowUp, FileInvoice, RefreshCw } from 'lucide-react';
import { DepositModal } from '@/components/modals/deposit-modal';
import { WithdrawModal } from '@/components/modals/withdraw-modal';
import { TransferModal } from '@/components/modals/transfer-modal';
import { PaymentModal } from '@/components/modals/payment-modal';

export function QuickActions() {
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Heading level={2} className="mb-4">Quick Actions</Heading>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="flex flex-col items-center justify-center bg-pink-50 rounded-lg p-3 hover:bg-pink-100 transition duration-200"
              onClick={() => setDepositModalOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center mb-2">
                <ArrowDown className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-neutral-800">Deposit</span>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center bg-pink-50 rounded-lg p-3 hover:bg-pink-100 transition duration-200"
              onClick={() => setWithdrawModalOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center mb-2">
                <ArrowUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-neutral-800">Withdraw</span>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center bg-pink-50 rounded-lg p-3 hover:bg-pink-100 transition duration-200"
              onClick={() => setTransferModalOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center mb-2">
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-neutral-800">Transfer</span>
            </button>
            
            <button 
              className="flex flex-col items-center justify-center bg-pink-50 rounded-lg p-3 hover:bg-pink-100 transition duration-200"
              onClick={() => setPaymentModalOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center mb-2">
                <FileInvoice className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-neutral-800">Pay</span>
            </button>
          </div>
        </CardContent>
      </Card>
      
      <DepositModal open={depositModalOpen} onOpenChange={setDepositModalOpen} />
      <WithdrawModal open={withdrawModalOpen} onOpenChange={setWithdrawModalOpen} />
      <TransferModal open={transferModalOpen} onOpenChange={setTransferModalOpen} />
      <PaymentModal open={paymentModalOpen} onOpenChange={setPaymentModalOpen} />
    </>
  );
}
