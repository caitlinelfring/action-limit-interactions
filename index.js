const github = require('@actions/github');
const core = require('@actions/core');

function validate_limit(limit) {
  if (!["existing_users", "contributors_only", "collaborators_only"].includes(limit)) {
    core.setFailed(`limit-group must be one of ["existing_users", "contributors_only", "collaborators_only"], you provided: "${limit}"`);
  }
}

async function run() {
  // This should be a token with access to your repository scoped in as a secret.
  // The YML workflow will need to set github-token with the GitHub Secret Token
  // github-token: ${{ secrets.GITHUB_TOKEN }}
  // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
  //
  // If you are using this action to limit interactions at the org level, or for another repo,
  // you must create a personal access token, store it in a GitHub secret, and use that to
  // populate `github-token`. See https://docs.github.com/en/free-pro-team@latest/rest/reference/interactions
  const token = core.getInput('github_token');
  const octokit = github.getOctokit(token, { previews: ["sombra-preview"] });

  try {
    const limit = core.getInput('limit');
    validate_limit(limit);

    var [org] = process.env.GITHUB_REPOSITORY.split("/");
    var inputOrg = core.getInput("org");
    if (inputOrg !== "") {
      org = inputOrg;
    }

    // remove interaction restrictions first in order to reset the 24 hour timer
    await octokit.interactions.removeRestrictionsForOrg({ org }).catch(function(err) {
      core.warning(`error removing org restrictions: ${err}`);
      throw err;
    });

    // Set org interaction restrictions
    await octokit.interactions.setRestrictionsForOrg({ org, limit }).catch(function (err) {
      core.warning(`error setting org restrictions: ${err}`);
      throw err;
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
