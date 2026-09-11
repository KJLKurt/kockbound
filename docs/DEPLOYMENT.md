# Deploy a solo demo with GitHub Actions

The solo game and bots run entirely in the browser. GitHub Pages serves the compiled files; no Cloudflare account, room server, database, or API key is required. Room play stays hidden in the static build.

Version0.13.0 adds **Match setup → Free-for-all / Team Arena / Boss co-op**, participant count up to12, valid equal team sizes and Cloud King/Tempest encounters. Pages still has one human; bots fill the other seats. Team/boss gameplay works locally in the browser. The online room UI supports up to12 human seats when served by the backend; publishing to Pages does not connect separate phones together. See [party rules](PARTY_MODE_CONTRACT.md).

## One-time setup

1. Push this project, including `.github/workflows/pages.yml` and `pnpm-lock.yaml`, to your GitHub repository. Do not commit `node_modules` or `dist`.
2. In the repository, open **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**.
3. The workflow deploys pushes to `main`. If your release branch has another name, change `branches: [main]` in the workflow. Ensure that branch is allowed by the `github-pages` environment's deployment rules under Settings → Environments.
4. Open **Actions → Deploy solo demo to GitHub Pages → Run workflow**, or push a change to the configured branch. Manual runs become available once the workflow is on the default branch.
5. Open the URL shown in the successful deployment, normally `https://YOURNAME.github.io/REPOSITORY_NAME/`. Open the same URL on your phone. Your computer can be off and the phone need not share its Wi-Fi.

The workflow installs Node 24.19.0 and pnpm 11.19.0, installs locked dependencies, runs typecheck, builds the solo game, uploads only `dist`, and deploys it using GitHub's Pages actions. Repository name and capitalization are picked up automatically. GitHub's built-in workflow token handles publishing; no personal token is needed.

This workflow targets a project site under the repository name. For a root site or custom domain, change its build command to plain `pnpm build` instead of setting `BASE_PATH`.

## Updating and testing

Push to the configured branch to rebuild and republish. Once the deployment is green, reload the phone browser. Try starting a solo match, simultaneous joystick and Dash, camera drag, portrait/landscape rotation, audio after the first tap, and pause/resume. Actual phone compatibility remains a playtest gate; a successful deployment does not prove it.

For a normal local build:

```powershell
pnpm install --frozen-lockfile --ignore-scripts
pnpm typecheck
pnpm build
pnpm preview
```

For a project-path build in PowerShell:

```powershell
$env:BASE_PATH = '/YOUR_REPOSITORY_NAME/'
pnpm build
Remove-Item Env:BASE_PATH
```

The existing `pnpm preview` serves at `/`, so use the normal root build with it. A subdirectory build needs a server that mounts `dist` at the same subdirectory. The workflow handles the production path automatically. `BASE_PATH` requires leading and trailing slashes.

If the Pages address returns 404, verify the deployment succeeded, the repository-name capitalization matches, and Pages uses GitHub Actions. If assets return 404, check that the workflow's base path matches the published URL. GitHub Free supports Pages from public repositories; private-repository availability depends on the plan.

## Cloudflare later

Plain `pnpm build` still generates root paths for the existing Cloudflare configuration. Model and audio URLs resolve relative to their JavaScript modules on either host. This change does not enable rooms or change `wrangler.jsonc`. Cloudflare multiplayer still requires the runtime validation and public safeguards documented in [Worker setup](../server/worker/README.md).

References: [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [publishing source settings](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Pages creation and availability](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
