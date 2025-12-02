import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../utils/supabaseClient.js';

export const router = express.Router();

router.post(
  '/',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { email, password } = req.body;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return res.status(401).json({ message: error.message });
      res.json({ session: data.session, user: data.user });
    } catch (err) {
      next(err);
    }
  }
);
