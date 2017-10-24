import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const Photo = ({ thumbnail, photo, title }) => (
  <div>
    <div className={styles.thumbnail}>
      <img src={thumbnail} alt={title} />
    </div>
    <div className={styles.mainImage} />
  </div>
);

Photo.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Photo;
