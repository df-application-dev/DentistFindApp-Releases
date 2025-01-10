import "./App.css";
import { useEffect, useRef } from "react";
import AutoUpdater from "./AutoUpdater";
const ipcRenderer = window?.ipcRenderer;

const URL = {
  staging: "https://pwa.dentistfind.com",
  production: "https://mobile.dentistfind.com",
  localhost: "http://localhost:3000",
};
const mode = "production";
function App() {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Listen for messages from the iframe
    window.addEventListener("message", (event) => {
      if (event.origin !== URL[mode]) return; // Ensure this matches the iframe URL
      console.log("Message received from iframe:", event.data);
      ipcRenderer?.send(event.data);
      // Relay the message to the main process
    });
    ipcRenderer?.send("unmaximize-window");
  }, []);

  return (
    <div style={{ height: "100vh", overflowY: "hidden" }}>
      <AutoUpdater />
      <iframe
        ref={iframeRef}
        style={{ borderWidth: 0, overflowY: "hidden", borderImageWidth: 0 }}
        title="test"
        height={"100%"}
        width="100%"
        src={URL[mode]}
      ></iframe>
    </div>
  );
}

export default App;
