function shouldCheckRepositoryVersion(lastCheckedAt) {
  if (!lastCheckedAt) {
    return true;
  }

  const SIX_HOURS = 6 * 60 * 60 * 1000;

  return Date.now() - new Date(lastCheckedAt).getTime() >= SIX_HOURS;
}

module.exports = {
  shouldCheckRepositoryVersion,
};
