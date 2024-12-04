#!/bin/bash -ex

PARAMETER_VALIDATION_PROMPT="
Please supply the following arguments:

  -w <path to workspace>: absolute path to the workspace with which to test the plugin
  -a <app name>: the name of the app with which to test the plugin
  
For example: 
  ./scripts/add-serve-target.sh -w path/to/workspace -a example-app"

while getopts w:a: flag
do
  case "${flag}" in
    w) workspace=${OPTARG};;
    a) app=${OPTARG};;
  esac
done

if [ -z $workspace ] || [ -z $app ]; then
  echo "$PARAMETER_VALIDATION_PROMPT"
  exit 1
fi

# Path to the JSON file
NX_PROJECT_FILE=$workspace/apps/$app/project.json

# Check if the file exists
if [[ ! -f "$NX_PROJECT_FILE" ]]; then
  echo "Error: File $NX_PROJECT_FILE does not exist."
  exit 1
fi

# Load the JSON file and add a new section
NEW_NX_PROJECT=$(jq '.targets += {"serve": {"executor": "@nx/web:file-server", "options": { "buildTarget": "build", "staticFilePath": "apps/test-app/out", "port": 3000, "spa": false}}}' "$NX_PROJECT_FILE")

# Check if jq succeeded
if [[ $? -ne 0 ]]; then
  echo "Error: Failed to process JSON with jq."
  exit 1
fi

# Save the modified JSON back to the original file
echo "$NEW_NX_PROJECT" > "$NX_PROJECT_FILE"

echo "Successfully updated $NX_PROJECT_FILE."