'use client';

import { ReduxProvider } from './redux-provider';
import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './auth-provider';
import { ContentProvider } from './content-provider';
import { SWRConfig } from 'swr';
import { swrFetcher } from '@/services/api.service';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        keepPreviousData: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        dedupingInterval: 4000,
      }}
    >
      <ReduxProvider>
        <ThemeProvider attribute='class' defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <ContentProvider>{children}</ContentProvider>
          </AuthProvider>
        </ThemeProvider>
      </ReduxProvider>
    </SWRConfig>
  );
}
