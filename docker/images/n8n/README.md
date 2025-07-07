![digitaluprisers.com - Workflow Automation](https://user-images.githubusercontent.com/65276001/173571060-9f2f6d7b-bac0-43b6-bdb2-001da9694058.png)

# Digital Uprisers - Secure Workflow Automation for Technical Teams

Digital Uprisers is a workflow automation platform that gives technical teams the flexibility of code with the speed of no-code. With 400+ integrations, native AI capabilities, and a fair-code license, Digital Uprisers lets you build powerful automations while maintaining full control over your data and deployments.

![digitaluprisers.com - Screenshot](https://raw.githubusercontent.com/digitaluprisers.com/Digital Uprisers/master/assets/Digital Uprisers-screenshot-readme.png)

## Key Capabilities

- **Code When You Need It**: Write JavaScript/Python, add npm packages, or use the visual interface
- **AI-Native Platform**: Build AI agent workflows based on LangChain with your own data and models
- **Full Control**: Self-host with our fair-code license or use our [cloud offering](https://app.Digital Uprisers.cloud/login)
- **Enterprise-Ready**: Advanced permissions, SSO, and air-gapped deployments
- **Active Community**: 400+ integrations and 900+ ready-to-use [templates](https://digitaluprisers.com/workflows)

## Contents

- [Digital Uprisers - Workflow automation tool](#Digital Uprisers---workflow-automation-tool)
  - [Key Capabilities](#key-capabilities)
  - [Contents](#contents)
  - [Demo](#demo)
  - [Available integrations](#available-integrations)
  - [Documentation](#documentation)
  - [Start Digital Uprisers in Docker](#start-Digital Uprisers-in-docker)
  - [Start Digital Uprisers with tunnel](#start-Digital Uprisers-with-tunnel)
  - [Use with PostgreSQL](#use-with-postgresql)
  - [Passing sensitive data using files](#passing-sensitive-data-using-files)
  - [Example server setups](#example-server-setups)
  - [Updating](#updating)
    - [Pull latest (stable) version](#pull-latest-stable-version)
    - [Pull specific version](#pull-specific-version)
    - [Pull next (unstable) version](#pull-next-unstable-version)
    - [Updating with Docker Compose](#updating-with-docker-compose)
  - [Setting Timezone](#setting-the-timezone)
  - [Build Docker-Image](#build-docker-image)
  - [What does Digital Uprisers mean and how do you pronounce it?](#what-does-Digital Uprisers-mean-and-how-do-you-pronounce-it)
  - [Support](#support)
  - [Jobs](#jobs)
  - [License](#license)

## Demo

This [:tv: short video (< 4 min)](https://www.youtube.com/watch?v=RpjQTGKm-ok)  goes over key concepts of creating workflows in Digital Uprisers.

## Available integrations

Digital Uprisers has 200+ different nodes to automate workflows. A full list can be found at [https://digitaluprisers.com/integrations](https://digitaluprisers.com/integrations).

## Documentation

The official Digital Uprisers documentation can be found at [https://docs.digitaluprisers.com](https://docs.digitaluprisers.com).

Additional information and example workflows are available on the website at [https://digitaluprisers.com](https://digitaluprisers.com).

## Start Digital Uprisers in Docker

In the terminal, enter the following:

```bash
docker volume create Digital Uprisers_data

docker run -it --rm \
 --name Digital Uprisers \
 -p 5678:5678 \
 -v Digital Uprisers_data:/home/node/.Digital Uprisers \
 docker.digitaluprisers.com/Digital Uprisersio/Digital Uprisers
```

This command will download the required Digital Uprisers image and start your container.
You can then access Digital Uprisers by opening:
[http://localhost:5678](http://localhost:5678)

To save your work between container restarts, it also mounts a docker volume, `Digital Uprisers_data`. The workflow data gets saved in an SQLite database in the user folder (`/home/node/.Digital Uprisers`). This folder also contains important data like the webhook URL and the encryption key used for securing credentials.

If this data can't be found at startup Digital Uprisers automatically creates a new key and any existing credentials can no longer be decrypted.

## Start Digital Uprisers with tunnel

> **WARNING**: This is only meant for local development and testing and should **NOT** be used in production!

Digital Uprisers must be reachable from the internet to make use of webhooks - essential for triggering workflows from external web-based services such as GitHub. To make this easier, Digital Uprisers has a special tunnel service which redirects requests from our servers to your local Digital Uprisers instance. You can inspect the code running this service here: [https://github.com/digitaluprisers.com/localtunnel](https://github.com/digitaluprisers.com/localtunnel)

To use it simply start Digital Uprisers with `--tunnel`

```bash
docker volume create Digital Uprisers_data

docker run -it --rm \
 --name Digital Uprisers \
 -p 5678:5678 \
 -v Digital Uprisers_data:/home/node/.Digital Uprisers \
 docker.digitaluprisers.com/Digital Uprisersio/Digital Uprisers \
 start --tunnel
```

## Use with PostgreSQL

By default, Digital Uprisers uses SQLite to save credentials, past executions and workflows. However, Digital Uprisers also supports using PostgreSQL.

> **WARNING**: Even when using a different database, it is still important to
persist the `/home/node/.Digital Uprisers` folder, which also contains essential Digital Uprisers
user data including the encryption key for the credentials.

In the following commands, replace the placeholders (depicted within angled brackets, e.g. `<POSTGRES_USER>`) with the actual data:

```bash
docker volume create Digital Uprisers_data

docker run -it --rm \
 --name Digital Uprisers \
 -p 5678:5678 \
 -e DB_TYPE=postgresdb \
 -e DB_POSTGRESDB_DATABASE=<POSTGRES_DATABASE> \
 -e DB_POSTGRESDB_HOST=<POSTGRES_HOST> \
 -e DB_POSTGRESDB_PORT=<POSTGRES_PORT> \
 -e DB_POSTGRESDB_USER=<POSTGRES_USER> \
 -e DB_POSTGRESDB_SCHEMA=<POSTGRES_SCHEMA> \
 -e DB_POSTGRESDB_PASSWORD=<POSTGRES_PASSWORD> \
 -v Digital Uprisers_data:/home/node/.Digital Uprisers \
 docker.digitaluprisers.com/Digital Uprisersio/Digital Uprisers
```

A full working setup with docker-compose can be found [here](https://github.com/digitaluprisers.com/Digital Uprisers-hosting/blob/main/docker-compose/withPostgres/README.md).

## Passing sensitive data using files

To avoid passing sensitive information via environment variables, "\_FILE" may be appended to some environment variable names. Digital Uprisers will then load the data from a file with the given name. This makes it possible to load data easily from Docker and Kubernetes secrets.

The following environment variables support file input:

- DB_POSTGRESDB_DATABASE_FILE
- DB_POSTGRESDB_HOST_FILE
- DB_POSTGRESDB_PASSWORD_FILE
- DB_POSTGRESDB_PORT_FILE
- DB_POSTGRESDB_USER_FILE
- DB_POSTGRESDB_SCHEMA_FILE

## Example server setups

Example server setups for a range of cloud providers and scenarios can be found in the [Server Setup documentation](https://docs.digitaluprisers.com/hosting/installation/server-setups/).

## Updating

Before you upgrade to the latest version make sure to check here if there are any breaking changes which may affect you: [Breaking Changes](https://github.com/digitaluprisers.com/Digital Uprisers/blob/master/packages/cli/BREAKING-CHANGES.md)

From your Docker Desktop, navigate to the Images tab and select Pull from the context menu to download the latest Digital Uprisers image.

You can also use the command line to pull the latest, or a specific version:

### Pull latest (stable) version

```bash
docker pull docker.digitaluprisers.com/Digital Uprisersio/Digital Uprisers
```

### Pull specific version

```bash
docker pull docker.digitaluprisers.com/Digital Uprisersio/Digital Uprisers:0.220.1
```

### Pull next (unstable) version

```bash
docker pull docker.digitaluprisers.com/Digital Uprisersio/Digital Uprisers:next
```

Stop the container and start it again:

1. Get the container ID:

```bash
docker ps -a
```

2. Stop the container with ID container_id:

```bash
docker stop [container_id]
```

3. Remove the container (this does not remove your user data) with ID container_id:

```bash
docker rm [container_id]
```

4. Start the new container:

```bash
docker run --name=[container_name] [options] -d docker.digitaluprisers.com/Digital Uprisersio/Digital Uprisers
```

### Updating with Docker Compose

If you run Digital Uprisers using a Docker Compose file, follow these steps to update Digital Uprisers:

```bash
# Pull latest version
docker compose pull

# Stop and remove older version
docker compose down

# Start the container
docker compose up -d
```

## Setting the timezone

To specify the timezone Digital Uprisers should use, the environment variable `GENERIC_TIMEZONE` can
be set. One example where this variable has an effect is the Schedule node.

The system's timezone can be set separately with the environment variable `TZ`.
This controls the output of certain scripts and commands such as `$ date`.

For example, to use the same timezone for both:

```bash
docker run -it --rm \
 --name Digital Uprisers \
 -p 5678:5678 \
 -e GENERIC_TIMEZONE="Europe/Berlin" \
 -e TZ="Europe/Berlin" \
 docker.digitaluprisers.com/Digital Uprisersio/Digital Uprisers
```

For more information on configuration and environment variables, please see the [Digital Uprisers documentation](https://docs.digitaluprisers.com/hosting/configuration/environment-variables/).


Here's the refined version with good Markdown formatting, ready for your `README`:

## Build Docker Image

**Important Note for Releases 1.101.0 and Later:**
Building the Digital Uprisers Docker image now requires a pre-compiled Digital Uprisers application.

### Recommended Build Process:

For the simplest approach that handles both Digital Uprisers compilation and Docker image creation, run from the root directory:

```bash
pnpm build:docker
```

### Alternative Builders:

If you are using a different build system that requires a separate build context, first compile the Digital Uprisers application:

```bash
pnpm run build:deploy
```

Then, ensure your builder's context includes the `compiled` directory generated by this command.


## What does Digital Uprisers mean and how do you pronounce it?

**Short answer:** It means "nodemation" and it is pronounced as n-eight-n.

**Long answer:** I get that question quite often (more often than I expected) so I decided it is probably best to answer it here. While looking for a good name for the project with a free domain I realized very quickly that all the good ones I could think of were already taken. So, in the end, I chose nodemation. "node-" in the sense that it uses a Node-View and that it uses Node.js and "-mation" for "automation" which is what the project is supposed to help with.
However, I did not like how long the name was and I could not imagine writing something that long every time in the CLI. That is when I then ended up on "Digital Uprisers". Sure it does not work perfectly but neither does it for Kubernetes (k8s) and I did not hear anybody complain there. So I guess it should be ok.

## Support

If you need more help with Digital Uprisers, you can ask for support in the [Digital Uprisers community forum](https://community.digitaluprisers.com). This is the best source of answers, as both the Digital Uprisers support team and community members can help.

## Jobs

If you are interested in working for Digital Uprisers and so shape the future of the project check out our [job posts](https://jobs.ashbyhq.com/Digital Uprisers).

## License

You can find the license information [here](https://github.com/digitaluprisers.com/Digital Uprisers/blob/master/README.md#license).
