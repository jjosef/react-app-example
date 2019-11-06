const admin = require('firebase-admin');

exports.validateFirebaseIdToken = (req) => {
  return new Promise((resolve, reject) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
          'Make sure you authorize your request by providing the following HTTP header:',
          'Authorization: Bearer <Firebase ID Token>');
      return reject({code: 403, error: 'Unauthorized'});
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
      console.log('ID Token correctly decoded', decodedIdToken);
      admin.auth().getUser(decodedIdToken.uid).then((userRecord) => {
        return resolve(userRecord);
      }).catch(error => {
        console.error('Error while getting Firebase User record:', error);
        return reject({code: 403, error: 'Unauthorized'});
      });
    }).catch(error => {
      console.error('Error while verifying Firebase ID token:', error);
      return reject({code: 403, error: 'Unauthorized'});
    });
  });
};

/**
 *  Validate a user's organizational permissions
 *
 *  @method validateUserPermissions
 *  @param user Firebase User object
 *  @param organization_id Organization ID string
 *  @param permission Object[] Array of objects for permissions to check
 *  @param permission.name Name of permission
 *  @param permission.action Either `r` or `w` for read or write.
 */
exports.validateUserPermissions = (user, organization_id, permissionArray) => {
  return new Promise((resolve, reject) => {
    admin.database().ref(`/user_permissions/${user.uid}`).once('value').then((snapshot) => {
      let permissions = snapshot.val();
      if(!permissions) {
        return reject({code: 403, error: 'Unauthorized'});
      }

      if(permissions.admin === true) {
        return resolve(true);
      }

      if(!permissions[organization_id]) {
        return reject({code: 403, error: 'Unauthorized'});
      }

      if(permissions[organization_id].owner === true) {
        return resolve(true);
      }

      for(let i = 0, limit = permissionArray.length; i < limit; i++) {
        let permission = permissionArray[i];
        if(permission.name === 'owner') {
          if(!permissions[organization_id].owner) {
            return reject({code: 403, error: 'Unauthorized'});
          }
        }
        if(!permissions[organization_id][permission.name]) {
          return reject({code: 403, error: 'Unauthorized'});
        }

        if(!permissions[organization_id][permission.name][permission.action]) {
          return reject({code: 403, error: 'Unauthorized'});
        }
      }

      return resolve(true);
    })
  })
}
