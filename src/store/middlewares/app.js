import { getSessionUsername } from '../../utils/auth';
import {
  exportItem,
  checkItemStatus,
  downloadItem
} from '../../services/arcgis';
import {
  INIT_APP,
  GET_CONTENT,
  EXPORT_ITEM,
  EXPORT_ITEM_SUCCESS,
  DOWNLOAD_ITEM
} from '../constants/actions';

const app = store => next => action => {
  next(action);

  switch (action.type) {
    case INIT_APP:
      const username = getSessionUsername();

      store.dispatch({ type: GET_CONTENT, payload: { username } });
      return;

    case EXPORT_ITEM:
      exportItem(action.payload)
        .then(payload => {
          store.dispatch({ type: EXPORT_ITEM_SUCCESS, payload });
        })
        .catch(error => {
          throw new Error(error);
        });
      return;

    case EXPORT_ITEM_SUCCESS:
      const { exportItemId, jobId } = action.payload;
      const sessionUser = getSessionUsername();

      checkItemStatus(sessionUser, exportItemId, jobId)
        .then(payload => {
          store.dispatch({ type: DOWNLOAD_ITEM, payload });
        })
        .catch(error => {
          throw new Error(error);
        });
      return;

    case DOWNLOAD_ITEM:
      const { itemId } = action.payload;

      downloadItem(itemId);
      return;

    default:
      return;
  }
};

export default app;
