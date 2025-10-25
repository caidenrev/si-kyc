"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser, initiateEmailSignUp } from "@/firebase";
import { FirebaseError } from "firebase/app";

const registerSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap harus diisi."),
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export default function RegisterPage() {
  const [isClient, setIsClient] = React.useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    setIsClient(true);
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      // We don't need to await this. The onAuthStateChanged listener will handle the redirect.
      initiateEmailSignUp(auth, values.email, values.password);
      toast({
        title: "Pendaftaran Berhasil!",
        description: "Akun Anda telah dibuat. Anda akan diarahkan ke dashboard.",
      });
    } catch (error) {
       console.error("Registration failed:", error);
       let description = "Terjadi kesalahan saat pendaftaran.";
       if (error instanceof FirebaseError) {
         if (error.code === 'auth/email-already-in-use') {
           description = "Email ini sudah terdaftar. Silakan gunakan email lain.";
         }
       }
       toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
        description,
      });
    }
  }

  if (isUserLoading || user) {
    return <div className="flex h-screen w-full items-center justify-center">Memuat...</div>;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-sm shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo className="text-3xl text-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
          <CardDescription>
            Isi form di bawah untuk mendaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isClient ? (
            <div className="w-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Budi Santoso" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                           <Input type="password" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Memproses..." : "Buat Akun"}
                  </Button>
                  <Button variant="outline" className="w-full" type="button">
                    Daftar dengan Google
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                Sudah punya akun?{" "}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
