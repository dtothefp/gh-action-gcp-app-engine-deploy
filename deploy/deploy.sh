#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
NOCOLOR='\033[0m'

set -e

BUMP=$1

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" != "master" ]; then
  echo -e "${RED}You must be on the `master` branch.${NOCOLOR}"
  exit 1
fi

case $BUMP in
  "major" | "minor" | "patch")
    ;;
  *)
    echo -e "${RED}Provided argument must be <major|minor|patch>.${NOCOLOR}"
    exit 1
  ;;
esac

gcloud config set project goodrx-content-prod;
gcloud config set app/cloud_build_timeout 1800;

yarn version --${BUMP}

gcloud builds submit --config cloudbuild_deploy.yaml . || exit 1;

VERSION=v$(node -pe "require('./package.json').version")
GCLOUD_SAFE_VERSION=${VERSION//\./-}

gcloud app deploy --no-promote --version=$GCLOUD_SAFE_VERSION --image-url='us.gcr.io/goodrx-content-prod/web:latest' --quiet;

git push --tags && git push

echo -e "${GREEN}Deploy Success!${NOCOLOR}"
