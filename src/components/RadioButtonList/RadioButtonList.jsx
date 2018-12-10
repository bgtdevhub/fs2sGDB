import React from 'react';

const RadioButtonList = props => {
  return (
    <div className='radio-button-list-container'>
      <ul className='radio-button-list'>
        {(props.items || []).map(({ id, value }, key) => (
          <li className='radio-button-item' key={key}>
            <input
              type='radio'
              name={props.group}
              id={`radio-button-${id}`}
              className='radio-button-input'
              value={id}
              checked={props.selected === id}
              onChange={() => props.change(id)}
            />
            <label
              htmlFor={`radio-button-${id}`}
              className='radio-button-label'
            >
              {value}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RadioButtonList;
