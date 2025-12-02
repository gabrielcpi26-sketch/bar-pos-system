import express from 'express';
import { supabase } from '../utils/supabaseClient.js';
import { requireRole } from '../middleware/auth.js';

export const router = express.Router();

router.get('/ventas-dia', requireRole(['Administrador', 'Gerente']), async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', `${today}T00:00:00.000Z`);
    if (error) throw error;
    const total = data.reduce((acc, order) => acc + Number(order.total || 0), 0);
    res.json({ total });
  } catch (err) {
    next(err);
  }
});

router.get('/top-productos', requireRole(['Administrador', 'Gerente']), async (req, res, next) => {
  try {
    const { data, error } = await supabase.rpc('top_products');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});
