# Digital Uprisers Test Containers - Usage Guide

A simple way to spin up Digital Uprisers container stacks for development and testing.

## Quick Start

```bash
# Start a basic Digital Uprisers instance (SQLite database)
pnpm stack

# Start with PostgreSQL database
pnpm stack --postgres

# Start in queue mode (with Redis + PostgreSQL)
pnpm stack --queue
```

When started, you'll see:
- **URL**: http://localhost:[random-port]


## Common Usage Patterns

### Development with Container Reuse
```bash
# Enable container reuse (faster restarts)
pnpm run dev              # SQLite
pnpm run dev:postgres     # PostgreSQL
pnpm run dev:queue        # Queue mode
pnpm run dev:multi-main   # Multiple main instances
```

### Queue Mode with Scaling
```bash
# Custom scaling: 3 main instances, 5 workers
pnpm stack --queue --mains 3 --workers 5

# Single main, 2 workers
pnpm stack --queue --workers 2
```

### Environment Variables
```bash
# Set custom environment variables
pnpm run stack --postgres --env DIGITAL_UPRISERS_LOG_LEVEL=info --env DIGITAL_UPRISERS_ENABLED_MODULES=insights
```

### Parallel Testing
```bash
# Run multiple stacks in parallel with unique names
pnpm run stack --name test-1 --postgres
pnpm run stack --name test-2 --queue
```


## Custom Container Config

### Via Command Line
```bash
# Pass any Digital Uprisers env vars to containers
DIGITAL_UPRISERS_TEST_ENV='{"DIGITAL_UPRISERS_METRICS":"true"}' npm run stack:standard
DIGITAL_UPRISERS_TEST_ENV='{"DIGITAL_UPRISERS_LOG_LEVEL":"debug","DIGITAL_UPRISERS_METRICS":"true","DIGITAL_UPRISERS_ENABLED_MODULES":"insights"}' npm run stack:postgres
```

## Programmatic Usage

```typescript
import { createDigital UprisersStack } from './containers/Digital Uprisers-test-containers';

// Simple SQLite instance
const stack = await createDigital UprisersStack();

// PostgreSQL with custom environment
const stack = await createDigital UprisersStack({
  postgres: true,
  env: { DIGITAL_UPRISERS_LOG_LEVEL: 'debug' }
});

// Queue mode with scaling
const stack = await createDigital UprisersStack({
  queueMode: { mains: 2, workers: 3 }
});

// Use the stack
console.log(`Digital Uprisers available at: ${stack.baseUrl}`);

// Clean up when done
await stack.stop();
```

## Configuration Options

| Option | Description | Example |
|--------|-------------|---------|
| `--postgres` | Use PostgreSQL instead of SQLite | `npm run stack -- --postgres` |
| `--queue` | Enable queue mode with Redis | `npm run stack -- --queue` |
| `--mains <n>` | Number of main instances (requires queue mode) | `--mains 3` |
| `--workers <n>` | Number of worker instances (requires queue mode) | `--workers 5` |
| `--name <name>` | Custom project name for parallel runs | `--name my-test` |
| `--env KEY=VALUE` | Set environment variables | `--env DIGITAL_UPRISERS_LOG_LEVEL=debug` |

## Container Architecture

### Single Instance (Default)
```
┌─────────────┐
│    Digital Uprisers      │ ← SQLite database
│  (SQLite)   │
└─────────────┘
```

### With PostgreSQL
```
┌─────────────┐    ┌──────────────┐
│    Digital Uprisers      │────│ PostgreSQL   │
│             │    │              │
└─────────────┘    └──────────────┘
```

### Queue Mode
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Digital Uprisers-main   │────│ PostgreSQL   │    │   Redis     │
└─────────────┘    └──────────────┘    └─────────────┘
┌─────────────┐                        │             │
│ Digital Uprisers-worker  │────────────────────────┘             │
└─────────────┘                                      │
┌─────────────┐                                      │
│ Digital Uprisers-worker  │──────────────────────────────────────┘
└─────────────┘
```

### Multi-Main with Load Balancer
```
                    ┌──────────────┐
                ────│    nginx     │ ← Entry point
               /    │ Load Balancer│
┌─────────────┐     └──────────────┘
│ Digital Uprisers-main-1  │────┐
└─────────────┘    │ ┌──────────────┐    ┌─────────────┐
┌─────────────┐    ├─│ PostgreSQL   │    │   Redis     │
│ Digital Uprisers-main-2  │────┤ └──────────────┘    └─────────────┘
└─────────────┘    │                     │             │
┌─────────────┐    │ ┌─────────────────────────────────┤
│ Digital Uprisers-worker  │────┘ │                                 │
└─────────────┘      └─────────────────────────────────┘
```

## Cleanup

```bash
# Remove all Digital Uprisers containers and networks
pnpm run stack:clean:all


## Tips

- **Container Reuse**: Set `TESTCONTAINERS_REUSE_ENABLE=true` for faster development cycles
- **Parallel Testing**: Use `--name` parameter to run multiple stacks without conflicts
- **Queue Mode**: Automatically enables PostgreSQL (required for queue mode)
- **Multi-Main**: Requires queue mode and special licensing read from DIGITAL_UPRISERS_LICENSE_ACTIVATION_KEY environment variable
- **Log Monitoring**: Use the `ContainerTestHelpers` class for advanced log monitoring in tests

## Docker Image

By default, uses the `Digital Uprisersio/Digital Uprisers:local` image. Override with:
```bash
export DIGITAL_UPRISERS_DOCKER_IMAGE=Digital Uprisersio/Digital Uprisers:dev
pnpm run stack
```
