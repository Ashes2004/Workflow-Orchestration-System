const { client } = require('../config/redis');

const LOCK_TTL_MS = 30000; // 30 seconds ownership


//  Attempts to acquire a lock for a specific execution.
//  Returns true if successful, false if locked by another worker.

const acquireLock = async (executionId) => {
    const key = `lock:execution:${executionId}`;
    const val = 'LOCKED';

    try {
        // SET key value NX (only if not exists) PX (expiry in ms)
        const result = await client.set(key, val, {
            NX: true,
            PX: LOCK_TTL_MS
        });
         // It Returns 'OK' if set, null if not
        return result === 'OK';
    } catch (error) {
        console.error(`Lock Error for ${executionId}:`, error);
        return false;
    }
};

const releaseLock = async (executionId) => {
    const key = `lock:execution:${executionId}`;
    try {
        await client.del(key);
    } catch (error) {
        console.error(`Unlock Error for ${executionId}:`, error);
    }
};

module.exports = { acquireLock, releaseLock };