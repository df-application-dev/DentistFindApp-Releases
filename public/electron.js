const { app, BrowserWindow, screen, Menu, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const contextMenu = require("electron-context-menu");

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
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
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

    // Create myWindow, load the rest of the app, etc...
    // app.on("ready", () => {});

    win.loadURL(
      isDev
        ? "http://localhost:3001"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
  }

  // win.webContents.openDevTools();
  console.log(BrowserWindow.getAllWindows());

  ipcMain.on("maximize-window", (event, arg) => {
    win.setMaximumSize(0, 0);
    // if (win.isMaximized()) {
    //   win.unmaximize();
    // } else win.maximize();

    win.maximize();
  });

  ipcMain.on("unmaximize-window", (event, arg) => {
    win.setMaximumSize(471, 0);
    win.unmaximize();
    win.setSize(471, height);
  });

  // win.on("will-resize", (event, newBounds) => {
  //   if (newBounds.width > 471) {
  //     event.preventDefault();
  //     win.setSize(471, newBounds.height);
  //   }

  //   win.setSize(newBounds.width, height);
  // });
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
