import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { SiteSettingsProvider } from '../context/SiteSettingsContext';
import { ToastProvider } from '../context/ToastContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BottomNavBar from '../components/layout/BottomNavBar';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Kibali Africa Tours | Travel. Relax. Enjoy Safaris',
  description:
    'Experience bespoke African wildlife safaris, Amboseli Kilimanjaro expeditions, and Maasai Mara Great Migration with Kibali Africa Tours. Certified naturalist rangers, custom 4x4 Cruisers, and eco-restoration in Kenya.',
  keywords: [
    'Kibali Africa Tours',
    'Kenya Safari',
    'Maasai Mara Migration',
    'Amboseli Kilimanjaro',
    'Luxury Safari Kenya',
    'Eco Safari',
    'M-Pesa Safari Booking',
  ],
  authors: [{ name: 'Kibali Africa Tours' }],
  icons: {
    icon: [
      { url: '/images/logo.png', type: 'image/png' },
    ],
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-[#FCFBF9] text-[#0F172A] antialiased selection:bg-[#15803D] selection:text-white"
        suppressHydrationWarning
      >
        <AuthProvider>
          <SiteSettingsProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-grow pb-16 md:pb-0">{children}</main>
              <Footer />
              <BottomNavBar />
            </ToastProvider>
          </SiteSettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
