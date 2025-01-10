import React, { useEffect, useState } from "react";
import Modal from "./Modal";
const ipcRenderer = window?.ipcRenderer;
// List of statuses
// * update-available
// * update-downloaded
// * update-downloading
// * update-installing
// * update-not-available
const intitialValue = {
  message: "",
  status: "",
  title: "",

  // title: "New Version Available",
  // message: ` `,
  // status: "update-available",
  // currentVersion: "8.8.8",
  // latestVersion: "9.9.9",
  // title: "Download Complete",
  // message: `Update has finished downloading. App will now restart to install the update.`,
  // status: "update-downloaded",
};
function AutoUpdater() {
  const [state, setState] = useState(intitialValue);
  const [open, setOpen] = useState(false);

  const handleCancel = () => {
    setOpen(false);
    setState(intitialValue);
  };

  useEffect(() => {
    ipcRenderer?.on("update-dom", (event) => {
      if (
        // event.status === "update-available" ||
        event.status === "update-downloaded"
        // event.status === "update-downloading"
      ) {
        setState({ ...event });
        setOpen(true);
        // if (event.status === "update-downloading") {
        //   func();
        // }
        return;
      }
    });
  }, [state]);

  const handleConfirm = () => {
    setOpen(false);
    ipcRenderer?.send("trigger-install", "Trigger download event recieved");
    return;
  };

  const dialogContent = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        A new update is available for installation.
        <br />
        <br />
        Do you want to restart the app now to install the update?
      </div>
    );
  };

  const buttonStyle = {
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    borderRadius: "0.25rem",
    fontWeight: 700,
    color: "#ffffff",
    appearance: "none",
    cursor: "pointer",
    ":hover": { backgroundColor: "#1D4ED8" },
    border: "none",
  };
  return (
    <div>
      {/* {state.status === "update-downloading" && !open && (
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            background: "black",
          }}
        >
          <LinearProgress style={{ height: 5 }} />
        </Box>
      )} */}

      <Modal isOpen={open} onClose={() => handleCancel()}>
        <h3>{state.title}</h3>
        <br />

        <>{dialogContent()}</>

        {state.status === "update-downloaded" && (
          <div
            style={{
              display: "flex",
              marginTop: "0.75rem",
              marginBottom: "0.75rem",
              columnGap: "0.75rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              style={{
                ...buttonStyle,
                backgroundColor: "white",
                color: "black",
              }}
              onClick={() => handleCancel()}
              color="default"
            >
              Restart Later
            </button>

            <button
              style={{ ...buttonStyle, backgroundColor: "#08ac8c" }}
              onClick={() => handleConfirm()}
              color="primary"
            >
              Yes
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AutoUpdater;
