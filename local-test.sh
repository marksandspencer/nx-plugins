LOCAL_TEST_WORKSPACE="$(pwd)/../onyx-nx"

NX_PLUGIN_DIR=$(pwd)
cd $LOCAL_TEST_WORKSPACE
echo "Cleanup test NX workspace"
git checkout . && git clean -fd
yarn 
cd -

rm -fr dist
yarn nx build nx-playwright
cd dist/packages/nx-playwright/
yarn link
cd $LOCAL_TEST_WORKSPACE
yarn unlink "@mands/nx-playwright"
yarn link "@mands/nx-playwright"
cd -

cd $LOCAL_TEST_WORKSPACE
yarn nx generate @mands/nx-playwright:project name-of-the-app-e2e --project name-of-the-app
yarn nx e2e name-of-the-app-e2e --skip-nx-cache


if [ "$1" == "--no-cleanup" ]; 
then
    echo "Skipping target repository cleanup"
    
else
    echo "Cleanup test NX workspace"
    git checkout . && git clean -fd && yarn
fi


cd $NX_PLUGIN_DIR
