import {
  INIT_APP,
  SET_APP_SETTINGS,
  LOGOUT,
  GET_FEATURE_SUCCESS,
  SELECT_FILE,
  EXPORT_ITEM,
  EXPORT_ITEM_SUCCESS,
  DOWNLOAD_ITEM
} from '../constants/actions';
import * as lgetOr from 'lodash/fp/getOr';
import * as lunionBy from 'lodash/fp/unionBy';

const appReducer = (state = {}, action) => {
  switch (action.type) {
    case INIT_APP:
      const { format = '', output = '' } = action.payload;
      return {
        ...state,
        ...{
          status: 'idle',
          settings: {
            format,
            output
          }
        }
      };

    case SET_APP_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };

    case LOGOUT:
      return {
        ...state,
        ...{
          status: 'logout'
        }
      };

    case GET_FEATURE_SUCCESS:
    case SELECT_FILE:
      const getFeatureLayers = (feature, settings) => {
        const getLayers = lgetOr([])('layers');
        const layers = getLayers(feature).map(x => x.id);

        return {
          settings: {
            ...settings,
            layers
          }
        };
      };

      return {
        ...state,
        ...getFeatureLayers(action.payload.feature, state.settings)
      };

    case EXPORT_ITEM:
      const exportItemState = ({ options = {} }, stateJob = []) => {
        const item = {
          serviceItemId: options.itemId
        };

        return {
          status: 'scheduling-export',
          job: [...stateJob, item]
        };
      };

      return {
        ...state,
        ...exportItemState(action.payload, state.job)
      };

    case EXPORT_ITEM_SUCCESS:
      const exportItemSuccessState = (item, stateJob = []) => {
        const mergeJobByServiceItemId = lunionBy('serviceItemId');
        const job = mergeJobByServiceItemId([item], stateJob);

        return {
          status: 'idle',
          job
        };
      };

      return {
        ...state,
        ...exportItemSuccessState(action.payload, state.job)
      };

    case DOWNLOAD_ITEM:
      const downloadItemState = ({ itemId }, stateJob = []) => {
        const job = stateJob.filter(x => x.exportItemId !== itemId);
        return {
          job
        };
      };

      return {
        ...state,
        ...downloadItemState(action.payload, state.job)
      };

    default:
      return state;
  }
};

export default appReducer;
