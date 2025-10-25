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
import { useAuth, initiateEmailSignIn, useUser, initiateGoogleSignIn } from "@/firebase";
import { FirebaseError } from "firebase/app";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});


export default function LoginPage() {
  const [isClient, setIsClient] = React.useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
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

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await initiateEmailSignIn(auth, values.email, values.password);
      toast({
        title: "Login Berhasil!",
        description: "Anda akan diarahkan ke dashboard.",
      });
      // The redirect is handled by the useEffect
    } catch (error) {
      console.error("Login failed:", error);
      let description = "Terjadi kesalahan saat login.";
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          description = "Email atau password yang Anda masukkan salah.";
        }
      }
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description,
      });
    }
  }

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    try {
        await initiateGoogleSignIn(auth);
        toast({
            title: "Login Berhasil!",
            description: "Anda akan diarahkan ke dashboard.",
        });
    } catch (error) {
        console.error("Google Sign-In failed:", error);
        let description = "Terjadi kesalahan saat login dengan Google.";
        if (error instanceof FirebaseError) {
            description = "Gagal untuk login dengan Google. Silakan coba lagi.";
        }
        toast({
            variant: "destructive",
            title: "Login Gagal",
            description,
        });
    }
  };

  if (isUserLoading || user) {
    return <div className="flex h-screen w-full items-center justify-center">Memuat...</div>;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-sm shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
             <Logo className="text-3xl text-foreground"/>
          </div>
          <CardTitle className="text-2xl font-bold">Selamat Datang</CardTitle>
          <CardDescription>
            Masuk ke akun Si-KYC Anda untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isClient ? (
            <div className="w-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                         <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline"
                         >
                          Lupa password?
                        </Link>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Memproses..." : "Login"}
                  </Button>
                  <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
                    Login dengan Google
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                Belum punya akun?{" "}
                <Link href="/register" className="underline">
                  Daftar
                </Link>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
