import Group from '../models/Group';

/**
 * Default error handling for group routes.
 */
function groupUndefined(res) {
  res.status(400);
  return res.json({ error: 'group is undefined' });
}

function userUndefined(res) {
  res.status(403);
  return res.json({ loggedIn: false });
}

function notMemberOfGroup(res) {
  res.status(403);
  return res.json({ error: 'User not member of group' });
}

function userNoAccess(res) {
  res.status(403);
  return res.json({ error: 'User role not valid' });
}

function isLoggedIn(req, res, next) {
  if(!req.user) {
    return userUndefined(res);
  }
  return next();
}

async function memberOfGroup(req, res, next) {
  const user = req.user;

  if(!user) {
    return userUndefined(res);
  }

  const id = req.params.id;
  const group = await Group.findOne({ _id: id });

  if(!group || group === 'undefined') {
    return groupUndefined(res);
  }

  // Check if user is member of the group.
  if(!group.memberOfGroup(user)) {
    return notMemberOfGroup(res);
  }

  res.locals.group = group;

  return next();
}

async function tokenOrLoggedIn(req, res, next) {
  const { token } = req.query;
  const { id } = req.params;

  const user = req.user;
  let group = null;
  if(!user) {
    // User is not defined so check if token is given.
    // Then get group with token.
    if(token && token !== 'undefined') {
      group = await Group.findOne({ _id: id, token });
    }
  } else {
    group = await Group.findOne({ _id: id });
  }

  if(!group || group === 'undefined') {
    return groupUndefined(res);
  }

  // Check if user is member of the group.
  if(user && !group.memberOfGroup(user)) {
    return notMemberOfGroup(res);
  }

  return next();
}

function isAdmin(req, res, next) {
  if(!req.user) {
    return userUndefined(res);
  }

  if(req.user.role !== 'admin') {
    return userNoAccess(res);
  }

  return next();
}

export { isLoggedIn, memberOfGroup, tokenOrLoggedIn, isAdmin };
