#!/usr/bin/env bash
OLDIFS=${IFS}
IFS=""
echo `env`
IFS=${OLDIFS}
#docker exec -it studentrant-server-test npm run test:e2e
docker exec studentrant-server-test npm run test:unit
