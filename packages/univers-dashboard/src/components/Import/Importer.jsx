import React from 'react'
import Dropzone from 'react-dropzone'
import immutable from 'object-path-immutable'
import { PapaParse } from 'papaparse'
import { recurseFormData } from 'react-univers-crud'

export class Importer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      fields: {},
      matches: {}
    }
  }

  handleDrop(files) {
    let file = files[0];
    let fileType = file.name.split('.').pop();
    if(['json', 'csv'].indexOf(fileType) === -1) {
      return alert('Please upload a .csv or .json file to parse');
    }
    let filereader = new FileReader;
    filereader.onloadend = (e) => {
      let data = e.target.result;
      let jsonData;
      switch(fileType) {
        case 'json':
          try {
            jsonData = JSON.parse(data);
          } catch(e) {
            console.log(e)
          }
        break;
        case 'csv':
          jsonData = PapaParse(data);
        break;
      }

      this.setState({
        data: jsonData
      })
    }
    filereader.readAsText(file);
  }

  handleFieldChange(evt) {
    this.setState(immutable.set(this.state, evt.target.name, evt.target.checked));
  }

  handleMatchChange(evt) {
    this.setState(immutable.set(this.state, evt.target.name, evt.target.value));
  }

  render() {
    let uploadContent = (
      <div className="form-group import-uploader">
        <Dropzone className="import-dropzone" activeClassName="import-dropzone-active" onDrop={this.handleDrop.bind(this)} multiple={false}>
          <h3>Drop files to import here</h3>
          <h4>Or click to upload</h4>
        </Dropzone>
      </div>
    )

    let fields = [];
    let choices = [];
    let formState = {};
    if(this.props.form) {
      formState = recurseFormData(formState, this.props.form)
      for(let i in formState.form) {
        if(typeof(formState.form[i]) === 'object') {
          // need to use dot notation to parse this
          continue;
        }
        choices.push((
          <option key={'merge-' + i} value={i}>{i}</option>
        ));
      }
    }
    if(this.state.data && this.state.data.length) {
      for(let key in this.state.data[0]) {
        if(key[0] === '_') continue;
        if(typeof(this.state.data[0][key]) === 'object') {
          // need to use dot notation to parse this
          continue;
        }
        fields.push((
          <div className="d-flex justify-content-between align-items-center">
            <div className="import-data-field">
              <div className={'form-group ' + key} key={key}>
                <label className="custom-control custom-checkbox">
                  <input className="custom-control-input" type="checkbox" checked={this.state.fields[key]} name={'fields.' + key} onChange={this.handleFieldChange.bind(this)} />
                  <span className="custom-control-indicator"></span>
                  <span className="custom-control-description">{key}</span>
                </label>
              </div>
            </div>
            <div className="merge-data-field">
              <div className={'form-group ' + key} key={'match-' + key}>
                <select className="form-control custom-select" value={this.state.matches[key]} onChange={this.handleMatchChange.bind(this)} name={'matches.' + key}>
                  <option value="">Select a field</option>
                  {choices}
                </select>
              </div>
            </div>
          </div>
        ));
      }
    }

    let mergeContent = (
      <div className="merge-content">
        <div className="d-flex justify-content-between">
          <div className="data-fields">
            <h6>Select your data fields to merge</h6>
          </div>
          <div className="merge-fields">
            <h6>Map to field</h6>
          </div>
        </div>
        {fields}
      </div>
    )

    return (
      <div className="option-modal-wrapper">
        <div className="option-modal importer">
          <div className="option-modal-content">
            {this.state.data ? mergeContent : uploadContent}
          </div>
          <div className="option-modal-footer">
            <button className="btn btn-primary" onClick={this.props.handleClose}>Close</button>
          </div>
        </div>
      </div>
    )
  }
}
