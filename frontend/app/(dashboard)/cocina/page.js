'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../../lib/supabaseClient';

export default function CocinaPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    supabaseBrowser
      .from('kitchen_tickets')
      .select('id, status, order_id, created_at')
      .order('created_at', { ascending: true })
      .then(({ data }) => setTickets(data || []));
  }, []);

  const updateStatus = async (id, status) => {
    await supabaseBrowser.from('kitchen_tickets').update({ status }).eq('id', id);
    setTickets(tickets.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/60 uppercase">Cocina</p>
          <h2 className="text-lg font-semibold">Órdenes</h2>
        </div>
      </div>
      {tickets.map((ticket) => (
        <div key={ticket.id} className="flex justify-between bg-surface/60 p-3 rounded border border-white/5">
          <div>
            <p className="text-sm text-white/60">Orden #{ticket.order_id}</p>
            <p className="font-semibold capitalize">{ticket.status}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn" onClick={() => updateStatus(ticket.id, 'preparando')}>Preparando</button>
            <button className="btn" onClick={() => updateStatus(ticket.id, 'listo')}>Listo</button>
          </div>
        </div>
      ))}
    </div>
  );
}
