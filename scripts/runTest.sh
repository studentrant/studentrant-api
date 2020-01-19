#!/usr/bin/env bash
export NODE_ENV=test



if [[ ! -e "${HOME}/studentrant_test_db1/" ]] || \
       [[ ! -e "${HOME}/studentrant_test_db2/" ]]  || [[ ! -e "${HOME}/studentrant_test_db3/" ]]; then

    proces=(27017 27018 27019);

    for i in "${proces[@]}";do
	mapfile procs <<<$(lsof -t -i:$i)
	procLen=${#procs[@]} # cjtrl + back tick no dey respond eform my p.c
	(( procLen >= 1 )) && {
            for j in "${procs[@]}";do
		echo "$j"
		(( ${#j} > 1 )) && kill -9 $j ; sleep 2
            done
	}
    done

    mkdir -p "${HOME}/studentrant_test_db1/"
    mkdir -p "${HOME}/studentrant_test_db2/"
    mkdir -p "${HOME}/studentrant_test_db3/"

    mongod --dbpath "${HOME}/studentrant_test_db1/" --port 27017  --replSet studentrant_test --fork --syslog
    sleep 5
    mongod --dbpath "${HOME}/studentrant_test_db2/" --port 27018 --replSet studentrant_test --fork --syslog
    sleep 5
    mongod --dbpath "${HOME}/studentrant_test_db3/" --port 27019 --replSet studentrant_test --fork --syslog
    sleep 5

    mongo <<EOF
use studentrant
if ( rs.status().codeName === "NotYetInitialized" ) {

   rs.initiate();
   print(sleep);
   sleep(1500); // sleep for 5 minutes

   rs.add("127.0.0.1:27018");
   rs.add("127.0.0.1:27019");
}

db.dropDatabase()

EOF
fi

pidof mongod

[[ $? == 1 ]] && {
    mongod --dbpath "${HOME}/studentrant_test_db1/" --port 27017  --replSet studentrant_test --fork --syslog
    sleep 5
    mongod --dbpath "${HOME}/studentrant_test_db2/" --port 27018 --replSet studentrant_test --fork --syslog
    sleep 5
    mongod --dbpath "${HOME}/studentrant_test_db3/" --port 27019 --replSet studentrant_test --fork --syslog
    sleep 5

}
mongo <<EOF
use studentrant
db.dropDatabase()
EOF

export DEFAULT_TIMEOUT_INTERVAL=50000
export JASMINE_CONFIG_PATH="jasmine.json"

istanbul --config=.istanbul.yml cover jasmine --color
