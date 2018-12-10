import React from 'react';

const Toggle = props => {
  return (
    <div className={'toggle' + (props.loading ? ' toggle--loading' : '')}>
      <label htmlFor={props.id} className='toggle-label'>
        <input
          type='checkbox'
          name=''
          id={props.id}
          className='toggle-input'
          onChange={props.change}
          checked={props.checked}
        />
        <div className='toggle-control'>
          <div className='toggle-indicator' />
        </div>
      </label>
    </div>
  );
};

export default Toggle;
