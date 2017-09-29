import React, { Component } from 'react';
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

  showBigPhoto = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  render() {
    const bigPhoto = this.state.open ? <div className={styles.overlayBigPhoto} onClick={this.showBigPhoto}>
      <div className={styles.bigPhoto} onClick={(e) => { e.preventDefault(); }}>
        <img src={this.props.photo} alt={this.props.title} />
      </div>
    </div> : '';
    return (
      <div className={styles.photo}>
        <div className={styles.innerBox} onClick={this.showBigPhoto}>
          <img src={this.props.thumbnail} alt={this.props.title} />
        </div>
        <button onClick={() => { this.props.deleteHandler(this); }}><SVG src='bin' /></button>
        <h3>{this.props.title}</h3>
        {bigPhoto}
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
