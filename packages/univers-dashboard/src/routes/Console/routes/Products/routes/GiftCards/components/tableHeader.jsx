import React from 'react';
import firebase from 'firebase';

export class tableHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gift_cards_enabled: false
    }
  }

  componentWillMount() {
    firebase.database().ref(`/settings/${this.props.auth.organization}/organization`).once('value').then((snap) => {
      let settings = snap.val();
      if(!settings) {
        return firebase.database().ref(`/settings/${this.props.auth.organization}/organization/gift_cards_enabled`).set(false);
      }

      this.setState({
        gift_cards_enabled: settings.gift_cards_enabled
      });
    });
  }

  handleToggleGiftCards($evt) {
    let newState = {
      gift_cards_enabled: !this.state.gift_cards_enabled
    }
    firebase.database().ref(`/settings/${this.props.auth.organization}/organization/gift_cards_enabled`).set(!this.state.gift_cards_enabled);
    this.setState(newState);
  }

  render() {
    return (
      <div className="gift-card-enable crud-container">
        <div className="row">
          <div className="col">
            <div className="panel">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4>Gift Card Product {this.state.gift_cards_enabled ? <span className="small green">Enabled</span> : ''}</h4>
                  <p>Enabling the Gift Card Product will allow users to purchase Gift Cards as a product in your store</p>
                </div>
                <span>
                  <button onClick={this.handleToggleGiftCards.bind(this)} className={'btn ' + (this.state.gift_cards_enabled ? 'btn-grey' : 'btn-primary')}>{this.state.gift_cards_enabled ? 'Disable' : 'Enable'}</button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
