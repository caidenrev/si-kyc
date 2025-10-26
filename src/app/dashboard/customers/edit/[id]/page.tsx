
"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

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
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const customerSchema = z.object({
  nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit"),
  fullName: z.string().min(2, "Nama lengkap harus diisi"),
  address: z.string().min(10, "Alamat harus diisi"),
  ktpPhotoUrl: z.string().optional(),
});

function EditCustomerFormSkeleton() {
    return (
        <div className="grid gap-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-48 w-full" />
            </div>
            <div className="flex justify-end gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    )
}

export default function EditCustomerPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const customerId = id;

  const customerRef = useMemoFirebase(() => (firestore && customerId ? doc(firestore, 'customers', customerId) : null), [firestore, customerId]);
  const { data: customer, isLoading } = useDoc(customerRef);

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    values: {
      nik: customer?.nik || "",
      fullName: customer?.fullName || "",
      address: customer?.address || "",
      ktpPhotoUrl: customer?.ktpPhotoUrl || "",
    },
  });

  useEffect(() => {
    if (customer) {
      form.reset({
        nik: customer.nik,
        fullName: customer.fullName,
        address: customer.address,
        ktpPhotoUrl: customer.ktpPhotoUrl,
      });
      if(customer.ktpPhotoUrl) {
          setPhotoPreview(customer.ktpPhotoUrl);
      }
    }
  }, [customer, form]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        form.setValue('ktpPhotoUrl', dataUrl);
        setPhotoPreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof customerSchema>) {
    if (!customerRef) return;

    try {
      await updateDoc(customerRef, values);
      toast({
        title: "Pelanggan diperbarui!",
        description: `Data ${values.fullName} telah berhasil diperbarui.`,
      });
      router.push("/dashboard/customers");

    } catch (error) {
      console.error("Error updating customer: ", error);
      toast({
        variant: "destructive",
        title: "Gagal memperbarui.",
        description: "Terjadi kesalahan saat memperbarui data pelanggan.",
      });
    }
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard/customers">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Edit Data Pelanggan
        </h1>
      </div>
      <Card className="shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle>Formulir Data Pelanggan</CardTitle>
          <CardDescription>
            Perbarui detail KYC pelanggan di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <EditCustomerFormSkeleton />
          ) : (
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
                        <Input placeholder="Contoh: Putri Amalia" {...field} />
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
                    <Input id="picture" type="file" accept="image/*" onChange={handlePhotoChange} />
                    {photoPreview && (
                        <div className="relative mt-4 aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
                            <img src={photoPreview} alt="Pratinjau KTP" className="object-contain w-full h-full" />
                        </div>
                    )}
                 </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" asChild>
                    <Link href="/dashboard/customers">Batal</Link>
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </>
  );
}
