# Exchange GitHub tokens for VeraId Authority credentials

This GitHub Action exchanges GitHub JWTs for [VeraId](https://veraid.net) credentials via [VeraId Authority](https://docs.relaycorp.tech/veraid-authority/).

## Usage

You simply need to grant the job the `id-token: write` permission and specify the exchange endpoint on your instance of VeraId Authority. After that, you can use the `credential` output in subsequent steps.

Here's an example workflow:

```yaml
jobs:
  authentication:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
      - name: Get Kliento token bundle
        id: token-bundle
        uses: CheVeraId/authority-credentials-action@v1
        with:
          exchange-endpoint: https://veraid-authority.example/credentials/123
      - name: Use token bundle
        run: curl -H "Authorization: Kliento ${TOKEN_BUNDLE}" https://api.example.com
        environment:
          TOKEN_BUNDLE: ${{ steps.token-bundle.outputs.credential }}
```

### Inputs

| Input | Description | Required |
|-------|-------------|----------|
| `exchange-endpoint` | The URL to exchange the GitHub JWT for a VeraId Authority credential | Yes |

### Outputs

| Output | Description |
|--------|-------------|
| `credential` | The VeraId Authority credential (base64 encoded) |
| `type` | The type of the credential (e.g. `application/vnd.veraid.signature-bundle`) |

## Development

### Contributions

We love contributions! If you haven't contributed to a Relaycorp project before, please take a minute to [read our guidelines](https://github.com/relaycorp/.github/blob/master/CONTRIBUTING.md) first.

Issues are tracked on the [`VLIB` project on Jira](https://relaycorp.atlassian.net/browse/VLIB) (component: `Credentials GH Action`).

### Publishing a New Release

This project includes a helper script, [`script/release`](./script/release)
designed to streamline the process of tagging and pushing new releases for
GitHub Actions.

GitHub Actions allows users to select a specific version of the action to use,
based on release tags. This script simplifies this process by performing the
following steps:

1. **Retrieving the latest release tag:** The script starts by fetching the most
   recent SemVer release tag of the current branch, by looking at the local data
   available in your repository.
1. **Prompting for a new release tag:** The user is then prompted to enter a new
   release tag. To assist with this, the script displays the tag retrieved in
   the previous step, and validates the format of the inputted tag (vX.X.X). The
   user is also reminded to update the version field in package.json.
1. **Tagging the new release:** The script then tags a new release and syncs the
   separate major tag (e.g. v1, v2) with the new release tag (e.g. v1.0.0,
   v2.1.2). When the user is creating a new major release, the script
   auto-detects this and creates a `releases/v#` branch for the previous major
   version.
1. **Pushing changes to remote:** Finally, the script pushes the necessary
   commits, tags and branches to the remote repository. From here, you will need
   to create a new release in GitHub so users can easily reference the new tags
   in their workflows.
