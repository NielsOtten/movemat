class GroupApi {
  constructor(id) {
    this.id = id;
  }

  hasAccess() {
    fetch(`/api/group/${this.id}`, {
      credentials: 'same-origin',
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
