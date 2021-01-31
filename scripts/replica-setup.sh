#!/usr/bin/env bash

printf "%s\n" "Setting up replicaset........."

sleep 20;

[[ "${NODE_ENV}" == "test" ]] && {
    readonly CONTAINER="studentrant_test-mongo-node-1"
    readonly HOST1="mongo1:27077"
    readonly HOST2="mongo2:27081"
    readonly HOST3="mongo3:27091"
} || {
    readonly CONTAINER="studentrant-mongo-node-1"
    readonly HOST1="mongo1:27017"
    readonly HOST2="mongo2:27018"
    readonly HOST3="mongo3:27019"
}

docker exec -it "${CONTAINER}" mongo "${HOST1}" --eval "

if ( rs.status().codeName == 'NotYetInitialized' ) {

    function sleep(delay) {
        var start = (new Date().getTime()) / 1000;
        while (
            (new Date().getTime()) / 1000 < start + delay
        );
    }

    db = db.getSiblingDB('studentrant');

    const admin = db.getSiblingDB('admin');

    rs.initiate();

    rs.add('${HOST2}');
    rs.add('${HOST3}');

    sleep(10);

    admin.createUser( {
        user: 'studentrantUserAdmin',
        pwd: 'studentrant',
        roles: [ 'userAdminAnyDatabase' ]
    });

    admin.createUser({
        user: 'studentrantRootAdmin',
        pwd: 'studentrant',
        roles: [ 'userAdminAnyDatabase', 'readWriteAnyDatabase', 'dbAdminAnyDatabase', 'clusterAdmin' ]
    });

    db.createUser({
        user: 'studentrant',
        pwd: 'studentrant',
        roles: [ 'readWrite' ]
    });

   print(tojson(rs.conf()))
}
print('Done....')
"
