import React from 'react';
import immutable from 'object-path-immutable'
import CurrencyInput from 'react-currency-masked-input';
import '../styles.scss';

export class Variant extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      variant: props.state,
      optionName: '',
      modalOpen: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleOptionNameChange = this.handleOptionNameChange.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleRemoveOption = this.handleRemoveOption.bind(this);
    this.handleOptionFormSubmit = this.handleOptionFormSubmit.bind(this);
  }

  handleChange(evt) {
    let val;
    if(evt.target.type === 'checkbox') {
      val = evt.target.checked;
    } else {
      val = evt.target.value;
    }

    let newVariant = immutable.set(this.state.variant, evt.target.name, val);

    this.setState({
      variant: newVariant
    });

    this.props.onChange({index: this.props.index, variant: newVariant});
  }

  handleOptionNameChange(evt) {
    this.setState({['optionName']: evt.target.value});
  }

  handleAddOption(evt) {
    evt.preventDefault();

    let option = [{
      name: this.state.optionName,
      sku: '',
      images: [],
      color: '#000000',
      price: '0.00',
      weight: 0,
      freight: false,
      image_link: '',
      qty: 0,
      dimensions: {length: null, width: null, height: null}
    }];

    let newOptions = [...this.state.variant.options, ...option];
    let newVariant = immutable.set(this.state.variant, 'options', newOptions);
    this.setState({
      variant: newVariant,
      optionName: '',
      modalOpen: [...this.state.modalOpen, ...[false]]
    });

    this.props.onChange({index: this.props.index, variant: newVariant});
  }

  handleOptionFormSubmit(evt) {
    evt.preventDefault();
  }

  handleRemoveOption(evt) {
    evt.preventDefault();
    let newOptions = [
      ...this.state.variant.options.slice(0, evt.target.dataset.index), ...this.state.variant.options.slice(evt.target.dataset.index+1)
    ];
    let newModals = [
      ...this.state.modalOpen.slice(0, evt.target.dataset.index),
      ...this.state.modalOpen.slice(evt.target.dataset.index+1)
    ]

    let newVariant = immutable.set(this.state.variant, 'options', newOptions);
    this.setState({
      variant: newVariant,
      modalsOpen: newModals
    });

    this.props.onChange({index: this.props.index, variant: newVariant});
  }

  handleConfigOption(index, evt) {
    evt.preventDefault();
    this.setState(immutable.set(this.state, 'modalOpen.' + index, true));
  }

  handleCloseConfigOption(index, evt) {
    evt.preventDefault();
    this.setState(immutable.set(this.state, 'modalOpen.' + index, false));
  }

  handleOptionChange(evt) {
    //let [o, oi, on] = evt.target.name.split('-'); // oi = option index, on = option name
    //let options = this.state.variant.options; // get the options
    //let updatedOption = update(options[oi], {[on]: {$set: evt.target.value}}); // update the option we're working on
    //let newOptions = update(options, {$splice: [[oi, 1, updatedOption]]}); // set our new options by removing the old one and replacing the new one
    let newVariant;
    if(evt.target.type === 'checkbox') {
      newVariant = immutable.set(this.state.variant, evt.target.name, evt.target.checked);
    } else {
      newVariant = immutable.set(this.state.variant, evt.target.name, evt.target.value);
    }
    this.setState({
      variant: newVariant // update our main object
    });

    this.props.onChange({index: this.props.index, variant: newVariant});
  }

  handleModalClick(index, evt) {
    if (evt.target.className.indexOf('option-config') === -1)
      return;

    evt.preventDefault();
    this.handleCloseConfigOption(index, evt);
  }

  render() {
    let {index, name, keyName, ...props} = this.props;
    let variantOptions = [];

    if(!this.state.variant.options) {
      this.state.variant.options = [];
    }

    this.state.variant.options.map((o, i) => {
      let optionPrefix = 'o-' + i;
      let optionInputPrefix = 'options.' + i + '.'
      variantOptions.push((
        <form className="option mtb-3" key={'option-' + i + '-' + keyName} onSubmit={this.handleOptionFormSubmit}>
          <div className="form-group row">
            <div className="col-md-4">
              <label className="sr-only">Option Name</label>
              <input className="form-control mb-2" name={optionInputPrefix + 'name'} value={o.name} onChange={this.handleOptionChange} placeholder="Option Name (eg: Blue)" />
            </div>
            <div className="col-md-3">
              <label className="sr-only">Price</label>
              <div className="input-group mb-2">
                <span className="input-group-addon">$</span>
                <CurrencyInput className="form-control" value={o.price} name={optionInputPrefix + 'price'} onChange={this.handleOptionChange} placeholder="Price" />
              </div>
            </div>
            <div className="col-md-2">
              <label className="sr-only">Quantity</label>
              <input type="number" className="form-control mb-2" name={optionInputPrefix + 'qty'} value={o.qty} onChange={this.handleOptionChange} placeholder="Quantity" />
            </div>
            <div className="col-md-1">
              <label className="custom-control custom-checkbox">
                <input name="checkbox-stacked" type="checkbox" className="custom-control-input" checked={o.default} onChange={this.handleOptionChange} name={optionInputPrefix + 'default'} />
                <span className="custom-control-indicator"></span>
              </label>
            </div>
            <div className="col-md-1">
              <button type="button" className="btn btn-link" onClick={this.handleConfigOption.bind(this, i)}><i className="mdi mdi-settings" /></button>
            </div>
            <div className="col-md-1">
              <button className="btn btn-link" onClick={this.handleRemoveOption} data-index={i}><i className="mdi mdi-delete" /></button>
            </div>
          </div>
          <div
            className={`modal fade option-config-${i} ${this.state.modalOpen[i] ? 'show' : ''}`}
            onClick={this.handleModalClick.bind(this, i)}
            style={{display: this.state.modalOpen[i] ? 'block' : 'none'}}
          >
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Advanced Options</h4>
                  <button type="button" className="close" onClick={this.handleCloseConfigOption.bind(this, i)} aria-label="Close">
                    <span aria-hidden="true"><i className="mdi mdi-close" /></span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>SKU</label>
                    <input className="form-control mb-2" name={optionInputPrefix + 'sku'} value={o.sku} onChange={this.handleOptionChange} placeholder="SKU" />
                  </div>
                  <div className="form-group">
                    <label>Weight</label>
                    <input type="number" className="form-control mb-2" name={optionInputPrefix + 'weight'} value={o.weight} onChange={this.handleOptionChange} placeholder="Weight" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.state.modalOpen[i] ?
            <div className={`modal-backdrop fade ${this.state.modalOpen[i] ? 'show' : ''}`}></div> : null
          }
        </form>
      ));
    });

    return (
      <div className="variant">
        <div className="mt-3">
          <div className="form-group row">
            <div className="col-md-6">
              <label className="sr-only">Variant Name</label>
              <input className="form-control mr-2 mb-2" name={'name'} value={this.state.variant.name} onChange={this.handleChange} placeholder="Variant Name (eg: Color)" />
            </div>
            <div className="col-md-4">
              <label className="sr-only">Option Type</label>
              <select className="form-control mr-2 mb-2" value={this.state.variant.type} name={'type'} onChange={this.handleChange}>
                <option value disabled>Option Type</option>
                <option value="select">Selection Option</option>
                <option value="multi">Checkbox Options</option>
                <option value="colors">Color Options</option>
                <option value="images">Image Options</option>
              </select>
            </div>
            <div className="form-inline col-md-2 text-right">
              <div className="form-check form-check-inline mb-2">
                <label className="form-check-label">
                  <input className="form-check-input" type="checkbox" checked={this.state.variant.required} name={'required'} onChange={this.handleChange} /> Required
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group row option-adder">
          <div className="col">
            <form onSubmit={this.handleAddOption}>
              <div className="input-group mb-2">
                <input type="text" className="form-control" name="optionName" value={this.state.optionName} onChange={this.handleOptionNameChange} placeholder="Enter an option name" />
                <span className="input-group-btn">
                  <button className="btn btn-primary" type="button" onClick={this.handleAddOption}>Add</button>
                </span>
              </div>
            </form>
          </div>
        </div>
        <div className="form-group row row-header">
          <div className="col-md-4"><b>Name</b></div>
          <div className="col-md-3"><b>Price</b></div>
          <div className="col-md-3"><b>Qty</b></div>
          <div className="col-md-3"><b>Default</b></div>
          <div className="col-md-2"></div>
        </div>
        {variantOptions}
      </div>
    )
  }
}

