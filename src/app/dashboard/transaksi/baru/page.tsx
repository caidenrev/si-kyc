
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import { collection, serverTimestamp, getDocs } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFirestore, addDocumentNonBlocking } from "@/firebase";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { Customer } from "@/lib/definitions";

const transactionSchema = z.object({
  customerId: z.string().min(1, "Pelanggan harus dipilih"),
  type: z.enum(["Deposit", "Withdrawal", "Transfer"]),
  currency: z.enum(["IDR", "USD", "EUR"]),
  amount: z.coerce.number().min(1, "Jumlah harus lebih dari 0"),
  source: z.string().min(1, "Sumber dana harus diisi"),
  destination: z.string().min(1, "Tujuan dana harus diisi"),
});

export default function NewTransactionPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  
  useEffect(() => {
    async function fetchCustomers() {
      if (!firestore) return;
      try {
        setCustomersLoading(true);
        const customersRef = collection(firestore, 'customers');
        const querySnapshot = await getDocs(customersRef);
        const customersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
        setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching customers: ", error);
        toast({
          variant: "destructive",
          title: "Gagal memuat pelanggan.",
          description: "Terjadi kesalahan saat mengambil data pelanggan.",
        });
      } finally {
        setCustomersLoading(false);
      }
    }
    fetchCustomers();
  }, [firestore, toast]);
  
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      customerId: "",
      type: "Deposit",
      currency: "IDR",
      amount: 0,
      source: "",
      destination: ""
    },
  });

  async function onSubmit(values: z.infer<typeof transactionSchema>) {
    if (!firestore) return;

    try {
      const transactionsRef = collection(firestore, 'transactions');
      await addDocumentNonBlocking(transactionsRef, {
        ...values,
        transactionDate: serverTimestamp(),
      });

      toast({
        title: "Transaksi berhasil!",
        description: "Transaksi baru telah berhasil dicatat.",
      });
      router.push("/dashboard/transaksi");

    } catch (error) {
      console.error("Error adding transaction: ", error);
      toast({
        variant: "destructive",
        title: "Gagal menyimpan.",
        description: "Terjadi kesalahan saat mencatat transaksi.",
      });
    }
  }


  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard/transaksi">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Input Transaksi Baru
        </h1>
      </div>
      <Card className="shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle>Formulir Data Transaksi</CardTitle>
          <CardDescription>
            Isi detail transaksi yang dilakukan oleh pelanggan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pelanggan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger aria-label="Pilih Pelanggan" disabled={customersLoading}>
                          <SelectValue placeholder={customersLoading ? "Memuat pelanggan..." : "Pilih pelanggan..."} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.fullName} - {c.nik}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Transaksi</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                           <SelectTrigger aria-label="Pilih Jenis Transaksi">
                            <SelectValue placeholder="Pilih jenis" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Deposit">Deposit</SelectItem>
                          <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                          <SelectItem value="Transfer">Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mata Uang</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                           <SelectTrigger aria-label="Pilih Mata Uang">
                            <SelectValue placeholder="Pilih mata uang" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IDR">IDR (Rupiah)</SelectItem>
                          <SelectItem value="USD">USD (Dolar AS)</SelectItem>
                          <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Contoh: 5000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sumber Dana</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Bank Transfer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tujuan Dana</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Savings Account" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" type="button" asChild>
                      <Link href="/dashboard/transaksi">Batal</Link>
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
