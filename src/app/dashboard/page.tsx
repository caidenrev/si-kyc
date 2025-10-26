'use client';

import React from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ArrowUp, DollarSign, Users, ArrowRightLeft } from 'lucide-react';
import { collection, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';
import { id } from 'date-fns/locale';

import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';

const initialChartData = [
  { name: 'Sen', total: 0 },
  { name: 'Sel', total: 0 },
  { name: 'Rab', total: 0 },
  { name: 'Kam', total: 0 },
  { name: 'Jum', total: 0 },
  { name: 'Sab', total: 0 },
  { name: 'Min', total: 0 },
];

export default function Dashboard() {
  const firestore = useFirestore();

  // Fetch all data needed
  const customersRef = useMemoFirebase(() => firestore ? collection(firestore, 'customers') : null, [firestore]);
  const { data: customers } = useCollection(customersRef);
  
  const allTransactionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'transactions'), orderBy('transactionDate', 'desc'));
  }, [firestore]);
  const { data: allTransactions } = useCollection(allTransactionsQuery);
  
  // -- CALCULATIONS FOR STAT CARDS --
  
  // Calculate total revenue from all deposit transactions
  const totalRevenue = React.useMemo(() => {
    if (!allTransactions) return 0;
    return allTransactions.reduce((acc, tx) => (tx.type === 'Deposit' ? acc + tx.amount : acc), 0);
  }, [allTransactions]);
  
  // Calculate total customers
  const totalCustomers = customers?.length || 0;
  
  // Calculate transactions today
  const transactionsToday = React.useMemo(() => {
      if (!allTransactions) return 0;
      const todayStart = startOfDay(new Date());
      const todayEnd = endOfDay(new Date());
      return allTransactions.filter(tx => {
          const txDate = tx.transactionDate.toDate();
          return txDate >= todayStart && txDate <= todayEnd;
      }).length;
  }, [allTransactions]);

  // Calculate new customers this week
  const newCustomersThisWeek = React.useMemo(() => {
      if (!customers) return 0;
      const oneWeekAgo = subDays(new Date(), 7);
      return customers.filter(customer => {
          if (!customer.joinDate) return false;
          const joinDate = customer.joinDate.toDate();
          return joinDate >= oneWeekAgo;
      }).length;
  }, [customers]);


  // -- CALCULATIONS FOR RECENTS AND CHART --
  
  // Get recent 5 transactions for the table
  const recentTransactions = React.useMemo(() => allTransactions?.slice(0, 5) || [], [allTransactions]);

  // Combine recent transactions with customer names
  const transactionsWithCustomerNames = React.useMemo(() => {
    if (!recentTransactions || !customers) return [];
    return recentTransactions.map(tx => {
      const customer = customers.find(c => c.id === tx.customerId);
      return { ...tx, customerName: customer?.fullName || 'Unknown' };
    });
  }, [recentTransactions, customers]);
  
  // Generate data for the bar chart (last 7 days)
  const chartData = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), i)).reverse();
    
    const dailyTotals = last7Days.map(day => {
        const dayStart = startOfDay(day);
        const dayEnd = endOfDay(day);
        
        const total = allTransactions?.filter(tx => {
            const txDate = tx.transactionDate.toDate();
            return txDate >= dayStart && txDate <= dayEnd && tx.type === 'Deposit';
        }).reduce((sum, tx) => sum + tx.amount, 0) || 0;

        return {
            name: format(day, 'E', { locale: id }), // 'Sen', 'Sel', etc.
            total: total
        };
    });
    return dailyTotals;
  }, [allTransactions]);


  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan aktivitas transaksi harian Anda."
      />
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard
          title="Total Pendapatan"
          value={`Rp ${new Intl.NumberFormat('id-ID').format(totalRevenue)}`}
          icon={DollarSign}
          description="Dari semua transaksi deposit"
        />
        <StatCard
          title="Pelanggan Aktif"
          value={`+${totalCustomers}`}
          icon={Users}
          description="Total pelanggan terdaftar"
        />
        <StatCard
          title="Transaksi Hari Ini"
          value={transactionsToday}
          icon={ArrowRightLeft}
          description="Jumlah transaksi hari ini"
        />
        <StatCard
          title="Pertumbuhan"
          value={`+${newCustomersThisWeek}`}
          icon={ArrowUp}
          description="Total pelanggan baru minggu ini"
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-8">
        <Card className="xl:col-span-2 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Ringkasan Transaksi</CardTitle>
            <CardDescription>
              Total pendapatan deposit dalam 7 hari terakhir.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Rp${value / 1000}k`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    cursor={{fill: 'hsl(var(--muted))'}}
                    formatter={(value: number) => [new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value), 'Total']}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
            <CardDescription>
              5 transaksi terakhir yang tercatat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionsWithCustomerNames.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="font-medium">{tx.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {tx.type}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: tx.currency,
                        minimumFractionDigits: 0,
                      }).format(tx.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
