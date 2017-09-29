import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import request from 'superagent';
import GroupApi from '../../../api/Group';
import Photo from './Photo/index';
import styles from './styles.scss';

class PhotoUpload extends Component {
  constructor(props) {
    super(props);

    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  changeHandler(uploadedPhotos) {
    const req = request.post(`/api/group/${this.props.groupId}/photos`);
    uploadedPhotos.forEach((file) => {
      req.attach('image', file);
    });
    req.end((err, data) => {
      if(err) {
        console.log(err);
      } else {
        this.props.changeHandler();
      }
    });
  }

  submitHandler() {
    this.props.groupApi.postPhotos(this.state.uploadedPhotos);
  }

  render() {
    return (
      <div>
        <Dropzone
          className={styles.dropZone}
          onDrop={this.changeHandler}
        >
          <h2>Klik hier om bestanden te uploaden of sleep de bestanden hierop.</h2>
        </Dropzone>
      </div>
    );
  }
}

PhotoUpload.propTypes = {
  groupApi: PropTypes.instanceOf(GroupApi).isRequired,
  groupId: PropTypes.string.isRequired,
};

export default PhotoUpload;
