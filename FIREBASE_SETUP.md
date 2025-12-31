# Firebase Setup & Initialization Guide

To connect your own Firebase database to the **Connect Pharma API**, follow these steps.

---

## Step 1: Generate Service Account Credentials
... (see original) ...

## Step 2: Get your Web API Key (For Login)
1. In the **Firebase Console**, go to **Project Settings** (Gear Icon).
2. Under the **General** tab, look for **Web API Key**.
3. Copy this key.
4. Add it to your `.env` file:
   ```env
   FIREBASE_API_KEY=your-web-api-key-here
   ```

## Step 3: Configure the Backend Environment
Open your `Connect_pharma_api/.env` file and ensure it has these variables:

```env
PORT=3000
JWT_SECRET=your_random_secret_string
FIREBASE_API_KEY=your-web-api-key-from-step-2
...
```

### Option B: Using the JSON File Directly
1.  Move the downloaded `.json` file into the `Connect_pharma_api` folder.
2.  Rename it to `serviceAccountKey.json`.
3.  Add this to your `.env`:
    ```env
    FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
    ```

---

## Step 3: Initialize the SDK in Code

Ensure your `src/config/firebase_config.js` looks like this (it has been updated to be robust):

```javascript
const admin = require('firebase-admin');

const connectDB = () => {
    try {
        if (admin.apps.length === 0) {
            // Priority 1: Service Account JSON File
            if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
                const serviceAccount = require(require('path').resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
            } 
            // Priority 2: Individual Environment Variables
            else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    })
                });
            } else {
                throw new Error('❌ Missing Firebase credentials in .env');
            }
        }
        return admin.firestore();
    } catch (error) {
        console.error('❌ Firebase Error:', error.message);
        return null;
    }
};

module.exports = { connectDB, admin };
```

---

## Step 4: Verify Connection

1.  Open your terminal in `Connect_pharma_api`.
2.  Run `node src/server.js`.
3.  Look for the message: `✅ Firebase Admin SDK Initialized`.
