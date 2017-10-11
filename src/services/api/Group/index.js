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

export { getGroups };
