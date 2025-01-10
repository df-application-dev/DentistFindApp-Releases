const { app, BrowserWindow, screen, Menu, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const contextMenu = require("electron-context-menu");
const { autoUpdater } = require("electron-updater");

const path = require("path");
const url = require("url");
const nativeImage = require("electron").nativeImage;
contextMenu({
  showSaveImageAs: true,
});

const iconUrl = url.format({
  pathname: path.join(__dirname, "../public/icon.icns"),
  protocol: "file:",
  slashes: true,
});
const image = nativeImage.createFromPath(iconUrl);
function createWindow() {
  const gotTheLock = app.requestSingleInstanceLock();
  const { height } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    maxWidth: 471,
    width: 371,
    minWidth: 371,
    height: 804,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    x: 0,
    y: 0,
    icon: image,
    fullscreen: false,
    fullscreenable: false,
    resizable: true,
    autoHideMenuBar: true,
  });

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (win) {
        if (win.isMinimized()) win.restore();
        win.focus();
      }
    });

    win.loadURL(
      isDev
        ? "http://localhost:3001"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
  }

  // win.webContents.openDevTools();
  console.log(BrowserWindow.getAllWindows());

  autoUpdater.checkForUpdates(() => {
    //custom logic here for check updates and notify
  });

  autoUpdater.on("update-downloaded", async (info) => {
    // Prompt the user to install the update
    win.webContents.send("update-dom", {
      title: "Update Available",
      message: `A new update is available for installation. Would you like to restart the app to install the update?`,
      status: "update-downloaded",
    });

    autoUpdater.signals.updateDownloaded((update) => {
      autoUpdater.removeOldInstallers();
    });
    // autoUpdater.quitAndInstall(true, true);
  });

  autoUpdater.on("update-available", (info) => {
    console.log(`Update available. Current version ${app.getVersion()}`);
    autoUpdater.downloadUpdate();
  });

  autoUpdater.on("update-not-available", (info) => {
    console.log(`No update available. Current version ${app.getVersion()}`);
  });

  autoUpdater.on("error", (info) => {
    console.log("error event emmited");
    console.log(info);
  });

  ipcMain.on("trigger-download", (event, arg) => {
    autoUpdater.downloadUpdate();
    console.log(arg);
    win.webContents.send("update-dom", {
      title: "Downloading Update",
      message: `Now downloading the update..`,
      status: "update-downloading",
    });
  });

  ipcMain.on("trigger-install", (event, arg) => {
    console.log(arg);

    autoUpdater.quitAndInstall(true, true);
  });

  ipcMain.on("check-for-updates", (event, arg) => {
    console.log(arg);
    autoUpdater.checkForUpdates(() => {
      //custom logic here for check updates and notify
    });
  });

  ipcMain.on("maximize-window", (event, arg) => {
    win.setMaximumSize(0, 0);
    win.maximize();
  });

  ipcMain.on("unmaximize-window", (event, arg) => {
    win.setMaximumSize(471, 0);
    win.unmaximize();
    win.setSize(471, height);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can
