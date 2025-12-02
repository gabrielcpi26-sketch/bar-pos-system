#!/usr/bin/env node
import fs from 'fs';
import QRCode from 'qrcode';

const baseUrl = process.env.CLIENT_BASE_URL || 'https://bar.example.com/public';
const table = process.argv[2] || 'mesa-1';
const url = `${baseUrl}?table=${table}`;

QRCode.toFile(`qr-${table}.png`, url, { width: 300 }, (err) => {
  if (err) throw err;
  console.log(`QR generado para ${table} en qr-${table}.png -> ${url}`);
});
