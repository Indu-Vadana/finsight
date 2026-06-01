import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'FinSight',
  description: 'Personal Finance Tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
