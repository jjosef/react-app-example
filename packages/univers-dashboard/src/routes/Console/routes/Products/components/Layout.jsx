import React from 'react';
import { Form } from './Form';
import { CrudLayout } from 'react-univers-crud';

export class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {context, ...props} = this.props;

    let GiftCardLayout = (
      <div>
        <div className="row">
          <div className="col-12 col-md-8">
            <div className="panel">
              <CrudLayout context={context} inputs={Form.productContent} keyName="productContent" />
            </div>
            <div className="panel">
              <CrudLayout context={context} inputs={Form.pricing} keyName="pricing" />
            </div>
            <div className="panel">
              <CrudLayout context={context} inputs={Form.related} keyName="relateds" />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="panel">
              <CrudLayout context={context} inputs={Form.productType} keyName="type" />
            </div>
            <div className="panel">
              <CrudLayout context={context} inputs={Form.imaging} keyName="imaging" />
            </div>
            <div className="panel">
              <CrudLayout context={context} inputs={Form.quantities} keyName="quantities" />
            </div>
          </div>
        </div>
      </div>
    )

    let NormalLayout = (
      <div>
        <div className="row">
          <div className="col-12 col-md-8">
            <div className="panel">
              <CrudLayout context={context} inputs={Form.productContent} keyName="productContent" />
            </div>
            <div className="panel">
              <CrudLayout context={context} inputs={Form.pricing} keyName="pricing" />
            </div>
            <div className="panel">
              <CrudLayout context={context} inputs={Form.variantWrap} keyName="variants" />
            </div>
            <div className="panel">
              <CrudLayout context={context} inputs={Form.related} keyName="relateds" />
            </div>
            <div className="panel">
              <CrudLayout context={context} inputs={Form.additional} keyName="additional" />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="panel">
              <CrudLayout context={context} inputs={Form.productType} keyName="type" />
              <CrudLayout context={context} inputs={Form.skus} keyName="skus" />
            </div>
            <div className="panel">
              <CrudLayout context={context} inputs={Form.imaging} keyName="imaging" />
              <CrudLayout context={context} inputs={Form.options} keyName="options" />
            </div>
            <div className="panel">
              <CrudLayout context={context} inputs={Form.quantities} keyName="quantities" />
              <CrudLayout context={context} inputs={Form.shipping} keyName="shipping" />
            </div>
          </div>
        </div>
        <div className="row top-margin">
          <div className="col-12 col-md-6">
            <div className="panel">
              <CrudLayout context={context} inputs={Form.featuresSection} keyName="featuresSection" />
            </div>
            <div className="panel">
              <CrudLayout context={context} inputs={Form.intheboxSection} keyName="intheboxSection" />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="panel">
              <CrudLayout context={context} inputs={Form.specificationsSection} keyName="specificationsSection" />
            </div>
          </div>
        </div>
      </div>
    )

    return this.props.context.state.form.type === 'gift-card' ? GiftCardLayout : NormalLayout;
  }
}
