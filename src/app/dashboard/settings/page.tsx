
'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <>
      <PageHeader
        title="Pengaturan Akun"
        description="Kelola informasi profil dan pengaturan akun Anda."
      />
      <Card className="shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle>Profil Anda</CardTitle>
          <CardDescription>
            Informasi ini akan ditampilkan secara publik, jadi berhati-hatilah dengan apa yang Anda bagikan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                type="text"
                defaultValue={user?.displayName || ''}
                placeholder="Nama lengkap Anda"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ''}
                disabled
                placeholder="email@anda.com"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Simpan Perubahan</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
