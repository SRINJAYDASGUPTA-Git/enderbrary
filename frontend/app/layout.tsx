import {Comfortaa, Inter} from "next/font/google";
import "./globals.css";
import {UserProvider} from "@/providers/UserContext";
import {Toaster} from "sonner";

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
})

const comfortaa = Comfortaa({
    variable: "--font-display",
    subsets: ["latin"],
})

export const metadata = {
    title: {
        default: 'EnderBrary',
        template: '%s | EnderBrary',
    },
    description:
        'EnderBrary is your personal digital library for borrowing and lending books with friends and readers around you. Explore, share, and discover your next great read.',
    keywords: [
        'books',
        'library',
        'book lending',
        'borrow books',
        'book exchange',
        'reading',
        'EnderBrary',
        'digital library',
    ],
    openGraph: {
        title: 'EnderBrary',
        description:
            'Borrow and lend books easily with EnderBrary — your cozy, community-powered digital library.',
        url: 'https://enderbrary.srinjaydg.in',
        siteName: 'EnderBrary',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'EnderBrary – Your Cozy Book Library',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'EnderBrary',
        description:
            'Discover and share books with EnderBrary. A cozy community for readers and book lovers.',
        images: ['/og-image.png'],
        creator: '@SrinjayDasGupta',
    },
    metadataBase: new URL('https://enderbrary.srinjaydg.in'),
    themeColor: '#a855f7',
    viewport: 'width=device-width, initial-scale=1.0',
    icons: {
        icon: '/favicon.ico',
    },
    alternates: {
        canonical: 'https://enderbrary.srinjaydg.in',
    },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`w-full antialiased ${inter.variable} ${comfortaa.variable} antialiased`}
      >
      <UserProvider>
          {children}
          <Toaster position={'top-center'}/>
      </UserProvider>
      </body>
    </html>
  );
}
