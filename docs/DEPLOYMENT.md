# GitHub Pages Deployment

## Branch and repository

- Branch: `main`
- Remote repository: `https://github.com/nullandvoid-qa/nullandvoid-qa.github.io.git`

## Deployment workflow

The site is published automatically when commits are pushed to `main`.
The workflow file is located at:

- `.github/workflows/deploy-pages.yml`

### What the workflow does

1. Checks out the repository.
2. Sets up Node.js 20.
3. Installs dependencies with `npm ci`.
4. Runs `npm run validate:all` to ensure lint, validations, and tests pass.
5. Uploads the repository contents as a Pages artifact.
6. Publishes the artifact to GitHub Pages.

## GitHub Pages configuration

For automatic publishing to work:

- Enable GitHub Pages in repository settings.
- Set the Pages source to `GitHub Actions`.
- If a custom domain is used, configure it in the repository settings.

## Notes

- The workflow publishes the built static site directly from the repository root.
- Any validation failure will stop the workflow before deployment.
- This workflow is intended for the `main` branch only.
