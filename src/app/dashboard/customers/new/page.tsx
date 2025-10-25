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
import { Textarea } from "@/components/ui/textarea";

export default function NewCustomerPage() {
  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard/customers">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Tambah Pelanggan Baru
        </h1>
      </div>
      <Card className="max-w-2xl mx-auto shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle>Formulir Data Pelanggan</CardTitle>
          <CardDescription>
            Isi detail KYC pelanggan berdasarkan KTP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="nik">NIK (Nomor Induk Kependudukan)</Label>
              <Input
                id="nik"
                type="text"
                className="w-full"
                placeholder="Contoh: 3273240101900001"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                type="text"
                className="w-full"
                placeholder="Contoh: Budi Santoso"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                placeholder="Isi alamat lengkap sesuai KTP"
                className="min-h-32"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="picture">Foto KTP</Label>
              <Input id="picture" type="file" />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/customers">Batal</Link>
                </Button>
                <Button type="submit">Simpan Pelanggan</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
