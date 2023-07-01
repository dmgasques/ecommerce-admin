import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

import { ModalProvider } from '@/providers/modal-provider';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'E-commerce Admin',
  description: 'Administration saas app'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en' className='dark'>
        <body className={inter.className}>
          {children}
          <ModalProvider />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
