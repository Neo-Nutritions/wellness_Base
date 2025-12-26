const functions = require("firebase-functions");
const fetch = require("node-fetch");

const DJANGO_BASE_URL = "https://c89eb37858e7.ngrok-free.app";
const SECRET = '9f3c2d5e8a7f4a1c9b2e7d6a0c5f1e3b9a8d7c6e5f4b3a2c1d0e9f8a7b6c5d9a';

exports.userCreated = functions.auth.user().onCreate(async (user) => {
  await fetch(`${DJANGO_BASE_URL}/webhooks/firebase/user-created/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Firebase-Secret": SECRET,
    },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      phone_number: user.phoneNumber,
    }),
  });
});

exports.userDeleted = functions.auth.user().onDelete(async (user) => {
  await fetch(`${DJANGO_BASE_URL}/webhooks/firebase/user-deleted/`, {
    method: "POST",
    headers: {
      "X-Firebase-Secret": SECRET,
    },
    body: JSON.stringify({ uid: user.uid }),
  });
});
