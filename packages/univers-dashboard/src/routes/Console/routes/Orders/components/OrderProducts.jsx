import React from 'react'
import Autosuggest from 'react-autosuggest'
import immutable from 'object-path-immutable'
import Portal from 'react-portal'
import { OrderEmitter } from '../'
import firebase from 'firebase';

class ProductVariants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variants: this.props.product.variants
    };
  }

  handleChange($evt) {
    let newVariants = immutable.set(this.state, $evt.target.name, $evt.target.value)
    this.setState(newVariants);

    let newEvt = {
      target: {
        name: 'products.' + this.props.index + '.' + $evt.target.name,
        value: $evt.target.value
      }
    }

    this.props.handleChange(newEvt);
  }

  render() {
    let {product, details, ...props} = this.props;
    let variants = [];
    details.variants.list.map((v, i) => {
      let choices = [];
      v.options.map((o, k) => {
        choices.push((
          <option key={v.name + '.option' + k} value={o.name}>{o.name}</option>
        ));
      });
      variants.push((
        <div className="variant" key={'variants' + i}>
          <div className="form-group">
            <label>{v.name}</label>
            <select className="form-control" name={'variants.' + v.name} value={this.state.variants[v.name]} onChange={this.handleChange.bind(this)}>
              <option>Select an option</option>
              {choices}
            </select>
          </div>
        </div>
      ));
    });

    return (
      <div className="option-modal-wrapper">
        <div className="option-modal order-product-variants">
          <div className="option-modal-content">
            <h4>Select Variants</h4>
            {variants}
          </div>
          <div className="option-modal-footer">
            <button className="btn btn-primary" onClick={this.props.closePortal}>OK</button>
          </div>
        </div>
      </div>
    )
  }
}

export class OrderProducts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      details: {}, // key based list
      searchText: '',
      suggestions: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.changeRelatedText = this.changeRelatedText.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.state && newProps.state.length && this.state.length === 0) {
      // need to pull in product data here.
      this.setState({products: newProps.state});
    }
  }

  handleChange($evt) {
    let newProducts = immutable.set(this.state, $evt.target.name, $evt.target.value);
    this.setState(newProducts);
    let newEvt = {
      target: {
        name: this.props.name,
        value: this.state.products
      }
    };
    this.props.onChange(newEvt);
    OrderEmitter.emit('products-updated', newProducts);
  }

  addProduct(p) {
    let _id = p._id;
    if(this.state.products.indexOf(p) > -1) return;

    let newDetails = {[_id]: p, ...this.state.details};

    let productVariants = {};
    if(p.variants) {
      p.variants.list.map((variant) => {
        if(!variant.options || !variant.options.length) return;
        productVariants[variant.name] = '';
        if(variant.required) {
          productVariants[variant.name] = variant.options[0].name;
        }
        variant.options.map((o) => {
          if(o.default) {
            productVariants[variant.name] = o.name;
          }
        })
      });
    }

    let newProducts = [...this.state.products, ...[{id: _id, qty: 1, price: p.price, variants: productVariants}]];

    this.setState({
      products: newProducts,
      details: newDetails,
      searchText: ''
    });
    let newEvt = {
      target: {
        name: this.props.name,
        value: newProducts
      }
    };
    this.props.onChange(newEvt);
    OrderEmitter.emit('product-added', {id: _id, qty: 1, price: p.price, variants: productVariants, details: p});
  }

  removeProduct(selected, index) {
    let {[index]: deleted, ...newDetails} = this.state.details;
    let newProducts = [...this.state.products.slice(0, selected), ...this.state.products.slice(selected+1)];
    this.setState({
      products: newProducts,
      details: newDetails
    });
    let newEvt = {
      target: {
        name: this.props.name,
        value: newProducts
      }
    };
    this.props.onChange(newEvt);
    OrderEmitter.emit('product-removed', index);
  }

  getSuggestionValue(suggestion) {
    return suggestion.name;
  }

  renderSuggestion(suggestion) {
    return (
      <div>
        {suggestion.name}
      </div>
    )
  }

  onSuggestionsFetchRequested({ value }) {
    let ref = firebase.database().ref(`/products/${this.props.auth.organization}`);
    ref.orderByChild('name').on('value', (snapshot) => {
      let s = [];
      snapshot.forEach((item) => {
        let v = item.val();

        if(v['name'] && v['name'].match(new RegExp(value, "i"))) {
          let key = {_id: item.getKey()};
          s.push({...item.val(), ...key});
        }
      });

      this.setState({
        suggestions: s
      });
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected(evt, suggestion) {
    this.addProduct(suggestion.suggestion);
  }

  changeRelatedText($evt) {
    this.setState({searchText: $evt.target.value});
  }

  changeProductValue(index, $evt) {
    let newProducts = immutable.set(this.state, $evt.target.name, $evt.target.value);
    this.setState(newProducts);
    let newEvt = {
      target: {
        name: this.props.name,
        value: newProducts.products
      }
    };
    this.props.onChange(newEvt);
    OrderEmitter.emit('products-updated', newProducts);
  }

  render() {
    let {context, name, ...props} = this.props;

    let ops = [];
    this.state.products.map((p, k) => {
      let details = this.state.details[p.id];
      let variantBtn = <button className="btn btn-secondary btn-sm"><i className="mdi mdi-settings" /> Variants</button>;
      ops.push((
        <tr key={'op-' + k} className="order-product">
          <td className="product-image"><img src={details.images[0]} /></td>
          <td className="product-name">{details.name}</td>
          <td className="product-qty"><input className="form-control" type="number" value={p.qty} name={'products.' + k + '.qty'} onChange={this.changeProductValue.bind(this, k)} /></td>
          <td className="product-price">${p.price}</td>
          <td className="product-total">${(p.price * p.qty).toFixed(2)}</td>
          <td className="product-actions text-right">
            {details.variants ? (
              <Portal closeOnEsc closeOnOutsideClick openByClickOn={variantBtn}>
                <ProductVariants product={p} index={k} details={details} handleChange={this.handleChange}></ProductVariants>
              </Portal>
            ): ''}
            <a className="btn btn-secondary btn-sm" onClick={this.removeProduct.bind(this, k, p.id)}><i className="mdi mdi-delete" /></a>
          </td>
        </tr>
      ));
    });

    const inputProps = {
      placeholder: 'Search products to add to order',
      value: this.state.searchText,
      onChange: this.changeRelatedText,
      name: 'searchText'
    };

    return (
      <div className="order-products">
        <div className="row">
          <div className="col">
            <div className={'form-group autosuggest ' + name}>
              <Autosuggest
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
                onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                getSuggestionValue={this.getSuggestionValue.bind(this)}
                renderSuggestion={this.renderSuggestion.bind(this)}
                inputProps={inputProps}
                theme={{input: 'form-control react-autosuggest__input'}}
              />
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th className="product-image"></th>
              <th className="product-name">Product Name</th>
              <th className="product-qty">Quantity</th>
              <th className="product-price">Price</th>
              <th className="product-total">Line Price</th>
              <th className="product-actions text-right"></th>
            </tr>
          </thead>
          <tbody>
            {ops}
          </tbody>
        </table>
      </div>
    )
  }
}
