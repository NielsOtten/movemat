import fetch from 'fetch-everywhere';

function getGroups() {
  return fetch('/api/group', {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
    credentials: 'include',
  });
}

function getPhotos(id) {
  console.log('getting photos');
  return fetch(`/api/group/${id}/photos`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
    credentials: 'include',
  });
}

export { getGroups, getPhotos };
