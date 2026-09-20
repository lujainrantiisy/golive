'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Auth from '../components/Auth';
import Board from '../components/Board';

export default function Home() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return <main className="wrap"><p className="sub">Loading…</p></main>;
  }

  return session ? <Board session={session} /> : <Auth />;
}
