#!/usr/bin/env bash

declare -a PORTS=( 27017 27018 27019 )


createProcess() {

    declare -i error=0;
    local port;

    for port in "${PORTS[@]}";do
        local running="$(lsof -t -i:${port})"
        [[ -n ${running} ]] && {
            printf "a %s process is running in %d\n" "$running" "$port"
            printf "${PORTS[*]} must be closed\n"
            error=1;
            break;
        }
    done

    {
        (( error == 0 )) && {
            for port in "${PORTS[@]}";do
                dbPath="${HOME}/studentrant_db_${port}"
                if [[ -e "${dbPath}" ]];then
                    mongod --dbpath "${dbPath}" --fork --syslog --port $port --replSet studentrant_dev
                    sleep 5
                    continue;
                fi
                mkdir "${dbPath}"
                mongod --dbpath "${dbPath}"  --fork --syslog --port $port --replSet studentrant_dev
                sleep 5
            done
        }
    }

    {
        [[ $? == 0 ]] && {

            mongo  <<EOF

load("./scripts/util.js")

const admin = db.getSiblingDB("admin");

use studentrant;

rs.initiate();

sleep(5); // sleep for 5 minutes

rs.add("127.0.0.1:27018");
rs.add("127.0.0.1:27019");

sleep(5); // sleep for 5 minutes

// users created on the admin database, will be able to manage the database

admin.createUser( {
    user: "studentrantUserAdmin",
    pwd: "studentrant",
    roles: [ "userAdminAnyDatabase" ]
});

admin.createUser({
    user: "studentrantRootAdmin",
    pwd: "studentrant",
    roles: [ "userAdminAnyDatabase", "readWriteAnyDatabase", "dbAdminAnyDatabase", "clusterAdmin" ]
});

// studentrant database user just normal crud operation

db.createUser({
    user: "studentrant",
    pwd: "studentrant",
   roles: [ "readWrite" ]
});

EOF
        }
    } || {
        printf "Could not carry out this operation\n";
        exit 1;
    }

}

generateKeyFile() {
    openssl rand -base64 756 > keyfile &&
        chmod 400 keyfile &&
        chown mongodb:mongodb keyfile
}

killAndRun() {

    generateKeyFile;

    for port in "${PORTS[@]}";do
        printf "Killing mongodb process running on  %d\n" "$port"
        dbPath="${HOME}/studentrant_db_${port}"
        mapfile __proc <<<$(lsof -t -i:${port})
        kill ${__proc[*]} 2>/dev/null
        sleep 5;
        printf "restarting mongodb process on %d\n" "$port"
        mongod --dbpath "${dbPath}" --auth --fork --syslog --port $port --keyFile keyfile --replSet studentrant_dev
    done
}

purge() {

    local force="${1}"

    [[ -z "${force}" ]] && printf "You will loose everything use with --force\n" && return 1;
    [[ "${force}" != "--force" ]] && printf "Invalid Option\n" && return 1;

    for port in "${PORTS[@]}";do
        mapfile __proc <<<$(lsof -t -i:${port})
        kill ${__proc[*]} 2>/dev/null
    done
    ( cd ; rm -rf studentrant_db_*/ )
    printf "done...\n"
}

killProc() {
    for port in "${PORTS[@]}";do
        printf "closing %d\n" "${port}"
        kill $(lsof -t -i:${port}) 2>/dev/null;
    done
}

[[ "${UID}" != 0 ]] && {
    printf "You are not root, but momma still loves you\n"
    exit 1;
}

case "${1}" in
    purge)
        shift;
        purge "${1}";
        ;;
    createProcess)
        createProcess;
        printf "\n run %s killAndRun\n\n" "${0##*/}";
        ;;
    run)
        killAndRun;
        ;;
    killProc)
        killProc ;
        ;;
    *)
        [[ -n "${1}" ]] && {
            printf "%s\n" "Invalid Argument";
            exit 1;
        }
        createProcess;
        killAndRun;
        ;;
esac
