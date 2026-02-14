
import { LRUCache } from 'lru-cache';

// Rate limit map
const tokenCache = new LRUCache<string, number[]>({
    max: 500,
    ttl: 60 * 1000, // 1 minute
});

export async function rateLimit(token: string, limit: number = 60) {
    const now = Date.now();
    const windowStart = now - 60 * 1000;

    const tokenCount = tokenCache.get(token) || [];
    const recentRequests = tokenCount.filter((time) => time > windowStart);

    if (recentRequests.length >= limit) {
        return { success: false, limit, remaining: 0 };
    }

    recentRequests.push(now);
    tokenCache.set(token, recentRequests);

    return {
        success: true,
        limit,
        remaining: limit - recentRequests.length
    };
}
