const path = require("path");

const { app, BrowserWindow, session } = require("electron");
const { init } = require("@sentry/electron");

const { transport } = require("./transport");

init({
  dsn: "https://64cf7b47cd694330b1b42fdd71e50d31@o51950.ingest.sentry.io/1323989",
  debug: true,
  release: "some-release",
  autoSessionTracking: false,
  transport,
  onFatalError: () => {},
});

app.on("ready", () => {
  // Add the Document-Policy header to all requests so profiling works
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Document-Policy": "js-profiling",
      },
    });
  });

  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.webContents.openDevTools({ mode: "detach" });

  // Pass through console messages from the renderer to easier debugging
  mainWindow.webContents.on(
    "console-message",
    (event, level, message, line, sourceId) => {
      console.log(`[Renderer] ${message}`);
    }
  );

  mainWindow.loadFile(path.join(__dirname, "index.html"));
});
