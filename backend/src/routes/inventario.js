import express from 'express';
import { supabase } from '../utils/supabaseClient.js';
import { requireRole } from '../middleware/auth.js';

export const router = express.Router();

router.get('/', requireRole(['Administrador', 'Gerente']), async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*, ingredients(name, unit)')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requireRole(['Administrador', 'Gerente']), async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});
