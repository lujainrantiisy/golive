# Leads Board — realtime

The login-protected Leads Board, now with **live updates**. Add a lead in one
tab and every other open tab updates instantly — no refresh.

## Quick start

1. In Supabase **SQL Editor**, run `supabase/schema.sql`
   (it keeps the login rules and turns on realtime for the table).
2. Copy `.env.local.example` to `.env.local` and paste your URL + anon key.
3. Install and run:

   ```powershell
   npm install
   npm run dev
   ```

4. Open http://localhost:3000 in **two** browser windows, log in, and add a
   lead in one — watch it appear in the other.

## The realtime part

All of it lives in `components/Board.js`:

```js
supabase
  .channel('leads-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => load())
  .subscribe();
```

The green **● LIVE** badge in the header shows the subscription is connected.

See the PDF guide for the full walkthrough.
