import dotenv from 'dotenv';
import { supabase } from '../utils/supabaseClient.js';

dotenv.config();

export const requireRole = (roles = []) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Missing token' });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ message: 'Invalid token' });

    req.user = user;
    if (roles.length) {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role_id, roles(name)')
        .eq('id', user.id)
        .single();
      if (profileError || !profile) return res.status(403).json({ message: 'Role check failed' });
      const roleName = profile.roles?.name;
      if (!roles.includes(roleName)) return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  } catch (err) {
    next(err);
  }
};
