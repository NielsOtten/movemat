

class GroupApi {
  constructor(id) {
    this.id = id;
  }

  addUser() {
    fetch(`/api/group/${this.id}`, {
      credentials: 'same-origin',
      method: 'POST',
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => { console.log(err); });
  }

  getToken() {
    return fetch(`/api/group/${this.id}/token`, {
      credentials: 'same-origin',
      method: 'GET',
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((err) => { console.log(err); });
  }

  getGroups() {
    return fetch('/api/user/groups', {
      credentials: 'same-origin',
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        return data;
      })
      .catch((err) => { console.log(err); });
  }

  postPhotos(photos) {
    const newPhotos = { newPhotos: photos };
    return fetch(`/api/group/${this.id}/photos`, {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(newPhotos),
    })
      .then(res => res.json())
      .then(data => data)
      .catch((err) => { console.log(err); });
  }

  getPhotos() {
    return fetch(`/api/group/${this.id}/photos`, {
      credentials: 'same-origin',
      method: 'GET',
    })
      .then(res => res.json())
      .then((data) => {
        console.log('data', data);
        return data;
      })
      .catch((err) => { console.log(err); });
  }

  deletePhoto(photoId) {
    return fetch(`/api/group/${this.id}/photos/${photoId}`, {
      credentials: 'same-origin',
      method: 'DELETE',
    })
      .then(res => res.json())
      .then((data) => {
        console.log('data', data);
        return data;
      })
      .catch((err) => { console.log(err); });
  }
}

export default GroupApi;
