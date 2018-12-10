import React from 'react';

const Breadcrumb = props => {
  return (
    <div className='path'>
      <ul className='path-list'>
        {(props.path || []).map(({ id, title }, key) => (
          <li className='path-item' key={key}>
            <button className='path-link' onClick={() => props.goTo(id)}>
              {!title ? id : title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumb;
