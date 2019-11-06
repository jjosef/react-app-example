import React from 'react'
import Portal from 'react-portal'
import immutable from 'object-path-immutable'
import { FormInputs } from 'react-univers-crud'
import firebase from 'firebase';

export class FeatureForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      image: [],
      link: ''
    }

    this._inputs = {
      image: {label: 'Image', type: 'images', options: {multiple: false}},
      title: {label: 'Title', type: 'input'},
      description: {label: 'Description', type: 'input'},
      link: {label: 'Link', type: 'input'}
    }
  }

  resetState() {
    this.setState({
      title: '',
      description: '',
      image: [],
      link: ''
    });
  }

  onChange($evt) {
    this.setState(immutable.set(this.state, evt.target.name, evt.target.value));
  }

  handleSave() {
    let {...newState} = this.state;
    if(this.props.index) {
      this.props.editFeature(this.props.index, newState);
    } else {
      this.props.addFeature(newState);
    }
    this.resetState();
    this.props.closePortal();
  }

  handleCancel() {
    this.resetState();
    this.props.closePortal()
  }

  render() {
    let paramsDom = [];

    for(let key in this._inputs) {
      paramsDom.push(FormInputs(this, this._inputs[key], this.state[key], key));
    }

    return (
      <div className="option-modal-wrapper small">
        <div className="option-modal feature-options">
          <div className="option-modal-content">
            {paramsDom}
          </div>
          <div className="option-modal-footer">
            <button className="btn btn-secondary mr-2" onClick={this.handleCancel.bind(this)}>Cancel</button>
            <button className="btn btn-primary" onClick={this.handleSave.bind(this)}>Save</button>
          </div>
        </div>
      </div>
    )
  }

}

export class FeaturesSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      features: []
    }
  }

  componentWillReceiveProps(newProps) {
    if(newProps.state && Object.keys(newProps.state).length && Object.keys(this.state.features).length === 0) {
      // need to pull in product data here.
      this.setState({features: newProps.state});
    }
  }

  addFeature() {
    let state = this.state;
    let newFeature = {
      title: '',
      description: '',
      image: [],
      link: ''
    };
    let newState = {features: [...state.features, ...[newFeature]]};
    this.setState(newState);
    this.props.onChance({
      target: {
        name: this.props.name,
        value: newState.features
      }
    });
  }

  editFeature(index, data) {

  }

  removeFeature(index, $evt) {
    $evt.stopPropagation();

    let state = this.state;
    let newState = {features: [...state.features.slice(0, index), ...state.features.slice(index)]};
    this.setState(newState);
    this.props.onChance({
      target: {
        name: this.props.name,
        value: newState.features
      }
    });
  }

  render() {
    let {options, keyName, stateValue, context, value, ...props} = this.props;
    let addOptionButton = <button className="btn btn-primary btn-sm">+ New</button>;
    let addOptionModal = (
      <Portal closeOnEsc closeOnOutsideClick openByClickOn={addOptionButton}>
        <FeatureForm value={value} onChange={this.props.onChange} options={options} context={context} keyName={keyName} stateValue={stateValue} addFeature={this.addFeature.bind(this)} />
      </Portal>
    )

    let features = [];
    this.state.features.map((feature, i) => {
      features.push((
        <div className="feature d-flex justify-content-between">
          <div className="mover"><i className="mdi-menu" /></div>
          <div className="w-75 feature-title flex-column" onClick={this.handleOpenEditor.bind(this, i)}>
            <b>{eatures.title}</b>
          </div>
          <Portal closeOnEsc closeOnOutsideClick isOpened={this.state.editorOpen[i]}>
            <FeatureForm value={value} onChange={this.props.onChange} options={options} context={context} keyName={keyName} stateValue={stateValue} addFeature={this.addFeature.bind(this)} editFeature={this.editFeature.bind(this, i)} index={i} data={feature} />
          </Portal>
        </div>
      ))
    });

    return (
      <div className="features-section">
        <div className="panel-header">
          {options.sectionName} {addOptionModal}
        </div>
      </div>
    )
  }
}
