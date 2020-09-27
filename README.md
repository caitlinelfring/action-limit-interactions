# GitHub Action - Limit Organization Interactions

A GitHub action that will run daily to ensure repository limitations are always enabled.
Since GitHub sets a time limit for enabled interaction limits, this GitHub action allows
you to always keep interaction limits enabled. This is especially useful for public repos
that get spammed.

Documentation: <https://docs.github.com/en/free-pro-team@latest/rest/reference/interactions>

**NOTE** This action can only be run on a GitHub _organization_. Running this against your
own GitHub account will fail. It must be a GitHub _organization_, because interaction limitations
for accounts is not a GitHub feature. It's only a feature for organizations and repos. This
GitHub action is specific for _organizations_.

If you try to run this on a regular user account, you will see the following error:

```txt
Warning: error removing org restrictions: HttpError: Not Found
Error: Not Found
```

Since this action interacts with the organization interaction limits API, and the built-in
`GITHUB_TOKEN` provided by the action does not have sufficient permissions, you must create
a [Personal Access Token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)
and grant it the `admin:org` scope.

You must then create an [encrypted secret](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets)
within the repo (or the org, if you'd like) where you are running this action. You may name
it whatever you like, as long as you follow [GitHub's secret naming convention](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets#naming-your-secrets)

Once you create your secret, you should reference it within the action in the input `github-token`.

## Usage

### Example Workflow file

You should create a file similar to below called `.github/workflows/limit-org-interactions.yml`
and push this file to your main branch.

```yaml
name: Limit interactions
on:
  schedule:
    # * is a special character in YAML so you have to quote this string
    # Run every day at 00:00, since the limits expire after 24 hours
    - cron: '0 0 * * *'

jobs:
  limit-interactions:
    runs-on: ubuntu-latest
    name: Limit GitHub Organization interactions
    steps:
      - name: Limit interactions
        uses: caitlinelfring/action-limit-interactions@v1
        with:
          github_token: ${{ secrets.ORG_TOKEN_GITHUB }}
          # org: 'AnotherOwner'
```

### Inputs

| name | value | default | description |
| ---- | ----- | ------- | ----------- |
| `github_token` | string | | Token for interacting with GitHub API. You should make a [personal access token](https://github.com/settings/tokens) and use it as the `github_token` input. |
| `limit` | string | `existing_users` | Must be one of: `existing_users`, `contributors_only`, or `collaborators_only`. See [API reference](https://docs.github.com/en/free-pro-team@latest/rest/reference/interactions) for more details. |
| `org` | string | org of current repo | Optional, set to a different GitHub organization to limit interactions for that org. |

## License

This application is licensed under the MIT License, you may obtain a copy of it
[here](LICENSE).
