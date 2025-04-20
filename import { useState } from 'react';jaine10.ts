import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Transaction } from '@shared/schema';
import { Heading } from '@/components/ui/heading';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { 
  ArrowDown, 
  ArrowUp, 
  FileInvoice, 
  Filter, 
  ChevronDown,
  Loader2,
  ShoppingCart,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '@/lib/crypto';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

// Number of transactions per page
const PAGE_SIZE = 5;

export function TransactionHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionTypes, setTransactionTypes] = useState({
    deposit: true,
    withdrawal: true,
    transfer: true,
    payment: true,
  });
  const [period, setPeriod] = useState('7days');

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });

  // Filter transactions based on selected types
  const filteredTransactions = transactions?.filter(transaction => 
    transactionTypes[transaction.type as keyof typeof transactionTypes]
  ) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginatedTransactions = filteredTransactions.slice(start, end);

  // Icon mapping for transaction types
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'transfer':
        return <RefreshCw className="h-4 w-4 text-red-500" />;
      case 'payment':
        return <FileInvoice className="h-4 w-4 text-red-500" />;
      default:
        return <ShoppingCart className="h-4 w-4 text-red-500" />;
    }
  };

  // Format date for display
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div id="transactions" className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <Heading level={2}>Transaction History</Heading>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-pink-500" />
              <span>Filter</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="px-2 py-2">
              <p className="text-sm font-medium mb-1">Period</p>
              <DropdownMenuCheckboxItem
                checked={period === '7days'}
                onCheckedChange={() => setPeriod('7days')}
              >
                Last 7 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={period === '30days'}
                onCheckedChange={() => setPeriod('30days')}
              >
                Last 30 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={period === '90days'}
                onCheckedChange={() => setPeriod('90days')}
              >
                Last 90 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={period === 'custom'}
                onCheckedChange={() => setPeriod('custom')}
              >
                Custom
              </DropdownMenuCheckboxItem>
            </div>
            
            <DropdownMenuSeparator />
            
            <div className="px-2 py-2">
              <p className="text-sm font-medium mb-1">Type</p>
              <DropdownMenuCheckboxItem
                checked={transactionTypes.deposit}
                onCheckedChange={(checked) => 
                  setTransactionTypes(prev => ({ ...prev, deposit: !!checked }))
                }
              >
                Deposits
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={transactionTypes.withdrawal}
                onCheckedChange={(checked) => 
                  setTransactionTypes(prev => ({ ...prev, withdrawal: !!checked }))
                }
              >
                Withdrawals
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={transactionTypes.transfer}
                onCheckedChange={(checked) => 
                  setTransactionTypes(prev => ({ ...prev, transfer: !!checked }))
                }
              >
                Transfers
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={transactionTypes.payment}
                onCheckedChange={(checked) => 
                  setTransactionTypes(prev => ({ ...prev, payment: !!checked }))
                }
              >
                Payments
              </DropdownMenuCheckboxItem>
            </div>
            
            <DropdownMenuSeparator />
            
            <div className="p-2">
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => setCurrentPage(1)}
              >
                Apply Filters
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead className="text-neutral-500 uppercase text-xs tracking-wider">Date</TableHead>
                <TableHead className="text-neutral-500 uppercase text-xs tracking-wider">Description</TableHead>
                <TableHead className="text-neutral-500 uppercase text-xs tracking-wider">Category</TableHead>
                <TableHead className="text-neutral-500 uppercase text-xs tracking-wider text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-pink-50/10' : ''}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded-full mr-3" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-neutral-500">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction, index) => (
                  <TableRow key={transaction.id} className={index % 2 === 0 ? 'bg-pink-50/10' : ''}>
                    <TableCell className="text-sm text-neutral-800">
                      {formatDate(transaction.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-neutral-800">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-8 h-8 mr-3 rounded-full ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-100' 
                            : 'bg-red-100'
                        } flex items-center justify-center`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.type === 'deposit' ? 'Deposit received' :
                             transaction.type === 'withdrawal' ? 'Withdrawal' :
                             transaction.type === 'transfer' ? 'Transfer sent' :
                             'Payment'}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {transaction.description || (
                              transaction.recipient ? `To: ${transaction.recipient}` : ''
                            )}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-neutral-800">
                      <Badge variant="secondary" className="bg-pink-50 hover:bg-pink-100 text-pink-500">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-sm font-medium text-right ${
                      transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.type === 'deposit' ? '+ ' : '- '}
                      {formatCurrency(transaction.amount.toString())}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {!isLoading && filteredTransactions.length > 0 && (
          <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-neutral-500">
                  Showing <span className="font-medium">{start + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(end, filteredTransactions.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredTransactions.length}</span> transactions
                </p>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {totalPages > 3 && (
                    <>
                      {currentPage > 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      {currentPage > 3 && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(currentPage);
                            }}
                            isActive={true}
                          >
                            {currentPage}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      
                      {currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      {totalPages > 3 && currentPage < totalPages - 1 && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(totalPages);
                            }}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                    </>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
            
            <div className="flex sm:hidden justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
