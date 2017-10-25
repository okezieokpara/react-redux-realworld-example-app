import React from 'react';
import PropTypes from 'prop-types';

class ListErrors extends React.Component {
  render() {
    const errors = this.props.errors;
    if (errors) {
      return (
        <ul className="error-messages">
          {
            Object.keys(errors).map(key => {
              return (
                <li key={key}>
                  {key} {errors[key]}
                </li>
              );
            })
          }
        </ul>
      );
    }
    return null;
  }
}
ListErrors.propTypes = {
  errors: PropTypes.any
};
export default ListErrors;
