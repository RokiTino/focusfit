#!/bin/bash

# FocusFit Environment Reset Script
# This script completely resets the development environment to ensure
# all Firebase configuration changes take effect

echo "🔄 Starting FocusFit Environment Reset..."
echo ""

# Step 1: Kill all running Expo/Metro processes
echo "1️⃣ Stopping all running Expo/Metro processes..."
pkill -f "expo" || true
pkill -f "metro" || true
pkill -f "react-native" || true
sleep 2

# Step 2: Clear Metro bundler cache
echo "2️⃣ Clearing Metro bundler cache..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/react-*

# Step 3: Clear watchman (if installed)
echo "3️⃣ Clearing Watchman cache..."
if command -v watchman &> /dev/null; then
    watchman watch-del-all
    echo "   ✓ Watchman cache cleared"
else
    echo "   ⊘ Watchman not installed (skipping)"
fi

# Step 4: Clear iOS build cache (if iOS directory exists)
if [ -d "ios" ]; then
    echo "4️⃣ Clearing iOS build cache..."
    rm -rf ios/build
    rm -rf ios/Pods
    cd ios && pod install && cd ..
    echo "   ✓ iOS cache cleared and pods reinstalled"
else
    echo "4️⃣ No iOS directory found (skipping)"
fi

# Step 5: Clear Android build cache (if Android directory exists)
if [ -d "android" ]; then
    echo "5️⃣ Clearing Android build cache..."
    cd android
    ./gradlew clean || true
    rm -rf .gradle
    rm -rf build
    rm -rf app/build
    cd ..
    echo "   ✓ Android cache cleared"
else
    echo "5️⃣ No Android directory found (skipping)"
fi

echo ""
echo "✅ Environment reset complete!"
echo ""
echo "📱 Next steps:"
echo "   1. Start the dev server: npx expo start --clear"
echo "   2. Choose your platform (iOS/Android)"
echo "   3. Wait for the bundle to complete"
echo "   4. Test Firebase authentication"
echo ""
echo "🔍 What to look for:"
echo "   ✓ '[Firebase] ✓ Configuration loaded successfully'"
echo "   ✓ '[Firebase] ✓ Project: focusefit'"
echo "   ✓ '[Auth] ✓ Google Sign-In configured with Web Client ID'"
echo ""
