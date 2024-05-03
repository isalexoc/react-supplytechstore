export function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUserAgent =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
      userAgent
    );
  const isMobileScreen = window.innerWidth <= 768;

  return isMobileUserAgent || isMobileScreen;
}
