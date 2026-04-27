import { Meteor } from 'meteor/meteor';
import './main.css';
import { mountApp } from '../imports/ui/app';

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });
    console.log('Service worker registered:', registration.scope);
  } catch (error) {
    console.error('Service worker registration failed:', error);
  }
}

Meteor.startup(async () => {
  await registerServiceWorker();
  mountApp(document.getElementById('app'));
});
