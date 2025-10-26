
'use client';

import * as React from 'react';
import Link from 'next/link';
import { PlusCircle, ListFilter } from 'lucide-react';
import { collection, query, orderBy } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';

export default function TransactionsPage() {
  const firestore = useFirestore();
  const [filter, setFilter] = React.useState<string[]>(['Deposit', 'Withdrawal', 'Transfer']);

  const transactionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'transactions'), orderBy('transactionDate', 'desc'));
  }, [firestore]);
  
  const { data: allTransactions, isLoading: transactionsLoading } = useCollection(transactionsQuery);

  const customersRef = useMemoFirebase(() => firestore ? collection(firestore, 'customers') : null, [firestore]);
  const { data: customers, isLoading: customersLoading } = useCollection(customersRef);
  
  const filteredTransactions = React.useMemo(() => {
    if (!allTransactions || !customers) return [];
    
    return allTransactions
      .filter(tx => filter.includes(tx.type))
      .map(tx => {
        const customer = customers.find(c => c.id === tx.customerId);
        const txDate = tx.transactionDate?.toDate ? tx.transactionDate.toDate() : new Date();
        return {
          ...tx,
          customerName: customer?.fullName || 'Unknown',
          customerNik: customer?.nik || 'N/A',
          formattedDate: txDate.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
        };
    });
  }, [allTransactions, customers, filter]);

  const handleFilterChange = (type: string, checked: boolean) => {
    setFilter(prev => {
        if (checked) {
            return [...prev, type];
        } else {
            return prev.filter(item => item !== type);
        }
    });
  };

  const isLoading = transactionsLoading || customersLoading;

  return (
    <>
      <PageHeader
        title="Riwayat Transaksi"
        description="Lihat dan kelola semua transaksi yang tercatat."
      >
        <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Tipe</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={filter.includes('Deposit')}
                    onCheckedChange={(checked) => handleFilterChange('Deposit', !!checked)}
                >
                  Deposit
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={filter.includes('Withdrawal')}
                    onCheckedChange={(checked) => handleFilterChange('Withdrawal', !!checked)}
                >
                    Withdrawal
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={filter.includes('Transfer')}
                    onCheckedChange={(checked) => handleFilterChange('Transfer', !!checked)}
                >
                    Transfer
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" asChild className="h-8 gap-1">
              <Link href="/dashboard/transaksi/baru">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Tambah Transaksi
                </span>
              </Link>
            </Button>
        </div>
      </PageHeader>
      <Card className="shadow-lg shadow-primary/5">
        <CardContent className='pt-6'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                 <TableRow>
                    <TableCell colSpan={4} className="text-center">Memuat transaksi...</TableCell>
                </TableRow>
              )}
              {!isLoading && filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <div className="font-medium">{tx.customerName}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {tx.customerNik}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tx.type === 'Deposit' ? 'default' : tx.type === 'Withdrawal' ? 'destructive' : 'secondary'}>{tx.type}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tx.formattedDate}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: tx.currency,
                    }).format(tx.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
