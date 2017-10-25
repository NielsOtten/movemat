import React, { Component } from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { Snackbar } from 'react-toolbox';
import { postPhotos } from '../../../services/api/Group/index';
import styles from './styles.scss';

class PhotoUpload extends Component {
  state = {
    drag: false,
    uploading: false,
    uploaded: false,
  };

  constructor(props) {
    super(props);

    this.onDrop = this.onDrop.bind(this);
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

  onDragEnter = () => {
    this.setState({ drag: true });
  };

  onDragLeave = () => {
    this.setState({ drag: false });
  };

  async onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if(!this.state.uploading) {
      const fileList = e.dataTransfer.files;
      const files = [].slice.call(fileList);
      const allowedFiles = files.filter(file => this.allowedFileTypes.includes(file.type));
      this.setState({ uploading: true });

      if(allowedFiles.length > 0) {
        try {
          const response = await postPhotos(allowedFiles, this.props.groupId);
          // TODO: Add validation for response
          this.props.getPhotos(this.props.groupId);
          this.setState({ uploaded: true });
        } catch(exception) {
          console.log(exception);
        }
      }

      this.setState({ drag: false, uploading: false });
    }
  }

  onDragOver = (e) => {
    e.preventDefault();
  };

  handleSnackbar = () => {
    this.setState({ uploaded: false });
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
      </div>
    );
  }
}

export default PhotoUpload;
