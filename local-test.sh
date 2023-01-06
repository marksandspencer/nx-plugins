#!/bin/bash

PACKAGE_MANAGER="npm" # npm|yarn|pnpm
PACKAGE_RUN_COMMAND="npm run" # npm run|yarn|pnpm

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
        ${PACKAGE_MANAGER} install --frozen-lockfile
    else
        echo "Stash not requested"
    fi
}

function restore_workspace_if_requested {
    if [ $should_stash_and_clean ]; then
        git checkout .
        git clean -fd
        git stash pop
        ${PACKAGE_MANAGER} install --frozen-lockfile
    else
        echo "Restore not required"
    fi
}

PLUGIN_NPM_NAME="@mands/$PLUGIN_NAME"

rm -fr dist
${PACKAGE_RUN_COMMAND} nx build $PLUGIN_NAME

pushd dist/packages/$PLUGIN_NAME
${PACKAGE_MANAGER} link
popd

pushd $workspace
stash_workspace_changes_if_requested
${PACKAGE_MANAGER} unlink $PLUGIN_NPM_NAME
${PACKAGE_MANAGER} link $PLUGIN_NPM_NAME
echo "USING PACKAGE RUNNER ${PACKAGE_MANAGER}"
${PACKAGE_RUN_COMMAND} nx generate $PLUGIN_NPM_NAME:project $app-e2e --packageRunner=${PACKAGE_MANAGER} --project $app
${PACKAGE_RUN_COMMAND} nx e2e $app-e2e --skip-nx-cache
restore_workspace_if_requested
popd
