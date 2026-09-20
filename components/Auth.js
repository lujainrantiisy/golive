'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// The login / sign-up screen. Shown when nobody is logged in.
export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  async function signUp() {
    setBusy(true); setMsg(''); setNote('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMsg(error.message);
    else setNote('Account created. If email confirmation is on, confirm via email, then log in.');
    setBusy(false);
  }

  async function signIn() {
    setBusy(true); setMsg(''); setNote('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    setBusy(false);
  }

  return (
    <main className="authwrap">
      <h1 className="title-auth">🔐 Leads Board</h1>
      <p className="sub">Log in or create an account to see your leads.</p>

      {msg ? <div className="error">{msg}</div> : null}
      {note ? <div className="note">{note}</div> : null}

      <form className="stack" onSubmit={(e) => { e.preventDefault(); signIn(); }}>
        <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="row2">
          <button type="submit" disabled={busy}>Log in</button>
          <button type="button" className="ghost" onClick={signUp} disabled={busy}>Sign up</button>
        </div>
      </form>
    </main>
  );
}
