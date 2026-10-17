import Fireworks from 'fireworks-canvas';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import './style.css';

const PHONE_NUMBER = '04328-251244';
// Home page "Directions" button: search for the venue (existing behavior).
const MAPS_QUERY = 'Jamia Masjid, V Kalathur, Perambalur';
const MAPS_HOME_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
// Details screen "click here": deep link to the exact place on Google Maps.
const MAPS_PLACE_URL =
  'https://www.google.com/maps/place/Thirumandurai+Toll+Plaza/@11.3977011,78.991538,17.25z/data=!4m14!1m7!3m6!1s0x3bab16ab5d87423f:0x93bade66f788f789!2sjamia+masjid,+v+kalathur!8m2!3d11.4003856!4d78.9302402!16s%2Fg%2F11cm_8tg74!3m5!1s0x3bab166d8edad06f:0x5e936f8b2b7a0519!8m2!3d11.3968776!4d78.9935508!16s%2Fg%2F11c1nrfkl8?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ziyaul.wedhub';
const GITHUB_REPO_URL = 'https://github.com/ziyaulhuk/wedhub';
const SHARE_TEXT =
  'Ziyaul Weds Thaieba\nYou are invited. Consider this as Our Personal Invite.\nRequest Your Esteemed Presence on Our Wedding Day.';

// ---------------------------------------------------------------------------
// Fireworks background (home view)
// ---------------------------------------------------------------------------
let fireworksInstance: InstanceType<typeof Fireworks> | null = null;

function startFireworks(): void {
  const container = document.getElementById('canvas-container');
  if (!container) return;
  // Wait a frame so the container has its final size before the canvas is created.
  requestAnimationFrame(() => {
    fireworksInstance = new Fireworks(container, {
      maxRockets: 18,
      rocketSpawnInterval: 250,
      numParticles: 60,
      // NOTE: explosionMinHeight/MaxHeight are FRACTIONS of the canvas height (0-1),
      // and explosionChance is a probability fraction - not pixels.
      explosionMinHeight: 0.2,
      explosionMaxHeight: 0.9,
      // Low per-frame chance so rockets travel most of the sky before bursting,
      // spreading explosions from the bottom up to the top text lines.
      explosionChance: 0.01
    });
    // The constructor does NOT auto-start - start() kicks off the spawn interval
    // and the animation loop (see fireworks-canvas README).
    fireworksInstance.start();
  });
  // Keep the canvas buffer in sync with the viewport on rotation / resize so
  // the fireworks stay crisp on every screen size and orientation.
  window.addEventListener('resize', () => fireworksInstance?.resetSize());
}

// ---------------------------------------------------------------------------
// Toast helper (used for share fallbacks)
// ---------------------------------------------------------------------------
let toastTimer: number | undefined;
function showToast(message: string): void {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.add('hidden'), 2500);
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
function openContact(): void {
  // tel: scheme is intercepted by the Android system and opens the dialer.
  window.location.href = `tel:${PHONE_NUMBER}`;
}

async function openMaps(mapsUrl: string): Promise<void> {
  try {
    // Open in the external browser / maps app (not inside the WebView).
    await Browser.open({ url: mapsUrl });
  } catch {
    window.open(mapsUrl, '_system');
  }
}

async function shareInvite(): Promise<void> {
  const data = { title: 'Download Invite App', text: SHARE_TEXT, url: PLAY_STORE_URL };
  if (navigator.share) {
    try {
      await navigator.share(data);
      return;
    } catch (err) {
      // User cancelled the share sheet - that's fine.
      if ((err as DOMException)?.name === 'AbortError') return;
      // Fall through to clipboard fallback.
    }
  }
  try {
    await navigator.clipboard.writeText(`${SHARE_TEXT}\n${PLAY_STORE_URL}`);
    showToast('Invite copied to clipboard');
  } catch {
    window.prompt('Copy this invite:', `${SHARE_TEXT}\n${PLAY_STORE_URL}`);
  }
}

// ---------------------------------------------------------------------------
// Simple hash-based view switching (keeps the Android back button working)
// ---------------------------------------------------------------------------
const homeView = document.getElementById('view-home') as HTMLElement;
const detailsView = document.getElementById('view-details') as HTMLElement;
const storyView = document.getElementById('view-story') as HTMLElement;

function showView(name: 'home' | 'details' | 'story'): void {
  const views: Record<string, HTMLElement> = { home: homeView, details: detailsView, story: storyView };
  for (const [id, view] of Object.entries(views)) {
    view.classList.toggle('hidden', id !== name);
  }
}

function onHashChange(): void {
  if (window.location.hash === '#/details') showView('details');
  else if (window.location.hash === '#/story') showView('story');
  else showView('home');
}

// ---------------------------------------------------------------------------
// Wire everything up
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  startFireworks();

  document.getElementById('btn-details')?.addEventListener('click', () => {
    window.location.hash = '#/details';
  });
  document.getElementById('btn-contact')?.addEventListener('click', openContact);
  document.getElementById('btn-directions')?.addEventListener('click', () => void openMaps(MAPS_HOME_URL));
  document.getElementById('btn-share')?.addEventListener('click', () => void shareInvite());
  document.getElementById('btn-back')?.addEventListener('click', () => {
    window.location.hash = '#/';
  });
  document.getElementById('btn-back-story')?.addEventListener('click', () => {
    window.history.back();
  });
  document.getElementById('link-github')?.addEventListener('click', (e) => {
    e.preventDefault();
    void openMaps(GITHUB_REPO_URL);
  });
  document.getElementById('link-map')?.addEventListener('click', (e) => {
    e.preventDefault();
    void openMaps(MAPS_PLACE_URL);
  });

  // Android hardware back button: details -> home, story -> details; only on the
  // home screen does back exit the app.
  if (Capacitor.isNativePlatform()) {
    void App.addListener('backButton', () => {
      if (window.location.hash === '#/' || window.location.hash === '') {
        void App.exitApp();
      } else {
        window.history.back();
      }
    });
  }

  const versionEl = document.getElementById('app-version');
  if (versionEl) versionEl.textContent = `Version ${import.meta.env.MODE === 'production' ? '1.0.4' : 'dev'}`;

  window.addEventListener('hashchange', onHashChange);
  onHashChange();
});
