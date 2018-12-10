import React from 'react';
import { getFolder, getFoldersInFolder } from '../../utils/content';
import * as lgetOr from 'lodash/fp/getOr';
import * as lisEmpty from 'lodash/fp/isEmpty';
import * as lsortBy from 'lodash/fp/sortBy';

const Table = props => {
  const getContent = lgetOr([])('content');
  const content = getContent(props);

  const { items = [] } = getFolder(props.folder, content);
  const folders = getFoldersInFolder(props.folder, content);

  const sortByTitle = lsortBy('title');
  const contentInFolder = [...sortByTitle(folders), ...sortByTitle(items)];

  const isFolder = x => x.type === 'folder';

  return (
    <div className='list-table-container'>
      <table className='list-table'>
        <thead>
          <tr>
            <th />
            <th>File</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {contentInFolder.map((x, i) => {
            return x.title ? (
              <tr
                key={i}
                onClick={e => {
                  if (isFolder(x)) return;
                  props.toggle(x.id);
                }}
                onDoubleClick={e => {
                  if (!isFolder(x)) return;
                  props.open(x.id);
                }}
                className={`list-table-button ${
                  props.selected === x.id ? 'list-table--selected' : ''
                } ${
                  props.selected === x.id && props.loading
                    ? 'list-table--loading'
                    : ''
                }`}
              >
                <td>
                  {!isFolder(x) ? (
                    <div className='list-table-icon file-icon'>
                      <svg
                        className='file-icon-svg'
                        version='1.1'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 512 512'
                      >
                        <path d='M447.938,129.704c-0.089-2.997-1.283-5.921-3.49-8.128L326.383,3.511c-0.005-0.005-0.01-0.007-0.014-0.012 C324.2,1.337,321.209,0,317.907,0H89.278C75.361,0,64.04,11.32,64.04,25.237v461.525c0,13.916,11.32,25.237,25.237,25.237h333.444 c13.916,0,25.237-11.32,25.237-25.237v-356.71C447.96,129.934,447.946,129.82,447.938,129.704z M329.895,40.931l77.135,77.135 h-72.076c-2.79,0-5.059-2.269-5.059-5.059V40.931z M423.984,486.764c-0.001,0.694-0.567,1.26-1.262,1.26H89.278 c-0.695,0-1.261-0.566-1.261-1.261V25.237c0-0.695,0.566-1.261,1.261-1.261h216.641v89.031c0,16.009,13.025,29.035,29.035,29.035 h89.031V486.764z' />
                      </svg>
                    </div>
                  ) : (
                    <div className='list-table-icon folder-icon' />
                  )}
                </td>
                <td>
                  {x.name || x.title || ''}
                  {props.job.includes(x.id) ? (
                    <span
                      className={`list-table-status ${
                        props.exporting
                          ? 'list-table-status--progress'
                          : 'list-table-status--complete'
                      }`}
                    >
                      <p className='list-table-status-description'>
                        {props.exporting
                          ? 'File is being exported'
                          : 'Preparing file for download'}
                      </p>
                    </span>
                  ) : null}
                </td>
                <td>{new Date(x.created).toLocaleDateString('en-GB')}</td>
              </tr>
            ) : null;
          })}
        </tbody>
      </table>
      {lisEmpty(contentInFolder) && !props.fetching ? (
        <div className='list-table-empty' />
      ) : null}
      {props.fetching ? <div className='list-table-loader' /> : null}
    </div>
  );
};

export default Table;
