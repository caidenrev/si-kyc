"use client";

import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

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
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Nama Lengkap</Label>
                  <Input id="full-name" placeholder="Budi Santoso" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Buat Akun
                </Button>
                <Button variant="outline" className="w-full">
                  Daftar dengan Google
                </Button>
              </form>
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
