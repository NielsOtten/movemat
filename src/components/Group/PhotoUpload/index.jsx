import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import request from 'superagent';
import GroupApi from '../../../api/Group';
import Photo from './Photo';
import styles from './styles.scss';

class PhotoUpload extends Component {
  constructor(props) {
    super(props);

    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  state = {
    uploadedPhotos: [],
  };

  changeHandler(uploadedPhotos) {
    const req = request.post('/api/group/59274d8aba0dfc1c58871182/photos');
    uploadedPhotos.forEach((file) => {
      req.attach('image', file);
    });
    req.end((data) => {
      console.log(data);
    });
  }

  submitHandler() {
    this.props.groupApi.postPhotos(this.state.uploadedPhotos);
  }

  render() {
    return (
      <div>
        <section className={styles.upload}>
          <Dropzone onDrop={this.changeHandler}>
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
        </section>
        <section className={styles.photos}>
          {this.state.uploadedPhotos.map(photo => <Photo
            key={photo.name + photo.lastModified}
            preview={photo.preview}
            title={photo.name}
          />)}
        </section>
      </div>
    );
  }
}

PhotoUpload.propTypes = {
  groupApi: PropTypes.instanceOf(GroupApi).isRequired,
};

export default PhotoUpload;
