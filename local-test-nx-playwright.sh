#!/bin/bash

PARAMETER_VALIDATION_PROMPT="Please supply the environment variables LOCAL_TEST_WORKSPACE and LOCAL_TEST_APP_NAME"
PLUGIN_NAME="nx-playwright"

if [[ -z "${LOCAL_TEST_WORKSPACE}" ]]; then
    echo $PARAMETER_VALIDATION_PROMPT
    exit 1
fi
if [[ -z "${LOCAL_TEST_APP_NAME}" ]]; then
    echo $PARAMETER_VALIDATION_PROMPT
    exit 1
fi

function cleanup () {
    if [ "$1" == "--cleanup" ]; then
        echo "Cleaning up the workspace"
        git checkout .
        git clean -fd
        yarn install --frozen-lockfile
    else
        echo "Skipping cleanup"
    fi
}

PLUGIN_NPM_NAME="@mands/$PLUGIN_NAME"

rm -fr dist
yarn nx build $PLUGIN_NAME

pushd dist/packages/$PLUGIN_NAME
yarn link
popd

pushd $LOCAL_TEST_WORKSPACE
cleanup $1
yarn unlink $PLUGIN_NPM_NAME
yarn link $PLUGIN_NPM_NAME
yarn nx generate $PLUGIN_NPM_NAME:project $LOCAL_TEST_APP_NAME-e2e --project $LOCAL_TEST_APP_NAME
yarn nx e2e $LOCAL_TEST_APP_NAME-e2e --skip-nx-cache
cleanup $1
popd
