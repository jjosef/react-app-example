import React from 'react'
import axios from 'axios';
import Autosuggest from 'react-autosuggest'
import immutable from 'object-path-immutable'
import Portal from 'react-portal'
import { services as S, routeStates as R } from '~/constants/';
import { OrderEmitter } from '../'
import firebase from 'firebase';

let orderAddSub;
let orderUpdateSub;
let orderRemoveSub;

class ShipmentCreator extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    let { handleShipmentChange, state, ...props} = this.props;
    let productChoices = [];
    for(let [key, product] of Object.entries(state.products)) {
      let variants = []
      for(let [name, value] of Object.entries(product.variants)) {
        variants.push((
          <span key={name}>{name}: {value}</span>
        ))
      }
      productChoices.push((
        <tr key={key}>
          <td>
            <label className="custom-control custom-checkbox">
              <input name="checkbox-stacked" type="checkbox" className="custom-control-input" checked={state.newShipment.products[key]} onChange={handleShipmentChange} name={'newShipment.products.' + key} />
              <span className="custom-control-indicator"></span>
            </label>
          </td>
          <td>{product.details.name}</td>
          <td>{variants}</td>
          <td>{product.details.weight * product.qty} lbs</td>
        </tr>
      ));
    }

    let rates = [];
    if(state.rates.length) {
      rates.push((
        <option key="no-carrier">Select a rate</option>
      ))
      state.rates.map((r, i) => {
        rates.push((
          <option key={r.serviceCode + i} value={i}>{r.serviceName} (${r.shipmentCost})</option>
        ));
      })
    } else {
      rates.push((
        <option key="no-carrier">Select a carrier and product(s)...</option>
      ))
    }

    let disabled = true;
    if(state.newShipment.rate) {
      disabled = false;
    }

    return (
      <div className="option-modal-wrapper">
        <div className="option-modal order-shipment-creator">
          <div className="option-modal-content">
            <h4>Shipment Creator</h4>
            <div className="form-group">
              <label>Shipment Carrier</label>
              <select className="form-control custom-select" name="newShipment.carrier" value={state.newShipment.carrier} onChange={handleShipmentChange}>
                <option value="">Select a carrier</option>
                {state.carriers.map((c) => {
                  return <option key={c.code} value={c.code}>{c.name}</option>
                })}
              </select>
            </div>
            <div className="custom-controls-stacked form-group">
              <label>Pick Products for this Shipment</label>
              <table className="table">
                <thead>
                  <tr>
                    <th className="checkbox"></th>
                    <th>Product Name</th>
                    <th>Variants</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {productChoices}
                </tbody>
              </table>
            </div>
            <div className="form-group">
              <label>Carrier Rate</label>
              <select className="form-control custom-select" name="newShipment.rate" value={state.newShipment.rate} onChange={handleShipmentChange}>
                {rates}
              </select>
            </div>
          </div>
          <div className="option-modal-footer">
            <button className="btn mr-2" onClick={this.props.closePortal}>Cancel</button>
            <button className="btn btn-primary" disabled={disabled} onClick={this.props.closePortal}>Create Shipment</button>
          </div>
        </div>
      </div>
    )
  }
}

