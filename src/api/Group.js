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
  getToken() {}
}

export default GroupApi;
