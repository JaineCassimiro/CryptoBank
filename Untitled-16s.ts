import { Card, CardContent } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Shield } from 'lucide-react';
import { formatCurrency, maskAccountNumber } from '@/lib/crypto';
import { useQuery } from '@tanstack/react-query';
import { Account } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export function AccountSummary() {
  const { data: account, isLoading, error } = useQuery<Account>({
    queryKey: ['/api/account'],
  });

  if (isLoading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="mb-6">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !account) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardContent className="p-6">
          <Heading level={2} className="mb-4">Account Summary</Heading>
          <p className="text-neutral-500">Error loading account data. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Heading level={2}>Account Summary</Heading>
          <div className="flex items-center text-sm text-neutral-500">
            <Shield className="h-4 w-4 text-pink-500 mr-2" />
            <span>Encrypted</span>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-neutral-500 mb-1">Available Balance</p>
          <p className="font-heading font-bold text-3xl text-neutral-800">
            {formatCurrency(account.balance.toString())}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
          <div className="flex-1">
            <p className="text-sm text-neutral-500 mb-1">Account Number</p>
            <p className="font-mono text-neutral-800">
              {maskAccountNumber(account.accountNumber, 4)}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-neutral-500 mb-1">Branch</p>
            <p className="font-mono text-neutral-800">{account.branch}</p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-neutral-500 mb-1">Account Type</p>
            <p className="font-mono text-neutral-800">{account.type}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
