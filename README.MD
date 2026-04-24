# Traya

---

![Meteor](https://img.shields.io/badge/Meteor-JavaScript-EA4335?style=for-the-badge&logo=meteor&logoColor=white)
![Framework](https://img.shields.io/badge/Framework-Meteor_JS-1B3C8C?style=for-the-badge)
![Module](https://img.shields.io/badge/Module-Ateneo_Alumni_Document_Request_System-2E5AAC?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Offline_Ready-1f6feb?style=for-the-badge)


The Ateneo Alumni Document Request System is a web-based document request platform designed for alumni and staff. It allows users to request university documents, schedule appointments, review request details, and track request progress through a guided interface.

This project was developed using Meteor JS and follows the provided UI screenshots and navigation flow for both Alumni and Staff modules.

## Installation

This repository is built using the Meteor JS framework. To run this project on another computer, make sure the required tools are installed first, then follow the setup steps below.

To open this project you need to install and set up Meteor JS:

1. Install Node.js  
   Download and install Node.js from: https://nodejs.org/

2. Install Meteor JS  
   Follow the official installation guide: https://docs.meteor.com/about/install.html

3. Clone or download this repository  
   If using Git:
   ```bash
   git clone https://github.com/biancatraya28/firstattempt2026_Traya.git

4. Open the project folder
    ```bash
    cd ateneo-alumni-document-request-system

5. Install Project Dependencies
    ```bash
    cd ateneo-alumni-document-request-system

6. Run the application
    ```bash
    meteor run

7. Open the application in your browser

    Visit:
         http://localhost:3000

## Progressive Web Application (PWA) features
This project was converted into a Progressive Web App with the following features:

- Web app manifest with Ateneo branding
- Service worker registration
- Offline caching for core assets
- Offline fallback support
- Installability through supported browsers
- App icons for home screen / installed app mode

### Important PWA Files
```
public/manifest.json
```
- Defines the app name, colors, icons, and installable behavior.
```
public/service-worker.js
```
- Handles caching and offline support.
```
public/offline.html
```
- Fallback page for offline navigation.

```
public/icons/icon-192.png
```
- App icon for install prompts and mobile devices.

```
public/icons/icon-512.png
```
- Larger icon for app installation.

```
public/icons/icon-maskable-512.png
```
- Maskable icon for Android home screen compatibility.

```
client/main.html
```
- Links the manifest and theme color.

```
client/main.js
```
- Registers the service worker.

## AI Tool Used
- ChatGPT
- Codex

## AI Prompt
```
[Attached a screenchot of all the screen with and arrow to show the flow]

Build a web app called the Ateneo Alumni Document Request System using Meteor JS. Recreate the provided screenshots and flow exactly as possible. Use Meteor for UI. You can use any CSS so that it can fit the layout of the screenshots. Do not redesign. Do not change the flow, layout, navigation, or buttons. Match the screenshot clearly and exactly as possible.
```


### MASTER PROMPT FOR PWA:
```
I have a Meteor project. 
Help me convert it into a Progressive Web App (PWA).

Guide me step-by-step to:
1. Create a manifest.json with custom branding
2. Add a service worker
3. Implement caching so the app works offline
4. Register the service worker properly
5. Ensure installability (Add to Home Screen)

Explain what each step does and show exact code.
```
## Hallucinations / Errors Fixed Manually
- The AI suggested icon files that did not yet exist, so the required PNG icons had to be created and added manually.
- The browser DevTools menu used Request conditions instead of Network conditions, so offline testing had to be adjusted based on the browser version.
- The install icon did not always appear immediately in the address bar, so installability was also verified through the browser menu and DevTools Manifest panel.



## Screenshots
![Login Screen](/screenshots/image1.png)
![Alumni Dashboard](./screenshots/alumni-dashboard.png)
![Staff Dashboard](./screenshots/staff-dashboard.png)
