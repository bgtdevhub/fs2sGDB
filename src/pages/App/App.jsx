import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initApp, updateSettings, exportItem } from '../../store/actions/app';
import { loginSuccess, logout } from '../../store/actions/auth';
import { getFolder, getFile } from '../../utils/content';
import {
  getUserContent,
  selectFolder,
  selectFile,
  enableExtract
} from '../../store/actions/content';
import {
  Toggle,
  Table,
  Button,
  Breadcrumb,
  RadioButtonList,
  CheckboxList
} from '../../components';
import { getSessionUsername, getSessionToken } from '../../utils/auth';
import * as lgetOr from 'lodash/fp/getOr';
import * as lisEmpty from 'lodash/fp/isEmpty';
import * as lpipe from 'lodash/fp/pipe';
import * as lmap from 'lodash/fp/map';
import * as lxor from 'lodash/fp/xor';

class App extends Component {
  get currentFolder() {
    return getFolder(this.props.currentFolderId, this.props.content);
  }

  get selectedFile() {
    return getFile(this.props.selectedFileId, this.currentFolder);
  }

  get selectedFileId() {
    const getId = lgetOr(null)('id');
    return getId(this.selectedFile);
  }

  get selectedFileFeature() {
    const getFeature = lgetOr({})('feature');
    return getFeature(this.selectedFile);
  }

  get selectedFileLayers() {
    const getLayer = lgetOr([])('layers');
    const mapToIdValue = lmap(({ id, name: value }) => ({
      id,
      value
    }));

    return lpipe(getLayer, mapToIdValue)(this.selectedFileFeature);
  }

  get selectedFileCapabilities() {
    const getCapabilities = lgetOr('')('capabilities');
    return getCapabilities(this.selectedFileFeature);
  }

  get selectedFileCanExtract() {
    return !lisEmpty(this.selectedFileCapabilities.match(/Extract/g));
  }

  get selectedFileUrl() {
    const getUrl = lgetOr('')('url');
    return getUrl(this.selectedFile);
  }

  get filesInScheduledJob() {
    const job = this.props.scheduledJob || [];
    return job.map(x => x.serviceItemId);
  }

  get path() {
    const constructPath = (folders = [], current, path = []) => {
      if (!current || lisEmpty(folders)) return path;
      const { id, title, parent } = folders.find(
        x => x.folder.id === current
      ).folder;

      const pathItem = { id, title };
      const currentPath = [pathItem, ...path];

      if (!parent) return currentPath;

      return constructPath(
        folders.filter(x => x.id !== id),
        parent,
        currentPath
      );
    };

    return constructPath(this.props.content, this.props.currentFolderId);
  }

  get settings() {
    return this.props.settings || {};
  }

  get readyForExport() {
    return (
      this.selectedFileCanExtract &&
      !lisEmpty(this.settings.format) &&
      !lisEmpty(this.settings.output) &&
      !lisEmpty(this.settings.layers) &&
      !this.filesInScheduledJob.includes(this.selectedFileId)
    );
  }

  toggleExtract = () => {
    if (!this.selectedFile || this.selectedFileCanExtract) return;

    const payload = {
      id: this.selectedFileId,
      url: this.selectedFileUrl,
      capabilities: this.selectedFileCapabilities + ',Extract'
    };

    this.props.enableExtract(payload);
  };

  componentDidMount() {
    const { hash } = this.props.location;

    if (hash.includes('access_token')) {
      this.props.loginSuccess(hash);
      this.props.history.push('/app');
    }

    const token = getSessionToken();

    if (!token) {
      this.props.logout();
      return;
    }

    const { format = [], output = [] } = this.options;

    const payload = {
      format: format[0].id,
      output: output[0].id
    };

    this.props.initApp(payload);
  }

  componentDidUpdate(prev) {
    if (this.props.appStatus === 'logout') this.props.history.push('/');
  }

  toggleItemSelected = id => {
    if (this.props.contentStatus === 'getting-feature') return;

    const selectedFileId = this.selectedFileId === id ? null : id;
    const folder = getFolder(this.props.currentFolderId, this.props.content);
    const file = getFile(selectedFileId, folder);

    const getFeature = lgetOr({})('feature');
    const feature = getFeature(file);

    const getUrl = lgetOr('')('url');
    const url = getUrl(file);

    this.props.selectFile({ selectedFileId, feature, url });
  };

