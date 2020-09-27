console.log("Starting...")
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
  console.log("Starting run...")

  const token = core.getInput('github-token');
  console.log("got token from input")

  const octokit = github.getOctokit(token)
  console.log("octokit configured")
  try {
    const limit = core.getInput('limit');
    console.log("got limit: ", limit)
    validate_limit(limit);
    console.log("validated limit")

    var [owner] = process.env.GITHUB_REPOSITORY.split("/");
    console.log(`got owner ${owner}`);
    var inputOwner = core.getInput("owner");
    if (inputOwner !== "") {
      owner = inputOwner;
    }

    // remove interaction restrictions first in order to reset the 24 hour timer
    await octokit.interactions.removeRestrictionsForOrg({owner});

    // Set org interaction restrictions
    await octokit.interactions.setRestrictionsForOrg({owner, limit});
    console.log("done...")
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
