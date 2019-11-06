# Application Brief: Methodology : Stack | Container Services

In our stack we use `redux` and subsequently `react-redux` to handle our "store" of services which allow our app components to communicate with outside services and with one another (albeit ambiguously)

Each service is composed of the following:

`actions`  The actions that handle events

`index`    Injects the service into the app

`reducer`  Handles state changes caused by actions

A very simple service is the Notifications service. By observing the source here, it provisions a view of the services managed.

```js
// First we import our injector
import { injectReducer } from '../../store/reducers'

export default (store) => {
  // Now we load our reducer
  const reducer = require('./reducer').default;
  // And inject it with a 'key' name for use later.
  // Each store should have a default state, which we'll get to next
  injectReducer(store, {key: 'notifications', reducer});
}
```

Let's review what is occuring with the reducer:

```js
// Store our action events in a constants file for easy use across multiple files
import { notifications as N } from '../../constants';

// Set our initial state of the store
const initialState = {
  messages: [],
  errors: []
};

// Now, create use cases for the different events we want handled
export default (state, action) => {
	switch (action.type) {
    // Here an ERROR is handled
    case N.FEEDBACK_DISPLAY_ERROR:
    // Return a new instance of an array, we don't want to
    // deal with mutable objects
			return {
        errors: [...state.errors, action.error],
        messages: state.messages
      }
    break;
    // Here a message is handled
    case N.FEEDBACK_DISPLAY_MESSAGE:
			return {
        errors: state.errors,
        messages: [...state.messages, action.message]
      }
    break;
    case N.REMOVE_ERROR:
      return {
        errors: [
          ...state.errors.slice(0, action.index),
          ...state.errors.slice(action.index+1)
        ],
        messages: state.messages
      }
    break;
    case N.REMOVE_MESSAGE:
      return {
        errors: state.errors,
        messages: [
          ...state.messages.slice(0, action.index),
          ...state.messages.slice(action.index+1)
        ]
      }
    break;
    // If there's no event to handle, we return the state or initialState if state is not set
		default: return state || initialState;
	}
};
```

Now that a store service is setup, we can add it to our `AppContainer`

```js
constructor(props) {
  super(props);
  // Load our Notifications service
  require('./Notifications').default(props.store);
}
```

We now have our service running!

## Integrating with Components

The next step is integrating our service with components. This is relatively simple, we just have to bind our state to a route component using `react-redux`.

In this scenario I want to place my errors and messages in the `Header` component, but you could choose to put these in any component or route view.

```js
import React from 'react'
import { IndexLink, Link } from 'react-router'
// We need the react-redux 'connect' piece for this
import { connect } from 'react-redux'
// Our actions for the service we've created
import { removeError } from 'react-univers-notifications'
import './Header.scss'

export class Header extends React.Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  // Grab the index parameter from evt.target.dataset.index
  // This is a unique way of doing this because React does not
  // have a simple way to pass data to a method in JSX
  handleClose(evt) {
    this.props.removeError(evt.target.dataset.index);
  }

  render() {
    return (
      <div className="header">
        <div className="error alerts">
          {this.props.notifications.errors.map((err, index) => {
            let indexAttr = {'data-index': index};
            return (<div key={index} className="alert">{err} <a {...indexAttr} className="close" onClick={this.handleClose}>close</a></div>)
          })}
        </div>
      </div>
    )
  }
}

// Map the state from our reducer to the component properties
const mapStateToProps = (state) => {
	return { notifications: state.notifications };
};

// Map dispatch methods to properties in the component
const mapDispatchToProps = {
  removeError
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)

```

This covers how to implement our `actions` into a component. The `actions` listed below are an example of how to dispatch new events.

```js
import { notifications as N } from '../../constants';

export const removeError = (index) => {
  return (dispatch) => {
    dispatch({ type: N.REMOVE_ERROR, index: index });
  };
};

export const removeMessage = (index) => {
  return (dispatch) => {
    dispatch({ type: N.REMOVE_MESSAGE, index: index });
  };
};
```

That covers how to utilize the service created for Notifications!
