import React from 'react';

export class Permissions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {}
    }

    for(let i in props.options) {
      if(props.options[i].singular) {
        this.state.options[i] = props.state[i] ? props.state[i] : props.options[i].default || false;
      } else {
        this.state.options[i] = {
          r: props.state[i] && props.state[i].r ? props.state[i].r : props.options[i].r.default || false,
          w: props.state[i] && props.state[i].w ? props.state[i].w : props.options[i].w.default || false
        }
      }
    }
  }

  componentWillReceiveProps(newProps) {
    if(newProps.state) {
      // need to pull in product data here.
      let newOptions = {};
      for(let i in newProps.options) {
        if(newProps.options[i].singular) {
          newOptions[i] = newProps.state[i] ? newProps.state[i] : newProps.options[i].default || false;
        } else {
          newOptions[i] = {
            r: newProps.state[i] && newProps.state[i].r ? newProps.state[i].r : newProps.options[i].r.default || false,
            w: newProps.state[i] && newProps.state[i].w ? newProps.state[i].w : newProps.options[i].w.default || false
          }
        }
      }
      this.setState({options: newOptions});
    }
  }

  render() {
    let {options, ...props} = this.props;
    let permissionsDom = []
    for(let p in this.state.options) {
      let permission = this.state.options[p];
      if(options[p].singular) {
        permissionsDom.push((
          <tr key={'permission-' + p}>
            <td>{p}</td>
            <td>
              <div className="form-group">
                <label className="custom-control custom-checkbox">
                  <input className="custom-control-input" type="checkbox" checked={this.state.options[p]} name={'permissions.' + p} onChange={props.onChange} />
                  <span className="custom-control-indicator"></span>
                </label>
              </div>
            </td>
            <td></td>
            <td></td>
          </tr>
        ));
      } else {
        permissionsDom.push((
          <tr key={'permission-' + p}>
            <td>{p}</td>
            <td></td>
            <td>
              <div className="form-group">
                <label className="custom-control custom-checkbox">
                  <input className="custom-control-input" type="checkbox" checked={this.state.options[p].r} name={'permissions.' + p + '.r'} onChange={props.onChange} />
                  <span className="custom-control-indicator"></span>
                </label>
              </div>
            </td>
            <td>
              <div className="form-group">
                <label className="custom-control custom-checkbox">
                  <input className="custom-control-input" type="checkbox" checked={this.state.options[p].w} name={'permissions.' + p + '.w'} onChange={props.onChange} />
                  <span className="custom-control-indicator"></span>
                </label>
              </div>
            </td>
          </tr>
        ))
      }
    };

    return (
      <table className="table permissions-table">
        <thead>
          <tr>
            <th>Permission</th>
            <th>Owner</th>
            <th>Read</th>
            <th>Write</th>
          </tr>
        </thead>
        <tbody>
          {permissionsDom}
        </tbody>
      </table>
    )
  }
}
