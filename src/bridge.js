import saveAs from "file-saver";
import { getBase64 } from "./utils";

export const isRunningCapacitor =
  window && window.Capacitor && window.Capacitor.isNative;
export const isRunningElectron =
  window && window.process && window.process.type;

const { ipcRenderer } = isRunningElectron ? window.require("electron") : {};

// Capacitor Filesystem is loaded dynamically when needed
let Filesystem;
if (isRunningCapacitor) {
  import("@capacitor/core").then(mod => {
    Filesystem = mod.Filesystem;
  });
}

export const reloadWindow = () =>
  isRunningElectron ? ipcRenderer.send("reload") : window.location.reload();
export const closeWindow = () => ipcRenderer.send("close");
export const resizeWindow = () => ipcRenderer.send("resize");
export const minimizeWindow = () => ipcRenderer.send("minimize");

export const saveFile = async (blob, filename) => {
  try {
    if (!isRunningCapacitor) {
      return {
        type: "download",
        download: () => {
          saveAs.saveAs(blob, filename);
        },
      };
    }
    await prepareDirectory("OmniaWrite");
    const result = await Filesystem.writeFile({
      path: `OmniaWrite/${filename}`,
      data: await getBase64(blob),
      directory: "DOCUMENTS",
    });
    return {
      type: "filesystem",
      uri: result.uri,
    };
  } catch (e) {
    throw Error("Unable to write file");
  }
};

const prepareDirectory = async name => {
  try {
    return await Filesystem.mkdir({
      path: name,
      directory: "DOCUMENTS",
      recursive: true,
    });
  } catch (error) {
    if (error.message == "Directory exists") {
      return false;
    }
    console.error(error);
  }
};
