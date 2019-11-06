# Univers Orders API

This project is aimed at handling orders and order related material like taxes.

## Install

### Setup Firebase

`cp app/firebase.credential.sample.json app/firebase.credential.json` and edit the correct values from your service account on Firebase.

`cp app/config.sample.js app/config.js` and edit the `firebase -> databaseURL` parameter to your project.

### Setup External APIs

`cp app/apis.config.sample.json app/apis.config.json` and edit with the correct URIs for your production `univers-api-shipping` and `firebase functions` API endpoints.

## Orders

TBC

## Taxes

The `taxes` module utilizes [TaxJar](https://www.taxjar.com) for getting tax information for orders.

This module is basically a wrapper for those methods.

## Deploying

Use google app engine to deploy

`gcloud app deploy ./app.yaml`
