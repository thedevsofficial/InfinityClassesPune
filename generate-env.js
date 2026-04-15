const fs = require('fs');
const path = require('path');

/**
 * generate-env.js
 * Automatically generates env.js from environment variables (Netlify) 
 * or a local .env file.
 */

function generate() {
    let envData = {};

    // 1. Try to read from local .env file if it exists
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        console.log('Reading from local .env file...');
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                envData[key.trim()] = value.trim();
            }
        });
    }

    // 2. Override with system environment variables (Netlify)
    const keys = [
        'FIREBASE_API_KEY',
        'FIREBASE_AUTH_DOMAIN',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_MESSAGING_SENDER_ID',
        'FIREBASE_APP_ID',
        'FIREBASE_MEASUREMENT_ID',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_UPLOAD_PRESET'
    ];

    keys.forEach(key => {
        if (process.env[key]) {
            envData[key] = process.env[key];
        }
    });

    // 3. Construct the env.js content
    const envJsContent = `export const ENV = {
  // Firebase Configuration
  FIREBASE_API_KEY: "${envData.FIREBASE_API_KEY || ''}",
  FIREBASE_AUTH_DOMAIN: "${envData.FIREBASE_AUTH_DOMAIN || ''}",
  FIREBASE_PROJECT_ID: "${envData.FIREBASE_PROJECT_ID || ''}",
  FIREBASE_MESSAGING_SENDER_ID: "${envData.FIREBASE_MESSAGING_SENDER_ID || ''}",
  FIREBASE_APP_ID: "${envData.FIREBASE_APP_ID || ''}",
  FIREBASE_MEASUREMENT_ID: "${envData.FIREBASE_MEASUREMENT_ID || ''}",

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: "${envData.CLOUDINARY_CLOUD_NAME || ''}",
  CLOUDINARY_UPLOAD_PRESET: "${envData.CLOUDINARY_UPLOAD_PRESET || ''}"
};
`;

    // 4. Write to env.js
    fs.writeFileSync(path.join(__dirname, 'env.js'), envJsContent);
    console.log('✅ env.js has been generated successfully.');
}

generate();
