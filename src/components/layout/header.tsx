
'use client';

import Link from 'next/link';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useLanguage } from '@/hooks/use-language';
import { useProfile } from '@/hooks/use-profile';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Logo } from './logo';

const translations = {
    en: {
        dashboard: 'Dashboard',
        marketPrices: 'Market Prices',
        myAccount: 'My Account',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Log out'
    },
    hi: {
        dashboard: 'डैशबोर्ड',
        marketPrices: 'बाजार भाव',
        myAccount: 'मेरा खाता',
        profile: 'प्रोफ़ाइल',
        settings: 'सेटिंग्स',
        logout: 'लॉग आउट'
    },
    mr: {
        dashboard: 'डॅशबोर्ड',
        marketPrices: 'बाजारभाव',
        myAccount: 'माझे खाते',
        profile: 'प्रोफाइल',
        settings: 'सेटिंग्ज',
        logout: 'लॉग आउट'
    }
};

export function Header() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { profile } = useProfile();
  const t = translations[language];

  const navLinks = [
      { label: t.dashboard, href: '/' },
      { label: t.marketPrices, href: '/market-prices' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-b-primary/20">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="font-headline text-2xl">KisanAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                'transition-colors duration-300 text-lg',
                pathname === link.href
                  ? 'text-primary hover:text-primary'
                  : 'text-muted-foreground hover:bg-primary hover:text-primary-foreground'
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 hover:bg-primary/10">
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>
                    <User className="h-5 w-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">User Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-border">
              <DropdownMenuLabel>{t.myAccount}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">{t.profile}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">{t.settings}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t.logout}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="border-r">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-lg"
                  >
                    <Logo />
                    <span>KisanAI</span>
                  </Link>
                </SheetClose>
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'text-muted-foreground hover:text-foreground',
                        pathname === link.href && 'text-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
