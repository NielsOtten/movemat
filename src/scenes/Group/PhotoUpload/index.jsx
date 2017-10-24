import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { postPhotos } from '../../../services/api/Group/index';

class PhotoUpload extends Component {
  state = {
    drag: false,
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

  onDragEnter = (e) => {
    this.setState({ drag: true });
  };

  onDragLeave = (e) => {
    this.setState({ drag: false });
  };

  onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const fileList = e.dataTransfer.files;
    const files = [].slice.call(fileList);
    const allowedFiles = files.filter(file => this.allowedFileTypes.includes(file.type));

    if(allowedFiles.length > 0) {
      try {
        postPhotos(allowedFiles, this.props.groupId).then(() => {
          this.props.getPhotos(this.props.groupId);
        });
      } catch (exception) {
        console.log(exception);
      }
    }

    this.setState({ drag: false });
  };

  onDragOver = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <div>
        {this.state.drag && <div>Sleep uw foto's hier.</div>}
      </div>
    );
  }
}

PhotoUpload.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default PhotoUpload;
