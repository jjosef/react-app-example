import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'

class App extends Component {

  constructor(props) {
    super(props);
    // seems like a decent place to add in
    require('react-univers-auth').default(props.store);
    require('react-univers-database').default(props.store);
    require('react-univers-notifications').default(props.store);
  }

  componentWillMount() {
		this.props.store.dispatch(require('react-univers-auth').listenToAuth());
	}

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={browserHistory} children={routes} />
        </div>
      </Provider>
    )
  }
}

App.propTypes = {
  routes : PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  store  : PropTypes.object.isRequired
}

export default App
