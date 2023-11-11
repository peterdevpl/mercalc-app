'use strict';

// This script downloads recent daily exchange rates for EUR/PLN from nbp.pl API

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(path.dirname(__dirname), 'rates-nbp.json');
const ratesData = fs.readFileSync(filePath);
const allRates = JSON.parse(ratesData);

const today = new Date();
const todayDateString = today.toISOString().substring(0, 10);
const lastRate = allRates.rates[allRates.rates.length - 1];

if (lastRate.effectiveDate === todayDateString) {
  console.log('Rates up-to-date, skipping');
  process.exit();
}

const lastRateDate = new Date(lastRate.effectiveDate);
lastRateDate.setDate(lastRateDate.getDate() + 1);
const lastRateDateString = lastRateDate.toISOString().substring(0, 10);

const url = 'https://api.nbp.pl/api/exchangerates/rates/A/EUR/' + lastRateDateString + '/' + todayDateString + '/?format=json';

console.log('Trying ' + url);

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  }).then((body) => {
    if (body.rates.length === 0) {
      console.log('Empty NBP rates, skipping');
    } else {
      let change = false;
      for (const rate of body.rates) {
        if (lastRate.effectiveDate !== rate.effectiveDate) {
          allRates.rates.push(rate);
          change = true;
        }
      }
      if (change) {
        fs.writeFileSync(filePath, JSON.stringify(allRates));
        console.log('Rates updated');
      } else {
        console.log('No new rates');
      }
    }
  }).catch((error) => {
    console.log('Error fetching rates: ' + error);
  });
