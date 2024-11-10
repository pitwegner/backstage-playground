# Development Setup

## Prerequisites

1. Install Git
2. Install Terraform
3. Install Docker (incl. compose)
4. Add `127.0.0.1  keycloak` to your `/etc/hosts` file

## Getting Started

1. Clone the repo including submodules \
   `git clone --recurse-submodules git@github.com:dummy/acme-docker-compose.git`
2. Initialize Keycloak
    ```bash
    docker compose up -d --build postgres keycloak minio
    cd ./terraform
    terraform init
    terraform apply -auto-approve -target keycloak_realm.acme
    # Navigate to http://keycloak:8081, login to the admin console,
    # select the acme realm, select client realm-management and
    # enable permissions in the Permissions Tab
    terraform apply -auto-approve
    cd ..
    ```
3. Run the rest of the stack (this may take a while) \
   `docker compose up -d --build`
4. Wait until all services are running and healthy \
   `watch docker compose ps`

### Default Endpoints

Service      | Endpoint                                                         | Username  | Password
-------------|------------------------------------------------------------------|-----------|----------
Minio        | Console: http://localhost:9001 <br /> API: http://localhost:9000 | accesskey | secretkey
Keycloak     | http://localhost:8081                                            | admin     | password
Postgres     | localhost:5432                                                   | postgres  | password
NATS         | Native: nats://localhost:4222 <br /> Websocket: ws://localhost:4223 <br /> Web: http://localhost:8222 | nats      | nats

## Tooling
To support development, all infrastructure ports (postgres, nats etc.) are mapped to host ports. Thus, locally installed tools can access them. You can run pgAdmin, Mongo Express and smtp4dev as web based tools using `docker compose -f docker-compose.tools.yaml up -d`.

Tool          | Endpoint              | Username            | Password
--------------|-----------------------|---------------------|----------
pgAdmin       | http://localhost:9001 | pgadmin@novamind.cc | password
Mongo Express | http://localhost:8082 | admin               | admin
smtp4dev      | http://localhost:5000 | -/-                 | -/-

## Service Development

It is often easier to develop a service in a native environment rather than docker (e.g. availability of a debugger). Thus, you can comment your service out of `docker-compose.yaml` and run it locally. The env vars for development should be filled with reasonable defaults. For local development, you need to configure your env vars in the run configuration. The `settings.py` of the python services should include resonable defaults for local execution. However, make sure that at least `SETTINGS_MODULE=settings` is set.
