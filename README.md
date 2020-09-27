# GitHub Action - Limit Organization Interactions

A GitHub action that will run daily to ensure repository limitations are always enabled.
Since GitHub sets a time limit for enabled interaction limits, this GitHub action allows
you to always keep interaction limits enabled. This is especially useful for public repos
that get spammed.

Documentation: <https://docs.github.com/en/free-pro-team@latest/rest/reference/interactions>

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
on:
  schedule:
    # * is a special character in YAML so you have to quote this string
    # Run every day at 00:00, since the limits expire after 24 hours
    - cron:  '0 0 * * *'

jobs:
  limit-interactions:
    runs-on: ubuntu-latest
    name: Limit GitHub Organization interactions
    steps:
      # To use this repository's private action,
      # you must check out the repository
      - name: Checkout
        uses: actions/checkout@v2
      - name: Limit interactions
        uses: ./ # Uses an action in the root directory
        with:
          github-token: ${{ secrets.ORG_TOKEN_GITHUB }}
          # owner: 'AnotherOwner'
```

### Inputs

| name | value | default | description |
| ---- | ----- | ------- | ----------- |
| `github-token` | string | | Token for interacting with GitHub API. You should make a [personal access token](https://github.com/settings/tokens) and use it as the `github-token` input. |
| `limit` | string | `existing_users` | Must be one of: `existing_users`, `contributors_only`, or `collaborators_only`. See [API reference](https://docs.github.com/en/free-pro-team@latest/rest/reference/interactions) for more details. |
| `owner` | string | owner of current repo | Optional, set to a different GitHub organization to limit interactions for that org. |

## License

This application is licensed under the MIT License, you may obtain a copy of it
[here](LICENSE).
