PARAMETER_VALIDATION_PROMPT="Please supply the environment variables LOCAL_TEST_WORKSPACE and LOCAL_TEST_APP_NAME"

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
        echo "Cleanup test NX workspace"
        git checkout . && git clean -fd && yarn install --frozen-lockfile
    else
        echo "Skipping target repository cleanup"
    fi
}

NX_PLUGIN_DIR=$(pwd)

cd $LOCAL_TEST_WORKSPACE
cleanup $1
yarn install --frozen-lockfile

cd $NX_PLUGIN_DIR
rm -fr dist
yarn nx build nx-playwright
cd dist/packages/nx-playwright/
yarn link

cd $LOCAL_TEST_WORKSPACE
yarn unlink "@mands/nx-playwright"
yarn link "@mands/nx-playwright"
yarn nx generate @mands/nx-playwright:project $LOCAL_TEST_APP_NAME-e2e --project $LOCAL_TEST_APP_NAME
yarn nx e2e $LOCAL_TEST_APP_NAME-e2e --skip-nx-cache
cleanup $1

cd $NX_PLUGIN_DIR
