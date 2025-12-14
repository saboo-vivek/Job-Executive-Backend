exports.isValidGoogleDriveUrl = (url) => {
  if (!url) return false;

  const driveRegex =
    /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view(\?usp=sharing)?$/;

  return driveRegex.test(url);
};
