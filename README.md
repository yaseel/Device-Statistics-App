# Device Statistics App

A lightweight, cross‑platform desktop utility that shows your machine’s CPU, RAM and storage usage in real time — plus
static device info.

## Download

- **Windows (x64)**: [Download `.exe`](https://github.com/yaseel/Device-Statistics-App/releases/download/v1.0.0/Device.Statistics-Windows-1.0.0-Setup.exe)
- **macOS**: [Download `.dmg`](https://github.com/yaseel/Device-Statistics-App/releases/download/v1.0.0/Device.Statistics-Mac-1.0.0-Installer.dmg)

## Features

- **Live charts** for CPU, RAM & storage usage
- **Static device info** (CPU model, total memory, total storage)
- **Secure typesafe IPC** between Renderer & Frontend via Electron’s Context Bridge
- Other features: hide-to-tray functionality, custom menu-bar

## Tech Stack

- **Electron** — desktop container
- **React + TypeScript**
- **Vite** — bundler & dev server

## Local Development

1. Clone the repo
2. `npm install`
3. `npm run dev`  — launches Electron + Vite with HMR
4. `npm run build`  — outputs installer packages in `release/`
