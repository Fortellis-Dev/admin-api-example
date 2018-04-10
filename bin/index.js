#!/usr/bin/env node

const express = require('express');
const app = express();
const adminApi = require('../routes/admin-api.js');

app.use('/v0/admin', adminApi);

app.listen(3000);