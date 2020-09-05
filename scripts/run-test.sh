#!/usr/bin/env bash
[[ -n ${CI} ]] && {
    # if it's called from github actions
    docker exec studentrant-server-test npm install
    docker exec studentrant-server-test npm run lint
}
docker exec studentrant-server-test npm run test:unit
