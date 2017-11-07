/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { Snackbar } from 'react-toolbox';
import { getPhotos, deletePhoto } from '../../services/api/Group';
import Photo from '../../components/Photo';
import styles from './styles.scss';
import PhotoUpload from './PhotoUpload';

class Group extends Component {
  state = {
    photos: [],
    deletedPhoto: false,
  };

  constructor(props) {
    super(props);

    this.getPhotos = this.getPhotos.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
  }

  async componentDidMount() {
    const id = this.props.computedMatch.params.id;
    this.getPhotos(id);
  }

  async getPhotos(id) {
    try {
      const response = await getPhotos(id);
      const photos = await response.json();
      this.setState({ photos });
    } catch(exception) {
      console.info(exception);
    }
  }

  async deletePhoto(id, groupId) {
    try {
      const response = await deletePhoto(id, groupId);
      const json = await response.json();
      if(json.deleted) {
        this.setState({ deletedPhoto: true });
      }
      this.getPhotos(this.props.computedMatch.params.id);
    } catch(exception) {
      console.info(exception);
    }
  }

  render() {
    const photos = this.state.photos.map(photo => (
      <Photo
        key={photo._id}
        thumbnail={`${photo.thumbnail}?preview=1`}
        photo={`${photo.path}?preview=1`}
        title={photo.name}
        deletePhoto={() => this.deletePhoto(photo._id, this.props.computedMatch.params.id)}
      />));

    return (
      <div className={styles.groupWrapper}>
        <Snackbar
          active={this.state.deletedPhoto}
          label='Foto verwijderd'
          timeout={2000}
          onTimeout={() => this.setState({ photoDeleted: false })}
        />
        <PhotoUpload groupId={this.props.computedMatch.params.id} getPhotos={this.getPhotos} />
        <div className={styles.uploadText}>
          Sleep de foto's op de website om ze naar de steps te uploaden.
        </div>
        <div className={styles.photos}>
          {photos.length <= 0 && <p>Er zijn nog geen foto's gevonden</p>}
          {photos}
        </div>
      </div>
    );
  }
}

export default Group;
