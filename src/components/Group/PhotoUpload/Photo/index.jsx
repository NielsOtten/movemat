import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class Photo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.photo}>
        <img src={this.props.preview} alt={this.props.title}/>
        <h3>{this.props.title}</h3>
      </div>
    );
  }
}

Photo.propTypes = {
  preview: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Photo;
