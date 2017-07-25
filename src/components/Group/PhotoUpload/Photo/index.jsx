import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import SVG from '../../../common/SVG';

class Photo extends Component {
  constructor(props) {
    super(props);
    this.groupApi = props.groupApi;
  }

  onDeleteHandler = () => {
    console.log(this.props.id);
    this.groupApi.deletePhoto(this.props.id)
      .then((data) => {
        console.log(data);
      });
  };

  render() {
    return (
      <div className={styles.photo}>
        <div className={styles.innerBox}>
          <img src={this.props.preview} alt={this.props.title} />
        </div>
        <button onClick={this.onDeleteHandler}><SVG src='bin' /></button>
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
