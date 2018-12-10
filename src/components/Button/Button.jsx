import React from 'react';

const Button = props => {
  return (
    <button
      className={`btn btn-primary ${props.disabled ? 'btn--disabled' : ''}`}
      disabled={props.disabled}
      onClick={props.click}
    >
      <span className='btn-label'>{props.label}</span>
    </button>
  );
};

export default Button;
