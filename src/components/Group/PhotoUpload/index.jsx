import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import fetch from 'fetch-everywhere';
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
    newPhotos: [],
  };

  componentDidMount() {
    this.getPhotos();
  }

  getPhotos = () => {
    this.props.groupApi.getPhotos()
      .then((uploadedPhotos) => {
        console.log(uploadedPhotos);
        if(uploadedPhotos && uploadedPhotos instanceof Array) {
          this.setState({ uploadedPhotos });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  changeHandler(uploadedPhotos) {
    const req = request.post(`/api/group/${this.props.groupId}/photos`);
    uploadedPhotos.forEach((file) => {
      req.attach('image', file);
    });
    req.end((err, data) => {
      if(err) {
        console.log(err);
      } else {
        this.setState({ newPhotos: data.body.newPhotos });
      }
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
          <h2>NEW PHOTOS</h2>
          {this.state.newPhotos.map(photo => <Photo
            key={photo.name + photo.lastModified}
            preview={photo.path}
            title={photo.name}
          />)}
        </section>
        <section className={styles.photos}>
          <h2>UPLOADED PHOTOS</h2>
          {this.state.uploadedPhotos.map(photo => <Photo
          // eslint-disable-next-line no-underscore-dangle
            key={photo._id}
            preview={photo.path}
            title={photo.name}
          />)}
        </section>
      </div>
    );
  }
}

PhotoUpload.propTypes = {
  groupApi: PropTypes.instanceOf(GroupApi).isRequired,
  groupId: PropTypes.string.isRequired,
};

export default PhotoUpload;
