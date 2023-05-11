function getEnvOrFail(key) {
  const env = process.env[key];
  if (!env) throw "Missing environment variable " + key;
  return env;
}

module.exports = getEnvOrFail;
