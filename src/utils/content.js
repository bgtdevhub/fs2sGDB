const getFolder = (folderId, content = []) =>
  content.find(x => (x.folder || {}).id === folderId) || {};

const getFile = (fileId, { items = [] }) =>
  items.find(x => x.id === fileId) || {};

const getFileIndex = (fileId, { items = [] }) =>
  items.map(x => x.id).findIndex(x => x === fileId) || null;

const getFoldersInFolder = (folderId = null, content = []) =>
  content.filter(x => x.folder.parent === folderId).map(x => x.folder);

export { getFolder, getFile, getFileIndex, getFoldersInFolder };
