>>> Note this is an example repository using technology from around 2014-2016. It is not intended for production use and is vastly outdated!!!

# Univers

## Features
* [react](https://github.com/facebook/react)
* [redux](https://github.com/rackt/redux)
* [react-router](https://github.com/rackt/react-router)
* [webpack](https://github.com/webpack/webpack)
* [babel](https://github.com/babel/babel)
* [express](https://github.com/expressjs/express)
* [karma](https://github.com/karma-runner/karma)
* [eslint](http://eslint.org)

## Requirements
* node `^7.0.0`
* yarn `^0.17.0` or npm `^3.0.0`
* lerna `^2.0.0`

## Main Web Development stack
* react `^15.4.0`
* redux `^3.6.0`
* bootstrap `^4.0.0`

## Main API Development stack
* restify `^4.3.0`
* firebase-admin `^4.1.0`

## Getting Started

You'll want to make sure you have the latest NodeJS installed. The best way to do this is by installing NodeJS, though once you've completed this, adding the n package will allow you to easily update which version of Node you're using.

`$ npm install -g n`

Now we can make sure we're using the latest version of Node:

`$ n latest`

You'll also want to make sure you have `yarn` and `lerna` installed.

Let's clone our repo

`$ git clone git@github.com:uh-sem-blee/univers.git`

We're using `lerna`, to make multi-package projects easy to manage. Inside the repo you'll find a `lerna.json`, `package.json`, and the `packages` directory. You can (optionally) call `$ lerna bootstrap` which will install dependencies for all the packages at once, and if you add a new package just issue $ lerna init again to add new packages to the configuration.

Let's get into the packages

`$ cd packages`

Now you're in a directory with our packages:

- [api-orders](packages/api-orders) - The Orders and Taxation API handlers
- [api-shipping](packages/api-shipping) - The Shipping rating and label generation API handlers
- [api-utilities](packages/api-utilities) - Utility handlers for things like image resizing and notifications
- [firebase-functions](packages/firebase-functions) - The area to build Firebase functions for the app suite
- [univers-dashboard](packages/univers-dashboard) - The Dashboard web application
- [univers-web](packages/univers-web) - The Web store front-end web application
- [univers-mobile](packages/univers-mobile) - TBD

Let's start with `univers-dashboard`:

`$ cd univers-dashboard`

From here we want to install our developer dependencies (if you didn't with lerna before):

`$ yarn install`

Now run the app:

`$ yarn start`

Happy developing!

## Building with Firebase

We will cover how to build your API and Storage needs using Firebase.

### Create your app in Firebase

[Create your Firebase](https://console.firebase.google.com/) app in the console.

### Initialize your app

In the Firebase Console, in the Overview click the Add Firebase to your web app button.

You will be prompted with a window that has a config variable. You need to copy all of this into `config/firebase.js`

### Enable Google Auth

To sign users in we'll use Google auth which needs to be enabled.
In the Auth section > SIGN IN METHOD tab you need to enable the Google Sign-in Provider and click SAVE. You can also enable any other Sign-in providers you would like for this application.

### Make sure you have Firebase CLI tools

`$ npm -g install firebase-tools`

Next, login to firebase:

`$ firebase login`

Select your current project to use and deploy to:

`$ firebase use --add`

### Deploy your app

First we need to compile the app

`$ NODE_ENV=production yarn run deploy`

Once this completes, you can deploy to firebase hosting

`$ firebase deploy`

The CLI will output a URL for you to view the app in your web browser, you can add a custom domain with instructions [here](https://firebase.google.com/docs/hosting/custom-domain).

## Firebase Rules

The permissions system in Firebase allows us to create some good restrictions for our organization, however not all database transactions should happen from the frontend. Many will require an API to be built (see API projects) that allow us to perform actions outside of the standard DB rules.

```
{
  organizations: {
    $organization_id: { // <-- only written by owners
      ...
    }
  },
  orders: {
    $organization_id: { // <-- only users with 'orders' permissions to read (r) or write (w) can access
      ...
    }
  },
  // ... same for products and other major objects ...
  user_permissions: {
    $user_id: {
      $organization_id: { // <-- this can only be written by other owners
        owner: Boolean,
        orders: {r: Boolean, w: Boolean},
        products: {r: Boolean, w: Boolean},
        customers: {r: Boolean, w: Boolean},
        settings: {r: Boolean, w: Boolean},
        discounts: {r: Boolean, w: Boolean},
        integrations: {r: Boolean, w: Boolean}
      },
      admin: Boolean // <-- this can only be written by other admin
    }
  }
}
```
