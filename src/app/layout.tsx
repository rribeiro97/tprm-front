'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
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
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>TPRM Client - Vendor Risk Management</title>
        <meta name="description" content="Third-party risk management and vendor due diligence platform" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
