import express from 'express';
import { supabase } from '../utils/supabaseClient.js';
import { requireRole } from '../middleware/auth.js';

export const router = express.Router();

router.get('/', requireRole(['Administrador', 'Gerente']), async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, roles(name)');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireRole(['Administrador']), async (req, res, next) => {
  try {
    const { email, password, full_name, role_id } = req.body;
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (authError) throw authError;
    const { data, error } = await supabase
      .from('users')
      .insert({ id: authUser.user.id, email, full_name, role_id })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});
