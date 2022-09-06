#!/bin/bash

PLUGIN_NAME="nx-playwright"
PARAMETER_VALIDATION_PROMPT="
Please supply the following arguments:

  -w <path to workspace>: absolute path to the workspace with which to test the plugin
  -a <app name>: the name of the app with which to test the plugin
  -C: if present, stash workspace changes before the test run and clean up afterwards (optional)
  
For example: 
  ./local-test.sh -w path/to/workspace -a example-app -C"

while getopts w:a:C flag
do
    case "${flag}" in
        w) workspace=${OPTARG};;
        a) app=${OPTARG};;
        C) should_stash_and_clean=1;;
    esac
done

if [ -z $workspace ] || [ -z $app ]; then
    echo "$PARAMETER_VALIDATION_PROMPT"
    exit 1
fi

function stash_workspace_changes_if_requested {
    if [ $should_stash_and_clean ]; then
        echo "Stashing all changes before test"
        git stash -u
        yarn install --frozen-lockfile
    else
        echo "Stash not requested"
    fi
}

function restore_workspace_if_requested {
    if [ $should_stash_and_clean ]; then
        git checkout .
        git clean -fd
        git stash pop
        yarn install --frozen-lockfile
    else
        echo "Restore not required"
    fi
}

PLUGIN_NPM_NAME="@mands/$PLUGIN_NAME"

rm -fr dist
yarn nx build $PLUGIN_NAME

pushd dist/packages/$PLUGIN_NAME
yarn link
popd

pushd $workspace
stash_workspace_changes_if_requested
yarn unlink $PLUGIN_NPM_NAME
yarn link $PLUGIN_NPM_NAME
yarn nx generate $PLUGIN_NPM_NAME:project $app-e2e --project $app
yarn nx e2e $app-e2e --skip-nx-cache
restore_workspace_if_requested
popd
