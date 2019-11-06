import React from 'react'
import Autosuggest from 'react-autosuggest'
import firebase from 'firebase';

export class RelatedProducts extends React.Component {
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
    if(newProps.state && newProps.state.length && this.state.products.length === 0) {
      // need to pull in product data here.
      this.setState({products: newProps.state});
    }
  }

  handleChange() {
    let newEvt = {
      target: {
        name: this.props.name,
        value: this.state.products
      }
    };
    this.props.onChange(newEvt);
  }

  addProduct(p) {
    let _id = p._id;
    if(this.state.products.indexOf(p) > -1) return;

    let newDetails = {[_id]: p, ...this.state.details};

    this.setState({
      products: [...this.state.products, ...[_id]],
      details: newDetails,
      searchText: ''
    });
  }

  removeProduct(index) {
    let selected = null;
    for(let i = 0, k = this.state.products.length; i < k; i++) {
      if(this.state.products[i] === index) {
        selected = i;
        break;
      }
    }
    let {[index]: deleted, ...newDetails} = this.state.details;
    this.setState({
      products: [...this.state.products.slice(0, selected), ...this.state.products.slice(selected+1)],
      details: newDetails
    });
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
        if(this.props.formState._id && (item.getKey() === this.props.formState._id)) return;
        if(this.state.products.indexOf(item.getKey()) > -1) return;

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
    console.log('Autosuggest: ', suggestion);
    this.addProduct(suggestion.suggestion);
  }

  changeRelatedText($evt) {
    this.setState({searchText: $evt.target.value});
  }

  render() {
    let {context, name, ...props} = this.props;

    let relateds = [];
    for(let k in this.state.details) {
      let p = this.state.details[k];
      relateds.push((
        <div className="col-3">
          <div className="related-product" key={'related-' + k}>
            <span className="product-image"><img src={p.images[0]} /></span>
            <span className="product-name">{p.name}</span>
            <a onClick={this.removeProduct.bind(this, k)}><i className="mdi mdi-delete" /></a>
          </div>
        </div>
      ));
    }

    const inputProps = {
      placeholder: 'Search products to add as related',
      value: this.state.searchText,
      onChange: this.changeRelatedText,
      name: 'searchText'
    };

    return (
      <div className="related-products">
        <div className="row">
          <div className="col">
            <h4>Related Products</h4>
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
        <div className="row">
          {relateds}
        </div>
      </div>
    )
  }
}
