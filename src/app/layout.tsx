import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
// import Script from 'next/script';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ContentService } from '@/services/content.service';
import { Providers } from '@/providers';
import { SYSTEM_SETTINGS, THEME_COLOR } from '@/constants/content';
import './globals.css';

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/Inter_24pt-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter_24pt-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter_24pt-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await ContentService.getContent();
    const s = content?.systemSettings;

    if (!s) {
      return fallbackMetadata();
    }

    return {
      title: {
        template: `%s | ${s.siteName || SYSTEM_SETTINGS.siteName}`,
        default: s.siteSlogan || s.siteName || SYSTEM_SETTINGS.siteName,
      },
      description: s.siteDescription || SYSTEM_SETTINGS.siteDescription,
      metadataBase: new URL(s.siteUrl || 'http://localhost:3000'),
      keywords: s.siteKeywords?.length ? s.siteKeywords : SYSTEM_SETTINGS.siteKeywords,
      authors: [{ name: s.siteAuthor || SYSTEM_SETTINGS.siteAuthor }],
      manifest: '/manifest.webmanifest',
      ...(s.ogTitle || s.ogDescription || s.ogImage
        ? {
            openGraph: {
              title: s.ogTitle || s.siteName,
              description: s.ogDescription || s.siteDescription,
              url: s.siteUrl,
              siteName: s.siteName,
              images: s.ogImage ? [{ url: s.ogImage, alt: s.ogImageAlt || s.siteName }] : undefined,
              locale: s.siteLocale || 'en_NG',
              // Only pass type if it's a valid non-empty string
              ...(s.siteType ? { type: s.siteType as 'website' } : {}),
            },
          }
        : {}),
      ...(s.twitterCard
        ? {
            twitter: {
              card: s.twitterCard as 'summary_large_image',
              title: s.twitterTitle || s.ogTitle || s.siteName,
              description: s.twitterDescription || s.ogDescription || s.siteDescription,
              site: s.twitterSite || undefined,
              creator: s.twitterCreator || undefined,
              images: s.twitterImage ? [s.twitterImage] : undefined,
            },
          }
        : {}),
    };
  } catch {
    return fallbackMetadata();
  }
}

function fallbackMetadata(): Metadata {
  return {
    title: {
      template: `%s | ${SYSTEM_SETTINGS.siteName}`,
      default: SYSTEM_SETTINGS.siteName,
    },
    description: SYSTEM_SETTINGS.siteDescription,
    manifest: '/manifest.webmanifest',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const GA_ID = 'G-[CODE]';

  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy='afterInteractive'
        />
        <Script id='gtag-init' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script> */}
        <TooltipProvider>
          <Providers>{children}</Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}
