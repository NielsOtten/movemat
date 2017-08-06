import React, { Component } from 'react';
import Popup from 'react-popup';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import SVG from '../../../common/SVG';

class Photo extends Component {
  constructor(props) {
    super(props);
    this.groupApi = props.groupApi;

    this.state = {
      open: false,
    };
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

  showBigPhoto = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  render() {
    const open = this.state.open ? styles.visible : '';
    return (
      <div className={styles.photo}>
        <div className={styles.innerBox} onClick={this.showBigPhoto}>
          <img src={this.props.thumbnail} alt={this.props.title} />
        </div>
        <button onClick={this.onDeleteHandler}><SVG src='bin' /></button>
        <h3>{this.props.title}</h3>
        <div className={[styles.overlayBigPhoto, open].join(' ')} onClick={this.showBigPhoto}>
          <div className={styles.bigPhoto} onClick={(e) => { e.preventDefault(); }}>
            <img src={this.props.photo} alt={this.props.title} />
          </div>
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
