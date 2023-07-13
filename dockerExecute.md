# Make sure your docker is running

## Easier way to run the project (more lag while building both server images at the same time) (containers get stopped automatically on ctrl+q/command+q)

`docker-compose build` to automatically build server and client images
`docker-compose up` to first start the server and then the client containers
`ctrl+q` to stop the containers (but not delete, also the images don't get deleted, refer below if you wish to delete the images and containers)

## Harder way to run the project (more controlled build === less lag) (must stop the containers manually)

`docker build -t social-network_server .` to build the server image
`docker run -dp 127.0.0.1:8080:8080 social-network_server` to run the server container from previously built image

`docker build -t social-network_client .` to build the client image
`docker run -dp 127.0.0.1:3000:3000 social-network_client` to run the client container from previously built image

## To check for running containers manually

`docker ps` to see all (running) containers (use this to find the container ids from the first column and copy the ids to the next command)
(`docker ps -a` for list of all containers (even stopped ones))
(`docker ps -a -q` for a list of all containers (even stopped ones), showing only the ids)

## To stop the containers
`docker stop id1 id2` to stop docker containers (replace `id1` and `id2` with suitable ids from the `docker ps` command)

## To delete the containers
`docker rm id1 id2` to delete docker containers (replace `id1` and `id2` with suitable ids from the `docker ps` command)

## To delete the images
`docker images -a` to see all currently built images on your machine
`docker rmi id1 id2` to delete closed docker images (replace `id1` and `id2` with suitable ids from `docker images -a` command)