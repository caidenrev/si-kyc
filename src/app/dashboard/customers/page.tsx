"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { PlusCircle, Search, MoreHorizontal } from "lucide-react";
import { collection, deleteDoc, doc } from "firebase/firestore";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from "@/hooks/use-toast";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const firestore = useFirestore();
  const customersRef = useMemoFirebase(() => firestore ? collection(firestore, 'customers') : null, [firestore]);
  const { data: allCustomers, isLoading } = useCollection(customersRef);
  const { toast } = useToast();

  const handleDelete = (customerId: string, customerName: string) => {
    if(!firestore) return;
    if (confirm(`Apakah Anda yakin ingin menghapus pelanggan ${customerName}?`)) {
      const docRef = doc(firestore, 'customers', customerId);
      deleteDocumentNonBlocking(docRef);
      toast({
        title: "Pelanggan Dihapus",
        description: `${customerName} telah dihapus.`,
      });
    }
  };
  
  const filteredCustomers = React.useMemo(() => {
    if (!allCustomers) return [];
    return allCustomers.filter(customer =>
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.nik.includes(searchTerm)
    );
  }, [allCustomers, searchTerm]);

  return (
    <>
      <PageHeader
        title="Data Pelanggan"
        description="Kelola data pelanggan dan riwayat transaksi mereka."
      >
        <Button asChild>
          <Link href="/dashboard/customers/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pelanggan
          </Link>
        </Button>
      </PageHeader>
      <Card className="shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle>Daftar Pelanggan</CardTitle>
          <CardDescription>
            Cari dan lihat detail pelanggan Anda.
          </CardDescription>
          <div className="relative pt-4">
             <Search className="absolute left-2.5 top-6 h-4 w-4 text-muted-foreground" />
             <Input 
                placeholder="Cari berdasarkan Nama atau NIK..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>NIK</TableHead>
                <TableHead className="hidden md:table-cell">Alamat</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Memuat data pelanggan...</TableCell>
                </TableRow>
              )}
              {!isLoading && filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="Customer avatar"
                      className="aspect-square rounded-full object-cover"
                      height="40"
                      src={customer.avatarUrl || 'https://picsum.photos/seed/placeholder/40/40'}
                      width="40"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{customer.fullName}</TableCell>
                  <TableCell>{customer.nik}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {customer.address}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild><Link href={`/dashboard/customers/${customer.id}`}>Lihat Detail</Link></DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(customer.id, customer.fullName)}>Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
