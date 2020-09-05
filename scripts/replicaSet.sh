#!/usr/bin/env bash

printf "%s\n" "Setting up replicaset........."

sleep 20;

docker exec -it studentrant-mongo-node-1 mongo --eval "

print('Starting ReplicaSet.....');

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

    sleep(10)

    rs.add('mongo2:27017');
    rs.add('mongo3:27017');

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
}

print('Done....')
"
