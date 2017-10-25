import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class Photo extends Component {
  render() {
    return (
      <div>
        <div className={styles.thumbnail}>
          <img src={this.props.thumbnail} alt={this.props.title} />
        </div>
        <div className={styles.mainImage}>
          <img src={this.props.photo} alt={this.props.title} />
        </div>
      </div>
    );
  }
}

Photo.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Photo;
