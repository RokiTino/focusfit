#!/usr/bin/env node

/**
 * FocusFit Configuration Verification Script
 * Verifies that all Firebase configuration is correctly set up
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 FocusFit Configuration Verification\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: Verify .env file exists and has correct values
console.log('1️⃣ Checking .env file...');
try {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('   ❌ .env file not found!');
    hasErrors = true;
  } else {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
      'EXPO_PUBLIC_FIREBASE_API_KEY',
      'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
      'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'EXPO_PUBLIC_FIREBASE_APP_ID',
      'EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID'
    ];

    let allPresent = true;
    for (const varName of requiredVars) {
      if (!envContent.includes(varName)) {
        console.error(`   ❌ Missing ${varName}`);
        allPresent = false;
        hasErrors = true;
      } else if (envContent.includes(`${varName}=your-`) || envContent.includes(`${varName}=\n`)) {
        console.warn(`   ⚠️  ${varName} appears to be a placeholder`);
        hasWarnings = true;
      }
    }

    if (allPresent && !hasWarnings) {
      console.log('   ✅ .env file is correctly configured');
    }
  }
} catch (error) {
  console.error('   ❌ Error reading .env:', error.message);
  hasErrors = true;
}

// Check 2: Verify iOS GoogleService-Info.plist
console.log('\n2️⃣ Checking iOS Firebase config...');
try {
  const plistPath = path.join(__dirname, 'ios', 'Focusfit', 'GoogleService-Info.plist');
  if (!fs.existsSync(plistPath)) {
    console.error('   ❌ GoogleService-Info.plist not found!');
    hasErrors = true;
  } else {
    const plistContent = fs.readFileSync(plistPath, 'utf8');
    if (plistContent.includes('focusefit') && plistContent.includes('AIzaSy')) {
      console.log('   ✅ iOS Firebase config file is present and valid');
    } else {
      console.warn('   ⚠️  iOS Firebase config may be a placeholder');
      hasWarnings = true;
    }
  }
} catch (error) {
  console.error('   ❌ Error reading iOS config:', error.message);
  hasErrors = true;
}

// Check 3: Verify Android google-services.json
console.log('\n3️⃣ Checking Android Firebase config...');
try {
  const jsonPath = path.join(__dirname, 'android', 'app', 'google-services.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('   ❌ google-services.json not found!');
    hasErrors = true;
  } else {
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const config = JSON.parse(jsonContent);
    if (config.project_info && config.project_info.project_id === 'focusefit') {
      console.log('   ✅ Android Firebase config file is present and valid');
    } else {
      console.warn('   ⚠️  Android Firebase config may be incorrect');
      hasWarnings = true;
    }
  }
} catch (error) {
  console.error('   ❌ Error reading Android config:', error.message);
  hasErrors = true;
}

// Check 4: Verify firebase.ts has fallback constants
console.log('\n4️⃣ Checking firebase.ts implementation...');
try {
  const firebasePath = path.join(__dirname, 'lib', 'firebase.ts');
  if (!fs.existsSync(firebasePath)) {
    console.error('   ❌ lib/firebase.ts not found!');
    hasErrors = true;
  } else {
    const firebaseContent = fs.readFileSync(firebasePath, 'utf8');
    if (firebaseContent.includes('FIREBASE_CONFIG_FALLBACK') &&
        firebaseContent.includes('getConfigValue')) {
      console.log('   ✅ firebase.ts has proper fallback configuration');
    } else {
      console.error('   ❌ firebase.ts is missing fallback configuration');
      hasErrors = true;
    }
  }
} catch (error) {
  console.error('   ❌ Error reading firebase.ts:', error.message);
  hasErrors = true;
}

// Check 5: Verify app.json has correct bundle IDs
console.log('\n5️⃣ Checking app.json configuration...');
try {
  const appJsonPath = path.join(__dirname, 'app.json');
  if (!fs.existsSync(appJsonPath)) {
    console.error('   ❌ app.json not found!');
    hasErrors = true;
  } else {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    const iosBundleId = appJson.expo?.ios?.bundleIdentifier;
    const androidPackage = appJson.expo?.android?.package;

    if (iosBundleId === 'com.focusfit.app') {
      console.log('   ✅ iOS bundle identifier is correct');
    } else {
      console.error(`   ❌ iOS bundle identifier incorrect: ${iosBundleId}`);
      hasErrors = true;
    }

    if (androidPackage === 'com.focusfit.app') {
      console.log('   ✅ Android package name is correct');
    } else {
      console.error(`   ❌ Android package name incorrect: ${androidPackage}`);
      hasErrors = true;
    }
  }
} catch (error) {
  console.error('   ❌ Error reading app.json:', error.message);
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Configuration has ERRORS - please fix before running');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Configuration has warnings - may work but should be reviewed');
  process.exit(0);
} else {
  console.log('✅ All configuration checks passed!');
  console.log('\n📱 You can now run: ./reset-env.sh');
  process.exit(0);
}
