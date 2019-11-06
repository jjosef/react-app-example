import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './store/createStore'
import { AppContainer } from 'react-hot-loader';
import * as firebase from 'firebase'
import { firebaseConfig } from './constants'
import App from './containers/App'
import 'bootstrap/scss/bootstrap.scss'

firebase.initializeApp(firebaseConfig);

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__
const store = createStore(initialState)

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = (Component) => {
  const routes = require('./routes/index').default(store)

  if(__DEV__) {
    ReactDOM.render(
      <AppContainer>
        <Component store={store} routes={routes} />
      </AppContainer>,
      MOUNT_NODE
    )
  } else {
    ReactDOM.render(
      <Component store={store} routes={routes} />,
      MOUNT_NODE
    )
  }
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp(App)
      } catch (error) {
        console.error(error)
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () => {
      render(App)
    })
  }
}

// ========================================================
// Go!
// ========================================================
render(App)
