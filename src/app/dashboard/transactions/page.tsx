'use client';

import * as React from 'react';
import Link from 'next/link';
import { PlusCircle, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { transactions as allTransactions, customers } from '@/lib/data';

const transactionsWithCustomer = allTransactions.map(tx => {
    const customer = customers.find(c => c.id === tx.customerId);
    return { ...tx, customerName: customer?.name || 'Unknown', customerNik: customer?.nik || 'N/A' };
});

export default function TransactionsPage() {
  const [clientTransactions, setClientTransactions] = React.useState<any[]>([]);

  React.useEffect(() => {
    setClientTransactions(transactionsWithCustomer.map(tx => ({
      ...tx,
      formattedDate: new Date(tx.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    })))
  }, []);

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
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Deposit
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Withdrawal</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Transfer</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" asChild className="h-8 gap-1">
              <Link href="/dashboard/transactions/new">
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
              {clientTransactions.map((tx) => (
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
