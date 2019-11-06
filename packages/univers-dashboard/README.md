# Univers Dashboard App

Components being used:

- [react-autosuggest](http://react-autosuggest.js.org/)
- [react-dropzone](https://github.com/okonet/react-dropzone)
- [react-draft-wysiwyg](https://github.com/jpuri/react-draft-wysiwyg)
- [react-currency-masked-input](https://github.com/ianmcnally/react-currency-masked-input)
- [mdi](https://materialdesignicons.com/) - Material Design Icons

## Setup

### Firebase Setup

`firebase use --add` - Add a stage for default project usage

### Running the app locally

`$ yarn install`

Now run the app:

`$ yarn start`

### Deploying

`NODE_ENV=production yarn run deploy && firebase deploy`

## Developing

Most sections can be created using the `<Crud />` component. This gives decent control over layout, form fields, and types of inputs that can help rapidly build content management systems.

## Application Structure

The application structure presented in this boilerplate is fractal, where functionality is grouped primarily by feature rather than file type. Please note, however, that this structure is only meant to serve as a guide, it is by no means prescriptive. That said, it aims to represent generally accepted guidelines and patterns for building scalable applications.

```
.
├── bin                      # Build/Start scripts
├── config                   # Project and build configurations
├── public                   # Static public assets (not imported anywhere in source code)
├── server                   # Express application that provides webpack middleware
│   └── main.jsx             # Server application entry point
├── src                      # Application source code
│   ├── index.html           # Main HTML page container for app
│   ├── main.jsx             # Application bootstrap and rendering
│   ├── components           # Global Reusable Presentational Components
│   ├── containers           # Global Reusable Container Components
│   │   └── AppContainer.jsx # AppContainer which is the wrapper for the entire application
│   ├── layouts              # Components that dictate major page structure
│   │   └── CoreLayout.jsx   # CoreLayout which receives children for each route
│   │   └── CoreLayout.scss  # Styles related to the CoreLayout
│   │   └── index.jsx        # Main file for layout
│   ├── routes               # Main route definitions and async split points
│   │   ├── index.jsx        # Bootstrap main application routes with store
│   │   ├── Home             # Fractal route
│   │   │   ├── index.jsx    # Route definitions and async split points
│   │   │   ├── assets       # Assets required to render components
│   │   │   ├── components   # Presentational React Components
│   │   │   └── routes **    # Fractal sub-routes (** optional)
│   ├── store                # Redux-specific pieces
│   │   ├── createStore.jsx  # Create and instrument redux store
│   │   └── reducers.jsx     # Reducer registry and injection
│   └── styles               # Application-wide styles (generally settings)
└── tests                    # Unit tests
```

## Overriding Bootstrap Styles

Overriding Boostrap v4 styles is really simple. In `src/styles/core.scss` just add the overrides for the variables you want to edit, such as `$btn-font-weight`, and then append `@import '~bootstrap/scss/bootstrap.scss';` at the end of the file. Example:

```
$btn-font-weight: bold;
@import '~bootstrap/scss/bootstrap.scss';
```

Bootstrap Reference: [[mixins](https://github.com/twbs/bootstrap-sass/tree/master/assets/stylesheets/bootstrap/mixins)] [[variables](https://github.com/twbs/bootstrap-sass/blob/master/assets/stylesheets/bootstrap/_variables.scss)]

### CRUD Module Composition

Each `<Crud />` module is made up of at least the following:

- `index.jsx` - this holds the routing information.
- `Root.jsx` - contains the wrapper for CRUD views.
- `components/Create.jsx` - contains the wrapper for Create method.
- `components/Form.jsx` - contains all the configuration for you CRUD module.
- `components/Update.jsx` - contains the wrapper for Update method.
