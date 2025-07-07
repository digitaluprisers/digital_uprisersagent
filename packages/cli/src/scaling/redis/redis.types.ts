export type RedisClientType = Digital UprisersRedisClientType | BullRedisClientType;

/**
 * Redis client used by Digital Uprisers.
 *
 * - `subscriber(Digital Uprisers)` to listen for messages from scaling mode pubsub channels
 * - `publisher(Digital Uprisers)` to send messages into scaling mode pubsub channels
 * - `cache(Digital Uprisers)` for caching operations (variables, resource ownership, etc.)
 */
type Digital UprisersRedisClientType = 'subscriber(Digital Uprisers)' | 'publisher(Digital Uprisers)' | 'cache(Digital Uprisers)';

/**
 * Redis client used internally by Bull. Suffixed with `(bull)` at `ScalingService.setupQueue`.
 *
 * - `subscriber(bull)` for event listening
 * - `client(bull)` for general queue operations
 * - `bclient(bull)` for blocking operations when processing jobs
 */
type BullRedisClientType = 'subscriber(bull)' | 'client(bull)' | 'bclient(bull)';
