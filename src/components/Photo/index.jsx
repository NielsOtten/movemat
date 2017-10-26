import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-toolbox/lib/button';
import styles from './styles.scss';

class Photo extends Component {
  state = {
    open: false,
  };

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    return (
      <div className={styles.photo}>
        <Button className={styles.delete} icon='delete' floating onClick={this.props.deletePhoto} />
        <div className={styles.thumbnail} onClick={this.toggleOpen}>
          <img src={this.props.thumbnail} alt={this.props.title} />
        </div>
        {this.state.open && <div className={styles.mainImage} onClick={this.toggleOpen}>
          <img src={this.props.photo} alt={this.props.title} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} />
        </div> }
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
