'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// The leads board with LIVE updates.
// When a row is added/changed/removed in the database, Supabase pushes the
// change to us over a websocket and the list refreshes on its own — no reload.
export default function Board({ session }) {
  const [leads2, setLeads] = useState([]);
  const [name, setName] = useState('');
  const [channel, setChannel] = useState('WhatsApp');
  const [status, setStatus] = useState('open');
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const { data, error } = await supabase
      .from('leads2')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setLeads(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();

    // Subscribe to any change on the leads table, then reload the list.
    // (RLS still applies, so you only ever receive your own rows.)
    const sub = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads2' },
        () => load()
      )
      .subscribe((s) => setLive(s === 'SUBSCRIBED'));

    // Always clean up the subscription when leaving the screen.
    return () => { supabase.removeChannel(sub); };
  }, []);

  async function addLead(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    const { error } = await supabase
      .from('leads2')
      .insert({ name, channel, status, user_id: session.user.id });
    if (error) { setError(error.message); return; }
    setName('');
    // No manual reload needed — the realtime subscription updates the list.
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <main className="wrap">
      <div className="topline">
        <div>
          <h1>📋 Leads Board <span className={'live ' + (live ? '' : 'off')}>{live ? '● LIVE' : '○ offline'}</span></h1>
          <div className="who">Signed in as {session.user.email}</div>
        </div>
        <button className="ghost" onClick={signOut}>Sign out</button>
      </div>

      {error ? <div className="error">Error: {error}</div> : null}

      <form onSubmit={addLead}>
        <input type="text" placeholder="Lead name" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={channel} onChange={(e) => setChannel(e.target.value)}>
          <option>WhatsApp</option>
          <option>Instagram</option>
          <option>Messenger</option>
          <option>Web</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="open">open</option>
          <option value="pending">pending</option>
          <option value="closed">closed</option>
        </select>
        <button type="submit">Add lead</button>
      </form>

      {loading ? (
        <div className="empty">Loading…</div>
      ) : leads2.length === 0 ? (
        <div className="empty">No leads yet. Add your first one above.</div>
      ) : (
        leads2.map((lead) => (
          <div className="card" key={lead.id}>
            <span className="name">{lead.name}</span>
            <span className="badge">{lead.channel}</span>
            <span className="meta">{new Date(lead.created_at).toLocaleString()}</span>
            <span className={'status ' + lead.status}>{lead.status}</span>
          </div>
        ))
      )}
    </main>
  );
}
