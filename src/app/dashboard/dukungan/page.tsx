
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { Mail, Phone } from 'lucide-react';

export default function SupportPage() {
  return (
    <>
      <PageHeader
        title="Pusat Dukungan"
        description="Butuh bantuan? Hubungi kami melalui salah satu metode di bawah ini."
      />
      <Card className="shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle>Informasi Kontak</CardTitle>
          <CardDescription>
            Tim kami siap membantu Anda dari Senin hingga Jumat, pukul 09:00 - 17:00.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Mail className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Email</h3>
              <p className="text-muted-foreground">
                Kirimkan pertanyaan Anda kapan saja dan kami akan merespons dalam 24 jam kerja.
              </p>
              <a href="mailto:support@sikyc.com" className="font-medium text-primary hover:underline">
                support@sikyc.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Phone className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Telepon</h3>
              <p className="text-muted-foreground">
                Untuk masalah mendesak, silakan hubungi kami langsung melalui telepon.
              </p>
              <a href="tel:+62215550123" className="font-medium text-primary hover:underline">
                (021) 555-0123
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
