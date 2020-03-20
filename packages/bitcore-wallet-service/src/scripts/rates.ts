#!/usr/bin/env node

const request = require('request');

// import { Storage } from '../lib/storage';

const coin = process.argv[2];

if (!coin) {
  console.log('Provide Coin');
  process.exit(1);
}

const apiKey = process.argv[3];
const time = process.argv[4];

console.log('COIN:', coin);

if (!apiKey) throw new Error('provide authKey');

let url = `https://rest.coinapi.io/v1/exchangerate/${coin}/USD`;

if (time) {
  url = url + '?time=' + time;
}

request.get(
  url,
  {
    headers: { 'X-CoinAPI-Key': `${apiKey}` }
  },
  (err, req, body) => {
    if (err) {
      console.log('[v8tool.43:err:]', err);
    } else {
      try {
        console.log('[v8tool.50:body:]', body);
      } catch (e) {
        console.log('[v8tool.52]', e, body);
      }
    }
  }
);
