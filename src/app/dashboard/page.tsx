"use client";

import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ArrowUp, DollarSign, Users, ArrowRightLeft } from "lucide-react";
import { collection, query, orderBy, limit } from 'firebase/firestore';

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";

const initialChartData = [
  { name: "Sen", total: 0 },
  { name: "Sel", total: 0 },
  { name: "Rab", total: 0 },
  { name: "Kam", total: 0 },
  { name: "Jum", total: 0 },
  { name: "Sab", total: 0 },
  { name: "Min", total: 0 },
];

export default function Dashboard() {
  const [chartData, setChartData] = React.useState(initialChartData);
  const firestore = useFirestore();

  const customersRef = useMemoFirebase(() => firestore ? collection(firestore, 'customers') : null, [firestore]);
  const { data: customers } = useCollection(customersRef);

  const transactionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'transactions'), orderBy('transactionDate', 'desc'), limit(5));
  }, [firestore]);
  const { data: recentTransactions } = useCollection(transactionsQuery);

  const transactionsWithCustomerNames = React.useMemo(() => {
    if (!recentTransactions || !customers) return [];
    return recentTransactions.map(tx => {
      const customer = customers.find(c => c.id === tx.customerId);
      return { ...tx, customerName: customer?.fullName || 'Unknown' };
    });
  }, [recentTransactions, customers]);

  React.useEffect(() => {
    const data = [
      { name: "Sen", total: Math.floor(Math.random() * 5000) + 1000 },
      { name: "Sel", total: Math.floor(Math.random() * 5000) + 1000 },
      { name: "Rab", total: Math.floor(Math.random() * 5000) + 1000 },
      { name: "Kam", total: Math.floor(Math.random() * 5000) + 1000 },
      { name: "Jum", total: Math.floor(Math.random() * 5000) + 1000 },
      { name: "Sab", total: Math.floor(Math.random() * 5000) + 1000 },
      { name: "Min", total: Math.floor(Math.random() * 5000) + 1000 },
    ];
    setChartData(data);
  }, []);

  const totalRevenue = recentTransactions?.reduce((acc, tx) => tx.type === 'Deposit' ? acc + tx.amount : acc, 0) || 0;
  const totalCustomers = customers?.length || 0;

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
          description="+20.1% dari bulan lalu"
        />
        <StatCard
          title="Pelanggan Aktif"
          value={`+${totalCustomers}`}
          icon={Users}
          description="+180.1% dari bulan lalu"
        />
        <StatCard
          title="Transaksi Hari Ini"
          value={recentTransactions?.filter(tx => new Date(tx.transactionDate.toDate()).toDateString() === new Date().toDateString()).length || 0}
          icon={ArrowRightLeft}
          description="+5 sejak kemarin"
        />
        <StatCard
          title="Pertumbuhan"
          value="+573"
          icon={ArrowUp}
          description="Total pelanggan baru minggu ini"
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-8">
        <Card className="xl:col-span-2 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Ringkasan Transaksi</CardTitle>
            <CardDescription>
              Total transaksi dalam 7 hari terakhir.
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
