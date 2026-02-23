'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import theme from '@/lib/theme';

/**
 * Root Layout
 *
 * Wraps the entire application with necessary providers:
 * - ThemeProvider: Material UI theme customization
 * - CssBaseline: Consistent baseline styles across browsers
 * - AuthProvider: Global authentication state management
 * - ToastProvider: Global toast notification system
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>TPRM Client - Vendor Risk Management</title>
        <meta
          name="description"
          content="Third-party risk management and vendor due diligence platform"
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
