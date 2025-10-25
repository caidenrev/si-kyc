"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import { collection, serverTimestamp } from "firebase/firestore";

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
import { useFirestore, addDocumentNonBlocking } from "@/firebase";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const customerSchema = z.object({
  nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit"),
  fullName: z.string().min(2, "Nama lengkap harus diisi"),
  address: z.string().min(10, "Alamat harus diisi"),
  // We'll handle file upload separately
});

export default function NewCustomerPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      nik: "",
      fullName: "",
      address: "",
    },
  });

  async function onSubmit(values: z.infer<typeof customerSchema>) {
    if (!firestore) return;

    try {
      const customersRef = collection(firestore, 'customers');
      await addDocumentNonBlocking(customersRef, {
        ...values,
        joinDate: serverTimestamp(),
        avatarUrl: `https://picsum.photos/seed/${Math.random()}/40/40`, // Placeholder avatar
      });

      toast({
        title: "Pelanggan ditambahkan!",
        description: `${values.fullName} telah berhasil ditambahkan.`,
      });
      router.push("/dashboard/customers");

    } catch (error) {
      console.error("Error adding customer: ", error);
      toast({
        variant: "destructive",
        title: "Gagal menyimpan.",
        description: "Terjadi kesalahan saat menambahkan pelanggan.",
      });
    }
  }


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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <FormField
                control={form.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK (Nomor Induk Kependudukan)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 3273240101900001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Budi Santoso" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Isi alamat lengkap sesuai KTP"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-3">
                <Label htmlFor="picture">Foto KTP</Label>
                <Input id="picture" type="file" />
              </div>
              <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" asChild>
                      <Link href="/dashboard/customers">Batal</Link>
                  </Button>
                  <Button type="submit">Simpan Pelanggan</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
