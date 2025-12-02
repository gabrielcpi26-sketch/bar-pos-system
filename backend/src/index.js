import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { router as loginRouter } from './routes/login.js';
import { router as mesasRouter } from './routes/mesas.js';
import { router as ordenesRouter } from './routes/ordenes.js';
import { router as inventarioRouter } from './routes/inventario.js';
import { router as productosRouter } from './routes/productos.js';
import { router as usuariosRouter } from './routes/usuarios.js';
import { router as reportesRouter } from './routes/reportes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Bar POS API' });
});

app.use('/login', loginRouter);
app.use('/mesas', mesasRouter);
app.use('/ordenes', ordenesRouter);
app.use('/inventario', inventarioRouter);
app.use('/productos', productosRouter);
app.use('/usuarios', usuariosRouter);
app.use('/reportes', reportesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on ${port}`));
