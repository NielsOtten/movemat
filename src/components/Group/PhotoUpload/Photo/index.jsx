import React, { Component } from 'react';
import Popup from 'react-popup';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import SVG from '../../../common/SVG';

class Photo extends Component {
  constructor(props) {
    super(props);
    this.groupApi = props.groupApi;
  }

  onDeleteHandler = () => {
    Popup.create({
      title: null,
      content: 'Weet je zeker dat je deze foto wilt verwijderen?',
      buttons: {
        left: [{
          text: 'Nee',
          className: 'danger',
          action() {
            Popup.close();
          },
        }],
        right: [{
          text: 'Ja',
          className: 'success',
          action() {
            this.groupApi.deletePhoto(this.props.id)
              .then((data) => {
                console.log(data);
              });
            Popup.close();
          },
        }],
      },
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
