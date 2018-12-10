import {
  GET_CONTENT,
  GET_CONTENT_SUCCESS,
  GET_CONTENT_FAILED,
  ENABLE_EXTRACT,
  SELECT_FOLDER,
  SELECT_FILE,
  GET_FEATURE,
  GET_FEATURE_SUCCESS,
  GET_FEATURE_FAILED,
  ENABLE_EXTRACT_SUCCESS,
  ENABLE_EXTRACT_FAILED
} from '../constants/actions';
import { getFolder, getFile, getFileIndex } from '../../utils/content';
import * as lgetOr from 'lodash/fp/getOr';
import * as lunionBy from 'lodash/fp/unionBy';

const contentReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CONTENT:
      return {
        ...state,
        status: 'getting-content'
      };

    case GET_CONTENT_SUCCESS:
      const getContentSuccessState = (
        { folders = [], items = [], currentFolder = {} },
        stateContent
      ) => {
        const getFolderId = lgetOr('root')('id');
        const currentFolderId = getFolderId(currentFolder);

        const currentContent = [
          ...folders,
          ...items.filter(x => x.type === 'Feature Service')
        ].reduce((accumulatedContent = [{ folder: {}, items: [] }], el) => {
          const getType = lgetOr('folder')('type');
          const type = getType(el);

          const mergeFolders = lunionBy('folder.id')(accumulatedContent);
          const allFolders = mergeFolders(stateContent);

          const existingFolder =
            type === 'folder'
              ? allFolders.find(x => x.folder.id === el.id)
              : allFolders.find(x => x.folder.id === currentFolderId);

          if (type === 'folder') {
            if (!existingFolder) {
              return [
                ...allFolders,
                { folder: { ...el, type, parent: currentFolderId }, items: [] }
              ];
            }

            return [
              ...allFolders.filter(x => x.folder.id !== el.id),
              {
                folder: {
                  ...el
                },
                items: [...existingFolder.items]
              }
            ];
          }

          if (!existingFolder) {
            const parent = currentFolderId === 'root' ? null : '';
            return [
              ...allFolders,
              {
                folder: {
                  id: currentFolderId,
                  title: '',
                  username: el.owner,
                  created: null,
                  parent,
                  type: 'folder'
                },
                items: [el]
              }
            ];
          }

          return [
            ...allFolders.filter(x => x.folder.id !== currentFolderId),
            {
              ...existingFolder,
              ...{
                items: [...existingFolder.items.filter(x => x.id !== el.id), el]
              }
            }
          ];
        }, []);

        const currentFoldersId = currentContent.map(x => x.folder.id);

        const content = [
          ...stateContent.filter(
            x => !currentFoldersId.some(id => id === x.folder.id)
          ),
          ...currentContent
        ];

        return {
          status: 'idle',
          content
        };
      };

      const getStateContent = lgetOr([])('content');
      const getAPIContent = lgetOr({
        folders: [],
        items: [],
        currentFolder: {}
      })('content');

      return {
        ...state,
        ...getContentSuccessState(
          getAPIContent(action.payload),
          getStateContent(state)
        )
      };

    case GET_CONTENT_FAILED:
      return {
        ...state,
        ...{
          status: 'idle'
        }
      };

    case SELECT_FOLDER:
      return {
        ...state,
        ...{
          currentFolderId: action.payload,
          selectedFileId: null
        }
      };

    case SELECT_FILE:
      const { selectedFileId } = action.payload;
      return {
        ...state,
        ...{ selectedFileId }
      };

    case GET_FEATURE:
      return {
        ...state,
        ...{
          status: 'getting-feature'
        }
      };

    case GET_FEATURE_SUCCESS:
      const { feature } = action.payload;
      const { serviceItemId } = feature;

      const updateGetFeatureSuccessState = (fid, content, folderId) => {
        const folder = getFolder(folderId, content);
        const file = getFile(fid, folder);
        const fileIndexInFolder = getFileIndex(file.id, folder);

        folder.items[fileIndexInFolder] = {
          ...file,
          ...{ feature }
        };

        return {
          status: 'idle',
          content: [...content.filter(x => x.folder.id !== folderId), folder]
        };
      };

      return {
        ...state,
        ...updateGetFeatureSuccessState(
          serviceItemId,
          state.content,
          state.currentFolderId
        )
      };

    case GET_FEATURE_FAILED:
      return {
        ...state,
        ...{
          status: 'idle'
        }
      };

    case ENABLE_EXTRACT:
      return {
        ...state,
        ...{
          status: 'enabling-extract'
        }
      };

    case ENABLE_EXTRACT_SUCCESS:
      const {
        id: enableExtractFileId,
        capabilities: updatedCapabilities
      } = action.payload;

      const updateEnableExtractState = (
        fid,
        capabilities,
        content,
        folderId
      ) => {
        const folder = getFolder(folderId, content);
        const file = getFile(fid, folder);
        const fileIndexInFolder = getFileIndex(file.id, folder);

        folder.items[fileIndexInFolder] = {
          ...file,
          feature: { ...file.feature, capabilities }
        };

        return {
          status: 'idle',
          selectedFile: file,
          content: [
            ...content.filter(x => x.folder.id !== folder.folder.id),
            folder
          ]
        };
      };

      return {
        ...state,
        ...updateEnableExtractState(
          enableExtractFileId,
          updatedCapabilities,
          state.content,
          state.currentFolderId
        )
      };

    case ENABLE_EXTRACT_FAILED:
      return {
        ...state,
        ...{
          status: 'idle'
        }
      };

    default:
      return state;
  }
};

export default contentReducer;
