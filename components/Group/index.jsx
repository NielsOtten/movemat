import React, { Component } from 'react';
import { observable } from 'mobx';
import Popup from 'react-popup';
import { observer } from 'mobx-react';
import Photo from './PhotoUpload/Photo/index';
import GroupApi from '../../api';
import PhotoUpload from './PhotoUpload/index';
import styles from './styles.scss';

/**
 * This is the detail view of the group in which you can view all your photo's from that group.
 */
@observer
class Group extends Component {
  constructor(props) {
    super(props);
    this.GroupAPI = new GroupApi(props.params.id);
    this.getToken = this.getToken.bind(this);
  }

  componentDidMount() {
    this.getPhotos();
  }

  onDeleteHandler = (photo) => {
    const group = this;
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
            photo.groupApi.deletePhoto(photo.props.id)
              .then((
              ) => {
                group.getPhotos();
              });
            Popup.close();
          },
        }],
      },
    });
  };

  getPhotos = () => {
    this.GroupAPI.getPhotos()
    .then((uploadedPhotos) => {
      if(uploadedPhotos && uploadedPhotos instanceof Array) {
        this.uploadedPhotos = uploadedPhotos;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };

  getToken(e) {
    e.preventDefault();
    this.GroupAPI.getToken();
  }

  @observable uploadedPhotos = [];

  render() {
    return (
      <div>
        <PhotoUpload groupApi={this.GroupAPI} groupId={this.props.params.id} changeHandler={this.getPhotos} />
        <div className={styles.photos}>
          {this.uploadedPhotos.map(photo => <Photo
            key={photo._id}
            id={photo._id}
            thumbnail={`${photo.thumbnail}?preview=1`}
            photo={`${photo.path}?preview=1`}
            title={photo.name}
            groupApi={this.GroupAPI}
            deleteHandler={this.onDeleteHandler}
          />)}
        </div>
      </div>
    );
  }
}

export default Group;
