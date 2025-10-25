'use client'

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation'
import Image from "next/image";
import {
  Home,
  Users,
  ArrowRightLeft,
  Search,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@/firebase";
import React from "react";


const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/customers", icon: Users, label: "Pelanggan" },
  { href: "/dashboard/transactions", icon: ArrowRightLeft, label: "Transaksi" },
];

function Header() {
  const { user } = useUser();
  const router = useRouter();
  const auth = getAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push('/login');
    }).catch((error) => {
      console.error("Logout error", error);
    });
  };

  const userAvatar = user?.photoURL || PlaceHolderImages.find(img => img.id === 'user-avatar-1')?.imageUrl;
  const userDisplayName = user?.displayName || user?.email;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 print-hidden">
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Buka Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                    <Logo className="mb-4" />
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                                (pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')) && "text-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari..."
          className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            {userAvatar && (
              <Image
                src={userAvatar}
                width={40}
                height={40}
                alt="User avatar"
                className="overflow-hidden rounded-full"
              />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{userDisplayName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Pengaturan</DropdownMenuItem>
          <DropdownMenuItem>Dukungan</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4"/>
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div>Memuat...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
        <nav className="hidden border-r bg-muted/40 md:block print-hidden">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Logo />
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                    (pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')) && "bg-muted text-primary"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </nav>
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 print-p-0">
            {children}
          </main>
        </div>
      </div>
  )
}
