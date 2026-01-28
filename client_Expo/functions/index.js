const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

setGlobalOptions({
  maxInstances: 10,
  region: 'us-central1',
});

// Configuration
const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL || 'https://fea1e175ddbd.ngrok-free.app';
const WEBHOOK_SECRET =
  process.env.WEBHOOK_SECRET || '9f3c2d5e8a7f4a1c9b2e7d6a0c5f1e3b9a8d7c6e5f4b3a2c1d0e9f8a7b6c5d9a';
function buildUserPayload(firebaseUser, firestoreData = {}) {
  console.log('uuuuuuuuuuuuuuuuuuuuuuser', firebaseUser);
  console.log('ddddddddddddddddddddddddddata', firestoreData);
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    email_verified: firebaseUser.emailVerified || false,
    is_anonymous: firebaseUser.providerData?.length === 0,

    display_name: firebaseUser.displayName || firestoreData.displayName || '',
    full_name: firestoreData.fullName || '',
    phone_number:
      firebaseUser.phoneNumber || firestoreData.phoneNumber || firestoreData.phone || '',

    photo_url: firebaseUser.photoURL || '',
    provider_data: firebaseUser.providerData || [],
    tenant_id: firebaseUser.tenantId || '',

    firebase_created_at: firebaseUser.metadata?.creationTime || null,
    firebase_last_login_at: firebaseUser.metadata?.lastSignInTime || null,
  };
}

exports.syncuserfromfirestore = onDocumentCreated('users/{userId}', async (event) => {
  const snap = event.data;
  if (!snap) return;

  const firestoreData = snap.data();
  const uid = event.params.userId;

  try {
    const firebaseUser = await admin.auth().getUser(uid);

    const userData = buildUserPayload(firebaseUser, firestoreData);

    await axios.post(`${DJANGO_BASE_URL}/auth/webhooks/firebase/user-created/`, userData, {
      headers: {
        'Content-Type': 'application/json',
        'X-Firebase-Secret': WEBHOOK_SECRET,
      },
      timeout: 10000,
    });

    await snap.ref.update({
      syncedToDjango: true,
      syncedAt: admin.firestore.FieldValue.serverTimestamp(),
      syncError: null,
    });

    return { success: true };
  } catch (error) {
    await snap.ref.update({
      syncedToDjango: false,
      syncError: error.message,
      lastSyncAttempt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: false, error: error.message };
  }
});

exports.syncuser = onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const { uid } = req.body;
  if (!uid) {
    res.status(400).json({ error: 'uid is required' });
    return;
  }

  try {
    const firebaseUser = await admin.auth().getUser(uid);
    const userData = buildUserPayload(firebaseUser);

    const response = await axios.post(
      `${DJANGO_BASE_URL}/auth/webhooks/firebase/user-created/`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Firebase-Secret': WEBHOOK_SECRET,
        },
        timeout: 10000,
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.syncallusers = onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const listUsersResult = await admin.auth().listUsers(1000);

    const syncPromises = listUsersResult.users.map(async (firebaseUser) => {
      const userData = buildUserPayload(firebaseUser);

      try {
        await axios.post(`${DJANGO_BASE_URL}/auth/webhooks/firebase/user-created/`, userData, {
          headers: {
            'Content-Type': 'application/json',
            'X-Firebase-Secret': WEBHOOK_SECRET,
          },
          timeout: 10000,
        });
        return { uid: firebaseUser.uid, success: true };
      } catch (error) {
        return { uid: firebaseUser.uid, success: false, error: error.message };
      }
    });
    const results = await Promise.all(syncPromises);
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    res.json({
      message: 'Sync completed',
      total: results.length,
      successful,
      failed,
      results,
    });
  } catch (error) {
    console.error('Error syncing users:', error);
    res.status(500).json({ error: error.message });
  }
});

exports.deactivateuser = onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { uid } = req.body;
  if (!uid) {
    res.status(400).json({ error: 'uid is required' });
    return;
  }

  try {
    const response = await axios.post(
      `${DJANGO_BASE_URL}/auth/webhooks/firebase/user-deleted/`,
      { uid },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Firebase-Secret': WEBHOOK_SECRET,
        },
        timeout: 10000,
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ error: error.message });
  }
});

exports.retryfailedsync = onDocumentCreated('sync_queue/{docId}', async (event) => {
  const snap = event.data;
  if (!snap) {
    console.log('No data associated with the event');
    return;
  }

  const data = snap.data();

  try {
    const response = await axios.post(
      `${DJANGO_BASE_URL}/auth/webhooks/firebase/user-created/`,
      data.userData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Firebase-Secret': WEBHOOK_SECRET,
        },
        timeout: 10000,
      }
    );

    await snap.ref.delete();
    return { success: true };
  } catch (error) {
    console.error('Retry sync failed:', error.message);
    await snap.ref.update({
      retryCount: admin.firestore.FieldValue.increment(1),
      lastError: error.message,
      lastAttempt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: false };
  }
});
