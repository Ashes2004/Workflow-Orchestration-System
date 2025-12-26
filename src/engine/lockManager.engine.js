const {client} = require("../config/redis");

class LockManager {
  static async acquire(key, ttlSeconds = 30) {
    const res = await client.set(
      key,
      "LOCKED",
      { NX: true, EX: ttlSeconds }
    );
    return res === "OK";
  }

  static async release(key) {
    await client.del(key);
  }
}

module.exports = LockManager;
