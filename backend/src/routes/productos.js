import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../utils/supabaseClient.js';
import { requireRole } from '../middleware/auth.js';

export const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('name');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  requireRole(['Administrador', 'Gerente']),
  body('name').notEmpty(),
  body('price').isNumeric(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { data, error } = await supabase.from('products').insert(req.body).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }
);

router.patch('/:id', requireRole(['Administrador', 'Gerente']), async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('products')
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
