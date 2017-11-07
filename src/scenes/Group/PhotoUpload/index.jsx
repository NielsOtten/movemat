import React, { Component } from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { Snackbar, Button } from 'react-toolbox';
import { postPhotos } from '../../../services/api/Group/index';
import styles from './styles.scss';

class PhotoUpload extends Component {
  state = {
    drag: false,
    draggedFiles: [],
    uploading: false,
    uploaded: false,
  };

  constructor(props) {
    super(props);

    this.dragTargets = [];

    this.onDrop = this.onDrop.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  allowedFileTypes = [
    'image/jpeg',
    'image/png',
  ];

  componentDidMount() {
    window.addEventListener('dragover', this.onDragOver);
    window.addEventListener('mouseup', this.onDragLeave);
    window.addEventListener('dragleave', this.onDragLeave);
    window.addEventListener('dragenter', this.onDragEnter);
    window.addEventListener('drop', this.onDrop);
  }

  componentWillUnmount() {
    window.removeEventListener('dragover', this.onDragOver);
    window.removeEventListener('mouseup', this.onDragLeave);
    window.removeEventListener('dragleave', this.onDragLeave);
    window.removeEventListener('dragenter', this.onDragEnter);
    window.removeEventListener('drop', this.onDrop);
  }

  getDataTransferItems(event) {
    let dataTransferItemsList = [];
    if(event.dataTransfer) {
      const dt = event.dataTransfer;
      if(dt.files && dt.files.length) {
        dataTransferItemsList = dt.files;
      } else if(dt.items && dt.items.length) {
        // During the drag even the dataTransfer.files is null
        // but Chrome implements some drag store, which is accesible via dataTransfer.items
        dataTransferItemsList = dt.items;
      }
    } else if(event.target && event.target.files) {
      dataTransferItemsList = event.target.files;
    }
    // Convert from DataTransferItemsList to the native Array
    return Array.prototype.slice.call(dataTransferItemsList);
  }

  onDragEnter = (e) => {
    e.preventDefault();

    // Count the dropzone and any children that are entered.
    if(this.dragTargets.indexOf(e.target) === -1) {
      this.dragTargets.push(e.target);
    }

    this.setState({
      drag: true,
      draggedFiles: this.getDataTransferItems(e),
    });
  };

  onDragLeave = (e) => {
    e.preventDefault();

    // Only deactivate once the dropzone and all children have been left.
    this.dragTargets = this.dragTargets.filter(el => el !== e.target && document.querySelector('#root').contains(el));
    if(this.dragTargets.length > 0) {
      return;
    }

    // Clear dragging files state
    this.setState({
      drag: false,
      draggedFiles: [],
    });
  };

  async onDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    this.dragTargets = [];

    if(!this.state.uploading) {
      const fileList = e.dataTransfer.files;
      const files = [].slice.call(fileList);
      const allowedFiles = files.filter(file => this.allowedFileTypes.includes(file.type));
      this.setState({ uploading: true });

      if(allowedFiles.length > 0) {
        await this.uploadFiles(files);
      }

      this.setState({ drag: false, uploading: false, draggedFiles: [] });
    }
  }

  async uploadFiles(files) {
    console.log(files);
    try {
      const response = await postPhotos(files, this.props.groupId);
      // TODO: Add validation for response
      this.props.getPhotos(this.props.groupId);
      this.setState({ uploaded: true });
    } catch(exception) {
      console.log(exception);
    }
  }

  onDragOver = (e) => {
    e.preventDefault();
  };

  handleSnackbar = () => {
    this.setState({ uploaded: false });
  };

  handleFileUpload = (e) => {
    e.preventDefault();

    if(!this.state.uploading) {
      this.setState({ uploading: true });

      const fileList = e.target.files;
      const files = [].slice.call(fileList);
      this.uploadFiles(files)
        .then(() => {
          this.setState({ uploading: false });
        });
    }
  };

  render() {
    return (
      <div>
        {this.state.drag && !this.state.uploading && <div className={styles.dragArea}>
          <p>{'Sleep hier uw foto\'s.'}</p>
        </div>}
        {this.state.uploading && <ProgressBar className={styles.progressBar} type='circular' mode='indeterminate' multicolor />}
        <Snackbar
          active={this.state.uploaded}
          label={'Foto\'s zijn geüpload'}
          type='cancel'
          onClick={this.handleSnackbar}
          onTimeout={this.handleSnackbar}
          timeout={2000}
        />
        <input ref={fileUpload => this.fileUpload = fileUpload} type='file' multiple style={{ display: 'none' }} onChange={this.handleFileUpload} />
        <Button className={styles.addButton} icon='add' floating accent onClick={() => { this.fileUpload.click(); }} />
      </div>
    );
  }
}

export default PhotoUpload;
