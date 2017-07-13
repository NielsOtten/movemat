import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class Photo extends Component {
  constructor(props) {
    super(props);
    this.groupApi = props.groupApi;
  }

  onDeleteHandler = () => {
    console.log(this.props.id);
    this.groupApi.deletePhoto(this.props.id)
      .then(data => {
        console.log(data);
      })
  };

  render() {
    return (
      <div className={styles.photo}>
        <img src={this.props.preview} alt={this.props.title}/>
        <h3>{this.props.title}</h3>
        <button onClick={this.onDeleteHandler}>Delete</button>
      </div>
    );
  }
}

Photo.propTypes = {
  preview: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Photo;
