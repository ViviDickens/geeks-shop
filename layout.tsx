import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'GeekStore — Your Geek Universe',
  description: 'Gaming, anime, tech collectibles and more. Level up your life.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer style={{
          textAlign: 'center',
          padding: '32px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          letterSpacing: '0.1em',
          borderTop: '1px solid var(--border)',
          marginTop: '64px'
        }}>
          © 2026 GEEKSTORE — TEST ENVIRONMENT — ALL DATA IS MOCK
        </footer>
      </body>
    </html>
  );
}
