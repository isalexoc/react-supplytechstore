export const checkIFstandAlone = () => {
  const fromApp = window.matchMedia("(display-mode: standalone)").matches;
  if (fromApp) {
    return true;
  } else {
    return false;
  }
};
