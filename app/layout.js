import './globals.css';

export const metadata = {
  title: 'Leads Board (realtime)',
  description: 'Next.js + Supabase Auth + Realtime',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
