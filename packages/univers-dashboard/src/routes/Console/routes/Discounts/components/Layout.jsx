import React from 'react';
import { Form } from './Form';
import { CrudLayout } from 'react-univers-crud';

export class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {context, ...props} = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-12 col-md-8">
            <div className="panel">
              <CrudLayout context={context} inputs={Form.nameAndTitle} keyName="nameAndTitle" />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="panel">
              <CrudLayout context={context} inputs={Form.options} keyName="options" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
