import React from 'react';
import { routeStates as R } from '~/constants/';
import Crud from 'react-univers-crud';
import firebase from 'firebase';
import { Layout } from './Layout';
import { Variants } from './Variants';
import { RelatedProducts } from './RelatedProducts';
import { FeaturesSection } from './FeaturesSection';
import { Importer } from '~/components/Import';
import { Exporter } from '~/components/Export';

export const Form = {
  productType: {type: 'group', children: {
    type: {label: 'Type', type: 'select', default: 'physical', choices: [
      {value: 'physical', name: 'Physical'},
      {value: 'service', name: 'Service'},
      {value: 'gift-card', name: 'Gift Card'}
    ]},
    active: {label: 'Active', type: 'checkbox', default: true}
  }},
  productContent: {type: 'group', children: {
    name: {label: 'Name', type: 'input', required: true},
    description: {label: 'Product Content', type: 'wysiwyg', full: true}
  }},
  skus: {type: 'group', children: {
    sku: {label: 'SKU', type: 'input'},
    manufacturer_sku: {label: 'Manufacturer SKU', type: 'input'},
  }},
  pricing: {label: 'Pricing', type: 'group', children: {
    price: {label: 'Price', type: 'currency', required: true},
    compare_price: {label: 'Compare at Price', type: 'currency'},
    retail_price: {label: 'Retail Price', type: 'currency'},
    wholesale_price: {label: 'Wholesale Price', type: 'currency'}
  }},
  options: {type: 'group', children: {
    taxable: {label: 'Taxable', type: 'checkbox'},
    requires_shipping: {label: 'Requires Shipping', type: 'checkbox'},
    free_shipping: {label: 'Free Shipping', type: 'checkbox'},
    categories: {label: 'Categories', type: 'tags', suggestions: [], database: 'product_categories', dbKey: 'name', default: [] }
  }},
  quantities: {type: 'group', children: {
    qty: {label: 'Quantity', type: 'input', inputType: 'number', default: 0},
    track_qty: {label: 'Track Quantity', type: 'checkbox'},
    sell_when_out_of_stock: {label: 'Sell when out of stock', type: 'checkbox'}
  }},
  shipping: {type: 'group', children: {
    weight: {label: 'Weight', type: 'input', inputType: 'number'},
    dimensions: {
      length: {label: 'Box Length', type: 'input', inputType: 'number'},
      width: {label: 'Box Width', type: 'input', inputType: 'number'},
      depth: {label: 'Box Depth', type: 'input', inputType: 'number'}
    },
    shipping_time: {label: 'Shipping Time', type: 'input'},
    minimum_order: {label: 'Minimum Order Quantity', type: 'input', inputType: 'number', default: 0},
    maximum_order: {label: 'Maximum Order Quantity', type: 'input', inputType: 'number', default: 0},
    qty_in_box: {label: 'Quantity In box', type: 'input', inputType: 'number'}
  }},
  imaging: {type: 'group', children: {
    images: {label: 'Images', type: 'images'}
  }},
  variantWrap: {type: 'group', children: {
    variants: {type: 'custom', component: Variants, default: {list: []}}
  }},
  additional: {type: 'group', children: {
    manual: {label: 'Product Manual', type: 'file'},
    video: {label: 'Product Videos', type: 'tags', options: {allowNew: true, placeholder: 'Add video URLs'}},
    documents: {label: 'Documents', type: 'file', options: {multiple: true}},
    warranty: {label: 'Warranty Information', type: 'wysiwyg'}
  }},
  related: {type: 'group', children: {
    related_products: {type: 'custom', component: RelatedProducts, default: []}
  }},
  featuresSection: {type: 'group', children: {
    features: {type: 'custom', component: FeaturesSection, default: [], options: {
      sectionName: 'Features'
    }}
  }},
  specificationsSection: {type: 'group', children: {
    specifications: {type: 'custom', component: FeaturesSection, default: [], options: {
      sectionName: 'Specifications'
    }}
  }},
  intheboxSection: {type: 'group', children: {
    in_the_box: {type: 'custom', component: FeaturesSection, default: [], options: {
      sectionName: 'In the box'
    }}
  }}
}

export const Table = {
  images: {label: '', type: 'images', display: 0},
  name: {label: 'Name', type: 'text'},
  price: {label: 'Price', type: 'currency'},
  qty: {label: 'Quantity', type: 'text'},
  active: {label: 'Active', type: 'toggle'}
}

export const CRUD = {
  db: 'products',
  name: 'Items',
  permissions: [],
  actions: {create: R.PRODUCTS_NEW, update: R.PRODUCTS_EDIT, list: R.PRODUCTS, remove: null},
  editParam: 'product_id',
  currentAction: 'list',
  requiresOrganization: true,
  form: Form,
  table: Table,
  formLayout: Layout,
  subMenu: [
    {name: 'Items', route: R.PRODUCTS, indexOnly: true},
    {name: 'Categories', route: R.PRODUCT_CATEGORIES},
    {name: 'Inventory', route: R.PRODUCT_INVENTORY},
    {name: 'Gift Cards', route: R.GIFT_CARDS}
  ],
  helpActions: [
    {name: 'Get Help with Products', to: R.PRODUCTS},
    {name: 'Hire a product specialist', to: R.PRODUCTS}
  ],
  altActions: [
    {name: 'Import/Export', click: function($evt) {
      // open modal or something.
      this.setModal(Importer, {form: Form});
    }}
  ],
  enableSearch: true,
  searchMethod: (value, form, auth) => {
    return new Promise((resolve, reject) => {
      let matchedResults = {};
      firebase.database().ref(`/products/${auth.organization}`).once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          let val = child.val();
          console.log(val.name);
          if(val.name && val.name.match(new RegExp(value, "i"))) {
            matchedResults[child.key] = val;
          }
        })
        return resolve(matchedResults);
      }).catch((err) => {
        return reject(err);
      });
    })
  }
};

export class FormView extends React.Component {
  constructor(props) {
    super(props);

    if(props.values) {
      for(key in props.values) {
        Form[key].value = props.values[key];
      }
    }
  }

  render() {
    return (
      <Crud {...this.props} />
    )
  }
}

FormView.defaultProps = CRUD;