export class Variants extends React.Component {
  constructor(props) {
    super(props);

    this.state = props.state || {list: []};

    this.addVariant = this.addVariant.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.state && newProps.state.list && newProps.state.list.length && this.state.list.length === 0) {
      this.setState(newProps.state);
    }
  }

  handleChange(data) {
    let newList = immutable.set(this.state, 'list.' + data.index, data.variant);
    this.setState(newList);

    let inputPrefix = this.props.name + '.list.' + data.index;
    let newEvt = {
      target: {
        name: inputPrefix,
        value: data.variant
      }
    };
    this.props.onChange(newEvt);
  }

  addVariant() {
    let variant = {
      name: '',
      attribute: null,
      type: 'select',
      options: [],
      required: false,
      default: null
    };
    this.setState({list: [...this.state.list, variant]});
  }

  render() {
    let {context, ...props} = this.props;

    let vs = [];
    for(let k = 0, l = this.state.list.length; k < l; k++) {
      let v = this.state.list[k];
      vs.push(<Variant state={v} key={'variant-' + k} name={props.name} index={k} onChange={this.handleChange} keyName={'variant-' + k} />);
    }
    return (
      <div className="product-variants">
        <div className="row">
          <div className="col">
            <h4>Variants</h4>
          </div>
          <div className="col text-right">
            <button onClick={this.addVariant} className="btn btn-primary">Add Variant</button>
          </div>
        </div>
        {vs}
      </div>
    )
  }
}
