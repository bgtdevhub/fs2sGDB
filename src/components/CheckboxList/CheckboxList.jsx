import React from 'react';

const CheckboxList = props => {
  return (
    <div className='checkbox-list-container'>
      <ul className='checkbox-list'>
        {(props.items || []).map(({ id, value }, key) => (
          <li className='checkbox-item' key={key}>
            <input
              type='checkbox'
              name={`checkbox-${id}`}
              id={`checkbox-${id}`}
              className='checkbox-input'
              value={id}
              checked={(props.selected || []).includes(id)}
              onChange={() => props.change(id)}
            />
            <label htmlFor={`checkbox-${id}`} className='checkbox-label'>
              {value}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckboxList;
