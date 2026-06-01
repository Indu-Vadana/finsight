import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'FinSight',
  description: 'Personal Finance Tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('finsight-theme');document.documentElement.classList.toggle('dark',t!=='light')}catch(e){document.documentElement.classList.add('dark')}})();`,
          }}
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
