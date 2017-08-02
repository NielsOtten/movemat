import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Photo from './PhotoUpload/Photo';
import GroupApi from '../../api';
import PhotoUpload from './PhotoUpload';
import styles from './styles.scss';

/**
 * This is the detail view of the group in which you can view all your photo's from that group.
 */
@observer
class Group extends Component {
  constructor(props) {
    super(props);
    this.GroupAPI = new GroupApi(props.params.id);
    this.onSumbitHandler = this.onSumbitHandler.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  componentDidMount() {
    this.getPhotos();
  }

  onSumbitHandler(e) {
    e.preventDefault();
    this.GroupAPI.addUser();
  }

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
        <form onSubmit={this.onSumbitHandler}>
          <input type='submit' />
        </form>
        <PhotoUpload groupApi={this.GroupAPI} groupId={this.props.params.id}/>
        <div className={styles.photos}>
          {this.uploadedPhotos.map(photo => <Photo
            key={photo._id}
            id={photo._id}
            preview={`${photo.path}?preview=1`}
            title={photo.name}
            groupApi={this.props.groupApi}
          />)}
        </div>
      </div>
    );
  }
}

export default Group;
