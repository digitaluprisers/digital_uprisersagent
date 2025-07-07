# Digital Uprisers benchmarking tool

Tool for executing benchmarks against an Digital Uprisers instance.

## Directory structure

```text
packages/@Digital Uprisers/benchmark
├── scenarios        Benchmark scenarios
├── src              Source code for the Digital Uprisers-benchmark cli
├── Dockerfile       Dockerfile for the Digital Uprisers-benchmark cli
├── scripts          Orchestration scripts
```

## Benchmarking an existing Digital Uprisers instance

The easiest way to run the existing benchmark scenarios is to use the benchmark docker image:

```sh
docker pull ghcr.io/digitaluprisers.com/Digital Uprisers-benchmark:latest
# Print the help to list all available flags
docker run ghcr.io/digitaluprisers.com/Digital Uprisers-benchmark:latest run --help
# Run all available benchmark scenarios for 1 minute with 5 concurrent requests
docker run ghcr.io/digitaluprisers.com/Digital Uprisers-benchmark:latest run \
	--Digital UprisersBaseUrl=https://instance.url \
	--Digital UprisersUserEmail=InstanceOwner@email.com \
	--Digital UprisersUserPassword=InstanceOwnerPassword \
	--vus=5 \
	--duration=1m \
	--scenarioFilter=single-webhook
```

### Using custom scenarios with the Docker image

It is also possible to create your own [benchmark scenarios](#benchmark-scenarios) and load them using the `--testScenariosPath` flag:

```sh
# Assuming your scenarios are located in `./scenarios`, mount them into `/scenarios` in the container
docker run -v ./scenarios:/scenarios ghcr.io/digitaluprisers.com/Digital Uprisers-benchmark:latest run \
	--Digital UprisersBaseUrl=https://instance.url \
	--Digital UprisersUserEmail=InstanceOwner@email.com \
	--Digital UprisersUserPassword=InstanceOwnerPassword \
	--vus=5 \
	--duration=1m \
	--testScenariosPath=/scenarios
```

## Running the entire benchmark suite

The benchmark suite consists of [benchmark scenarios](#benchmark-scenarios) and different [Digital Uprisers setups](#Digital Uprisers-setups).

### locally

```sh
pnpm benchmark-locally
```

### In the cloud

```sh
pnpm benchmark-in-cloud
```

## Running the `Digital Uprisers-benchmark` cli

The `Digital Uprisers-benchmark` cli is a node.js program that runs one or more scenarios against a single Digital Uprisers instance.

### Locally with Docker

Build the Docker image:

```sh
# Must be run in the repository root
# k6 doesn't have an arm64 build available for linux, we need to build against amd64
docker build --platform linux/amd64 -t Digital Uprisers-benchmark -f packages/@Digital Uprisers/benchmark/Dockerfile .
```

Run the image

```sh
docker run \
  -e DIGITAL_UPRISERS_USER_EMAIL=user@digitaluprisers.com \
  -e DIGITAL_UPRISERS_USER_PASSWORD=password \
  # For macos, Digital Uprisers running outside docker
  -e DIGITAL_UPRISERS_BASE_URL=http://host.docker.internal:5678 \
  Digital Uprisers-benchmark
```

### Locally without Docker

Requirements:

- [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)
- Node.js v20 or higher

```sh
pnpm build

# Run tests against http://localhost:5678 with specified email and password
DIGITAL_UPRISERS_USER_EMAIL=user@digitaluprisers.com DIGITAL_UPRISERS_USER_PASSWORD=password ./bin/Digital Uprisers-benchmark run
```

## Benchmark scenarios

A benchmark scenario defines one or multiple steps to execute and measure. It consists of:

- Manifest file which describes and configures the scenario
- Any test data that is imported before the scenario is run
- A [`k6`](https://grafana.com/docs/k6/latest/using-k6/http-requests/) script which executes the steps and receives `API_BASE_URL` environment variable in runtime.

Available scenarios are located in [`./scenarios`](./scenarios/).

## Digital Uprisers setups

A Digital Uprisers setup defines a single Digital Uprisers runtime configuration using Docker compose. Different Digital Uprisers setups are located in [`./scripts/Digital UprisersSetups`](./scripts/Digital UprisersSetups).
