# Univers Firebase functions

## Setup

`firebase use --add`

### Medium Setup

Set up your application here: [https://medium.com/me/applications](https://medium.com/me/applications)

`firebase functions:config:set medium.client_id="<CLIENT_ID>"`

`firebase functions:config:set medium.client_secret="<CLIENT_SECRET>"`

`firebase functions:config:set medium.redirect_uri="<REDIRECT_URI>"`

### Notifier Setup

Set your email provider. Valid providers currently:

- `gmail`
- `mailgun`

`firebase functions:config:set notifier.provider="<PROVIDER>"`

#### Gmail Setup

If you choose to use gmail, you'll need to add some additional config.

`firebase functions:config:set gmail.email="<EMAIL>"`

`firebase functions:config:set gmail.password="<PASSWORD>"`

#### Mailgun Setup

If you choose to use mailgun, you'll need to add some additional config.

`firebase functions:config:set mailgun.api_key="<API_KEY>"`

`firebase functions:config:set mailgun.domain="<DOMAIN>"`

`firebase functions:config:set mailgun.email_from="<EMAIL_FROM>"`

## Deploy

`firebase deploy`
