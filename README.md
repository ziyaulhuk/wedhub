# WedHub — Ziyaul Weds Thaieba

Wedding invitation app for **Ziyaul Huk ♥ Thaieba Ashraf** (19 August 2018, Jamia Masjid, V Kalathur, Perambalur).

This is a modern rewrite of the original Ionic 3 / Cordova / Firebase app. All Firebase
dependencies have been removed — it is now a fully offline information app:

- **Home**: fireworks background with the git-themed invitation and action buttons
  (Contact → dialer, Directions → Google Maps, Share Invite → system share sheet)
- **Details**: invitation card, directions, and "Marriage in ISLAM" verses

The original project is preserved untouched in [`legacy/`](legacy/).

## Tech stack

| Piece      | Version | Notes                                        |
| ---------- | ------- | -------------------------------------------- |
| Node.js    | 20.19+  | tested on Node 26                            |
| Vite       | 8.x     | web build (vanilla TypeScript, no framework) |
| Capacitor  | 8.x     | Android packaging (replaces Cordova)         |
| JDK        | 21      | required by Capacitor 8 / AGP                |
| Android SDK| API 36  | compileSdk/targetSdk 36, minSdk 24           |

## Project layout

```
index.html            single-page app (home + details views)
src/main.ts           app logic (fireworks, actions, view switching)
src/style.css         styles (faithful to the original theme)
src/assets/           images + 1024px icon source
capacitor.config.ts   Capacitor config (appId com.ziyaul.wedhub)
android/              native Android project
android/key.properties release signing → ../REDACTED_KEYSTORE_FILE (original Play Store key)
legacy/               the original Ionic 3 / Cordova / Firebase app
```

## Build

One-time environment setup (already done on this machine):

- JDK 21 at `~/tools/jdk21`
- Android SDK at `~/android-sdk` (platform-tools, platforms;android-36, build-tools;36.0.0)

Build steps:

```bash
npm install
npm run build                 # web app → dist/
npx cap sync android          # copy dist into the Android project
cd android
JAVA_HOME=~/tools/jdk21 ANDROID_HOME=~/android-sdk ./gradlew bundleRelease assembleRelease
```

Outputs:

- `android/app/build/outputs/bundle/release/app-release.aab` → **upload this to Google Play**
- `android/app/build/outputs/apk/release/app-release.apk` → install on a device for testing

## Notes

- The old app's login/RSVP/calendar features depended on Firebase and were removed.
  Contact / Directions / Share all work offline via system intents.
- To change the phone number or maps destination, edit the constants at the top of `src/main.ts`.
