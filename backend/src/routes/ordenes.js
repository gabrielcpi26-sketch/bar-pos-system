import express from 'express';
import { supabase } from '../utils/supabaseClient.js';
import { requireRole } from '../middleware/auth.js';
import { consumeInventoryFromOrderItems } from '../services/inventoryService.js';

export const router = express.Router();

router.get('/', requireRole(['Administrador', 'Gerente', 'Mesero', 'Barra', 'Cocina']), async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name)), tables(number)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireRole(['Mesero', 'Administrador', 'Gerente']), async (req, res, next) => {
  try {
    const { table_id, items, status = 'open', payment_method } = req.body;
    const { data: order, error } = await supabase
      .from('orders')
      .insert({ table_id, status, payment_method })
      .select()
      .single();
    if (error) throw error;

    const itemsWithOrder = items.map((item) => ({ ...item, order_id: order.id }));
    const { data: createdItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrder)
      .select();
    if (itemsError) throw itemsError;

    await consumeInventoryFromOrderItems(itemsWithOrder);

    await supabase.from('kitchen_tickets').insert({ order_id: order.id, status: 'pending' });
    await supabase.from('bar_tickets').insert({ order_id: order.id, status: 'pending' });

    res.status(201).json({ order, items: createdItems });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', requireRole(['Mesero', 'Administrador', 'Gerente']), async (req, res, next) => {
  try {
    const { status, payment_method } = req.body;
    const { data, error } = await supabase
      .from('orders')
      .update({ status, payment_method })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});
