import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Inter } from 'next/font/google';

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
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
