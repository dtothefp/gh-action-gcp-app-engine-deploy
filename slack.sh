BRANCH_NAME=test
GITHUB_REPOSITORY="dtothefp/gh-action-gcp-app-engine-deploy"
GITHUB_JOB=365191651
VERSION=1.1.1

curl -X POST \
--data-urlencode \
"payload={
  \"channel\":\"#fep-alerts\",
  \"username\":\"cwf_release\",
  \"text\":\"[$BRANCH_NAME] <https://github.com/$GITHUB_REPOSITORY/actions/runs/$GITHUB_JOB|CWF Deploy v$VERSION> started :crossed_fingers:\",
  \"icon_emoji\":\":hipster:
\"}" \
https://hooks.slack.com/services/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
