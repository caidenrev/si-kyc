'use client'

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FileDown, MoreVertical } from "lucide-react";
import React from 'react';

import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { customers, transactions as allTransactions } from "@/lib/data";

const PrintButton = () => (
    <Button onClick={() => window.print()}>
        <FileDown className="mr-2 h-4 w-4" />
        Cetak Catatan
    </Button>
);

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [formattedJoinDate, setFormattedJoinDate] = React.useState('');
  const [clientTransactions, setClientTransactions] = React.useState<any[]>([]);

  const customer = customers.find((c) => c.id === params.id);
  const transactions = allTransactions.filter((t) => t.customerId === params.id);

  React.useEffect(() => {
    if (customer) {
      setFormattedJoinDate(new Date(customer.joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }));
    }
    setClientTransactions(transactions.map(tx => ({
      ...tx,
      formattedDate: new Date(tx.date).toLocaleDateString('id-ID'),
    })));
  }, [customer, transactions]);


  if (!customer) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Pelanggan tidak ditemukan</h2>
        <p className="text-muted-foreground">
          Data pelanggan yang Anda cari tidak ada.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/customers">Kembali ke Daftar Pelanggan</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="print-p-0">
      <div className="flex items-center gap-4 mb-8 print-hidden">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard/customers">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Detail Pelanggan
        </h1>
        <div className="ml-auto flex items-center gap-2">
            <PrintButton />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card className="shadow-lg shadow-primary/5 print-shadow-none">
            <CardHeader className="flex flex-row items-start bg-muted/50 rounded-t-lg">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  {customer.name}
                </CardTitle>
                <CardDescription>NIK: {customer.nik}</CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                    Actions
                  </span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                    <div className="font-semibold">Informasi Dasar</div>
                    <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Alamat</dt>
                            <dd>{customer.address}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Bergabung</dt>
                            <dd>{formattedJoinDate}</dd>
                        </div>
                    </dl>
                </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg shadow-primary/5 print-shadow-none">
            <CardHeader>
              <CardTitle>Riwayat Transaksi</CardTitle>
              <CardDescription>
                Semua transaksi yang dilakukan oleh {customer.name}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.formattedDate}</TableCell>
                      <TableCell>
                        <Badge variant={tx.type === 'Deposit' ? 'default' : tx.type === 'Withdrawal' ? 'destructive' : 'secondary'}>{tx.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: tx.currency,
                        }).format(tx.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8 print-hidden">
          <Card className="overflow-hidden shadow-lg shadow-primary/5" x-chunk="dashboard-07-chunk-4">
            <CardHeader>
              <CardTitle>Profil Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Image
                alt="Avatar Pelanggan"
                className="aspect-square w-32 rounded-full object-cover mb-4"
                height="128"
                src={customer.avatarUrl}
                width="128"
              />
              <p className="text-center font-semibold">{customer.name}</p>
              <p className="text-center text-sm text-muted-foreground">{customer.address}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