export class OrderShipments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shipments: {},
      products: {},
      carriers: [],
      rates: [],
      organization_settings: {},
      newShipment: {
        carrier: '',
        rate: '',
        products: {}
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleShipmentChange = this.handleShipmentChange.bind(this);
    this.addShipment = this.addShipment.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.state && newProps.state.shipments && Object.keys(this.state.shipments).length === 0) {
      // need to pull in product data here.
      this.setState({shipments: newProps.state.shipments});
    }
  }

  componentWillMount() {
    firebase.database().ref(`settings/${this.props.auth.organization}/organization`).once('value').then((snapshot) => {
      this.setState(immutable.set(this.state, 'organization_settings', snapshot.val()));
    });
    orderAddSub = OrderEmitter.addListener('product-added', (data) => {
      let {id, ...product} = data;
      let newState = immutable.set(this.state, 'newShipment.products.' + id, false);
      newState = immutable.set(newState, 'products', {[id]: product});
      console.log(newState);
      this.setState(newState);
      // we also need to create shipments for the products here.
      // CreateShipmentFromProducts
    });
    orderUpdateSub = OrderEmitter.addListener('products-updated', (data) => {
      let newProducts = this.state.products;
      data.products.map((product) => {
        newProducts[product.id].qty = product.qty;
        newProducts[product.id].variants = product.variants;
      });
      this.setState(immutable.set(this.state, 'products', newProducts));
    });
    orderRemoveSub = OrderEmitter.addListener('product-removed', (index) => {
      let {[index]: deleted, ...newProducts} = this.state.products;
      let {[index]: deleted2, ...newShipmentProducts} = this.state.newShipment.products;
      let newState = immutable.set(this.state, 'products', newProducts);
      newState = immutable.set(newState, 'newShipment.products', newShipmentProducts);
      this.setState(newState);
    });
    this.getCarriers().then((carriers) => {
      if(!carriers.data || !carriers.data.length) return;
      this.setState(immutable.set(this.state, 'carriers', carriers.data));
      /*
      this.getShipmentRating({
        carrierCode: carriers.data[2].code,
        fromPostalCode: '44622',
        toPostalCode: '28205',
        toCountry: 'US',
        weight: {
          value: 2,
          units: 'pounds'
        }
      });
      */
    });
  }

  // unregister all references here
  componentWillUnmount() {
    orderAddSub.remove();
    orderUpdateSub.remove();
    orderRemoveSub.remove();
  }

  getCarriers() {
    return axios.get(S.url('functions', '/shipping/carriers'), {headers: {organization_id: this.props.auth.organization}})
      .then((carriers) => {
        return carriers;
      }).catch((err) => {
        console.log(err);
        return err;
      });
  }

  getCarrierServices(carrierCode) {
    return axios.get(S.url('functions', '/shipping/carriers/services'), {params: {carrierCode: carrierCode}}, {headers: {organization_id: this.props.auth.organization}})
      .then((services) => {
        return services;
      }).catch((err) => {
        console.log(err);
        return err;
      });
  }

  getCarrierPackages(carrierCode) {
    return axios.get(S.url('functions', '/shipping/carriers/packages'), {params: {carrierCode: carrierCode}}, {headers: {organization_id: this.props.auth.organization}})
      .then((packages) => {
        return packages;
      }).catch((err) => {
        console.log(err);
        return err;
      });
  }

  /**
   *  Shipment should be an object with parameters meeting the api-shipping/modules/shipping/components/rates requirements
   */
  getShipmentRating(shipment) {
    return axios.post(S.url('functions', '/shipping/rates'), shipment, {headers: {organization_id: this.props.auth.organization}}).then((rates) => {
      console.log(rates.data);
      return rates;
    }).catch((err) => {
      console.log(err);
    })
  }


  handleShipmentChange($evt) {
    if($evt.target.type === 'checkbox') {
      this.setState(immutable.set(this.state, $evt.target.name, $evt.target.checked));
    } else {
      this.setState(immutable.set(this.state, $evt.target.name, $evt.target.value));
    }
    setTimeout(() => this.createShipmentRating($evt));
  }

  createShipmentRating($evt) {
    let weight = 0;
    for(let id in this.state.newShipment.products) {
      let included = this.state.newShipment.products[id];
      if(included) {
        weight = this.state.products[id].details.weight * this.state.products[id].qty;
      }
    }

    if(!weight) return;
    if(!this.state.newShipment.carrier || !this.state.newShipment.carrier.length) return;
    if(!this.props.formState.form.shipping_info.address.postal_code) return;

    let shipment = {
      carrierCode: this.state.newShipment.carrier,
      weight: {value: weight, unit: 'pounds'},
      toPostalCode: this.props.formState.form.shipping_info.address.postal_code,
      toCountry: this.props.formState.form.shipping_info.address.country_code,
      fromPostalCode: this.state.organization_settings.company_address.address.postal_code,
      residential: this.props.formState.form.residential
    }

    this.getShipmentRating(shipment).then((rates) => {
      console.log(rates);
      this.setState(immutable.set(this.state, 'rates', rates.data));
    }).catch((err) => {

    })
  }

  addShipment() {
    if(!this.state.newShipment.rate) return;

    setTimeout(() => {
      let id = Object.keys(this.state.shipments).length+1;
      let state = this.state;
      let weight = 0;
      for(let i in state.newShipment.products) {
        weight += state.products[i].qty * state.products[i].details.weight;
      }
      console.log(state.newShipment.rate);
      state.shipments[id] = Object.assign({}, state.newShipment, {weight: weight});
      state.shipments[id].rate = state.rates[state.newShipment.rate];
      state.newShipment = {
        carrier: '',
        rate: '',
        products: {}
      }
      state.rates = [];
      this.setState(state);
      this.handleChange();
    }, 100);
  }

  removeShipment(index) {
    let {[index]: deleted, ...newShipments} = this.state.shipments;
    this.setState(immutable.set(this.state, 'shipments', newShipments));
    this.handleChange();
  }

  handleChange() {
    let newEvt = {
      target: {
        name: this.props.name,
        value: this.state.shipments
      }
    };
    this.props.onChange(newEvt);
  }

  render() {
    let {context, name, ...props} = this.props;

    let shipments = [];
    if(Object.keys(this.state.shipments).length > 0) {
      for(let k in this.state.shipments) {
        let sh = this.state.shipments[k];
        shipments.push((
          <tr key={k}>
            <td>{sh.rate.serviceName}</td>
            <td>{sh.weight} lbs</td>
            <td>${sh.rate.shipmentCost}</td>
            <td>
              <a className="btn btn-secondary btn-sm" onClick={this.removeShipment.bind(this, k)}><i className="mdi mdi-delete" /></a>
            </td>
          </tr>
        ));
      }
    } else {
      shipments.push((
        <tr key="no-shipments">
          <td colSpan="5">
            <p className="alert alert-info">No shipments yet, once you fill out shipping details and add products you can create a shipment</p>
          </td>
        </tr>
      ));
    }

    let addShipmentButton = <button className="btn btn-primary" onClick={this.handleAddShipment}>Add a Shipment</button>

    return (
      <div className="order-shipments">
        <div className="row">
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th className="shipment-rate">Rate</th>
                  <th className="shipment-weight">Weight</th>
                  <th className="shipment-cost">Cost</th>
                  <th className="shipment-actions text-right"></th>
                </tr>
              </thead>
              <tbody>
                {shipments}
              </tbody>
            </table>
            <div className="text-center">
              <Portal closeOnEsc closeOnOutsideClick openByClickOn={addShipmentButton} onClose={this.addShipment}>
                <ShipmentCreator handleShipmentChange={this.handleShipmentChange} state={this.state} />
              </Portal>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
