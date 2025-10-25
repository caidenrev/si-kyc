"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customers } from "@/lib/data";

export default function NewTransactionPage() {
  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard/transactions">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Input Transaksi Baru
        </h1>
      </div>
      <Card className="max-w-2xl mx-auto shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle>Formulir Data Transaksi</CardTitle>
          <CardDescription>
            Isi detail transaksi yang dilakukan oleh pelanggan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="customer">Pelanggan</Label>
              <Select>
                <SelectTrigger id="customer" aria-label="Pilih Pelanggan">
                  <SelectValue placeholder="Pilih pelanggan" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name} - {c.nik}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="type">Jenis Transaksi</Label>
                  <Select>
                    <SelectTrigger id="type" aria-label="Pilih Jenis Transaksi">
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="withdrawal">Withdrawal</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="currency">Mata Uang</Label>
                  <Select defaultValue="IDR">
                    <SelectTrigger id="currency" aria-label="Pilih Mata Uang">
                      <SelectValue placeholder="Pilih mata uang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">IDR (Rupiah)</SelectItem>
                      <SelectItem value="USD">USD (Dolar AS)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="amount">Jumlah</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Contoh: 5000000"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="grid gap-3">
                  <Label htmlFor="source">Sumber Dana</Label>
                  <Input
                    id="source"
                    type="text"
                    placeholder="Contoh: Bank Transfer"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="destination">Tujuan Dana</Label>
                  <Input
                    id="destination"
                    type="text"
                    placeholder="Contoh: Savings Account"
                  />
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/transactions">Batal</Link>
                </Button>
                <Button type="submit">Simpan Transaksi</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
