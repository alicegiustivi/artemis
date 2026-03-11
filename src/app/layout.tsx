import type { Metadata } from 'next';
import { Instrument_Serif, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400'
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: '400'
});

export const metadata: Metadata = {
  title: 'Artemis',
  description: 'Cycle syncing app for women',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${ibmPlexSans.variable}`}>
      <body className="bg-[#12100E] text-[#F2EDE8]">{children}</body>
    </html>
  );
}
