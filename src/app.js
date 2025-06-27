const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
// const invoiceRoutes = require('./routes/invoiceRoutes');


app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
// app.use('/invoices', invoiceRoutes);

module.exports = app;