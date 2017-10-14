/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { getPhotos } from '../../services/api/Group';
import Photo from '../../components/Photo';
import styles from './styles.scss';

class Group extends Component {
  state = {
    photos: [],
  };

  async componentDidMount() {
    const id = this.props.computedMatch.params.id;
    try {
      const response = await getPhotos(id);
      const photos = await response.json();
      this.setState({ photos });
    } catch(exception) {
      console.info(exception);
    }
  }

  render() {
    const photos = this.state.photos.map(photo => <Photo key={photo._id} />);

    return (
      <div>
        photos
        <div className={styles.photos}>
          {photos.length <= 0 && <p>Er zijn nog geen foto's gevonden</p>}
          {photos}
        </div>
      </div>
    );
  }
}

export default Group;
