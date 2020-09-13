#!/usr/bin/env bash
export NODE_ENV=test
readonly TEST_TO_RUN="${1}"

ifconfig

[[ -n "${CI}" ]] && npm install

[[ ! "${TEST_TO_RUN}" =~ ^(e2e|unit|\s{0,})$ ]] && {
    printf "%s\n" "e2e | unit test are allowed";
    exit 1;
}

{
    [[ -z "${TEST_TO_RUN}" ]] || [[ "${TEST_TO_RUN}" == "e2e" ]]
} && ./scripts/replica-setup.sh


[[ "${TEST_TO_RUN}" == "unit" ]] && npm run test:unit && exit 0;
[[ "${TEST_TO_RUN}" == "e2e"  ]] && npm run coverage:e2e  && exit 0;
[[ -z "${TEST_TO_RUN}" ]]        && {
    npm run coverage:e2e
    npm run test:unit
}
