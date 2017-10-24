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
  return fetch(`/api/group/${id}/photos`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
    credentials: 'include',
  });
}

function postPhotos(files, groupId) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('image', file);
  });

  return fetch(`/api/group/${groupId}/photos`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
}

export { getGroups, getPhotos, postPhotos };
