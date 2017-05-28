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
}

export default GroupApi;
