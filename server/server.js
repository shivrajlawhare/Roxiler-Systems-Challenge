const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const CONNECTION_URL = 'mongodb+srv://shivrajlawhare6:shivrajlawhare6@cluster0.lzadmii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const transactionsRoute = require('./routes/transactions');
app.use('/api/transactions', transactionsRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