  openFolder = folder => {
    if (folder === this.props.currentFolderId) return;

    const currentFolder = (this.props.content || []).find(
      x => x.folder.id === folder
    );

    if (!lisEmpty(currentFolder.items)) {
      this.props.selectFolder(folder);
      return;
    }

    const username = getSessionUsername();
    this.props.getUserContent({ username, folder });
  };

  updateFormatSettings = format => {
    this.props.updateSettings({ format });
  };

  updateOutputSettings = output => {
    this.props.updateSettings({ output });
  };

  updateSelectedLayers = id => {
    const getLayers = lgetOr([])('layers');
    const currentLayers = getLayers(this.settings);

    const layers = lxor(currentLayers)([id]);

    this.props.updateSettings({ layers });
  };

  exportItem = () => {
    if (!this.readyForExport) return;

    const username = getSessionUsername();
    const options = {
      itemId: this.selectedFileId,
      title: this.selectedFile.name,
      exportFormat: this.settings.format,
      exportParameters: {
        layers: this.settings.layers.map(id => ({ id })),
        targetSR: this.settings.output
      }
    };

    this.props.exportItem({ username, options });
  };

  options = {
    format: [
      {
        id: 'File Geodatabase',
        value: 'File GDB'
      },
      {
        id: 'Shapefile',
        value: 'Shapefile'
      },
      {
        id: 'GeoJson',
        value: 'GeoJSON'
      },
      {
        id: 'KML',
        value: 'KML'
      }
    ],
    output: [
      {
        id: '4326',
        value: 'WGS 84'
      }
    ]
  };

  render() {
    return (
      <div>
        <header className='header'>
          <div className='container'>
            <div className='app-title'>fs2fGDB</div>
          </div>
        </header>
        <main className='main container'>
          <div className='column column-main'>
            <Breadcrumb goTo={this.openFolder} path={this.path} />
            <Table
              content={this.props.content}
              folder={this.props.currentFolderId}
              toggle={this.toggleItemSelected}
              selected={this.selectedFileId}
              job={this.filesInScheduledJob}
              fetching={this.props.contentStatus === 'getting-content'}
              loading={this.props.contentStatus === 'getting-feature'}
              exporting={this.props.appStatus === 'scheduling-export'}
              open={this.openFolder}
            />
          </div>
          <div className='column column-side'>
            <ul className='controls'>
              <li className='controls-item'>
                <p className='settings-label'>Enable Extract</p>
                <Toggle
                  id='extract'
                  loading={this.props.contentStatus === 'enabling-extract'}
                  checked={this.selectedFileCanExtract}
                  change={this.toggleExtract}
                />
              </li>
              <div className='controls-item'>
                <Button
                  disabled={!this.readyForExport}
                  label='EXPORT'
                  click={this.exportItem}
                />
              </div>
              <li className='controls-item'>
                <p className='controls-item-title'>Settings</p>
                <ul className='settings'>
                  <li className='settings-item'>
                    <p className='settings-label'>Format</p>
                    <RadioButtonList
                      group='formatSettings'
                      items={this.options.format}
                      selected={this.settings.format}
                      change={this.updateFormatSettings}
                    />
                  </li>
                  <li className='settings-item'>
                    <p className='settings-label'>Output Coordinate System</p>
                    <RadioButtonList
                      group='outputSettings'
                      items={this.options.output}
                      selected={this.settings.output}
                      change={this.updateOutputSettings}
                    />
                  </li>
                  <li className='settings-item'>
                    <p className='settings-label'>
                      Layers
                      {this.props.contentStatus === 'getting-feature' ? (
                        <span className='settings-loader' />
                      ) : null}
                    </p>
                    <CheckboxList
                      items={this.selectedFileLayers}
                      selected={this.settings.layers}
                      change={this.updateSelectedLayers}
                    />
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </main>
        <footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.authState.authenticated,
  content: state.contentState.content,
  contentStatus: state.contentState.status,
  currentFolderId: state.contentState.currentFolderId,
  selectedFileId: state.contentState.selectedFileId,
  appStatus: state.appState.status,
  settings: state.appState.settings,
  scheduledJob: state.appState.job
});

const actions = {
  initApp,
  updateSettings,
  loginSuccess,
  logout,
  getUserContent,
  selectFolder,
  selectFile,
  enableExtract,
  exportItem
};

export default connect(
  mapStateToProps,
  actions
)(App);
