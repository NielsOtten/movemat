/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { getPhotos } from '../../services/api/Group';
import Photo from '../../components/Photo';
import styles from './styles.scss';
import PhotoUpload from './PhotoUpload';

class Group extends Component {
  state = {
    photos: [],
  };

  constructor(props) {
    super(props);

    this.getPhotos = this.getPhotos.bind(this);
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

  render() {
    const photos = this.state.photos.map(photo => (
      <Photo
        key={photo._id}
        thumbnail={`${photo.thumbnail}?preview=1`}
        photo={`${photo.path}?preview=1`}
        title={photo.name}
      />));

    return (
      <div className={styles.groupWrapper}>
        <PhotoUpload groupId={this.props.computedMatch.params.id} getPhotos={this.getPhotos} />
        <div>
          {photos.length <= 0 && <p>Er zijn nog geen foto's gevonden</p>}
          {photos}
        </div>
      </div>
    );
  }
}

export default Group;
