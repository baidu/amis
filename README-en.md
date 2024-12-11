<div align="center">
  <p>
    <img width="284" src="https://github.com/baidu/amis/raw/master/examples/static/logo.png">
  </p>

[Documentation (China)](https://aisuda.bce.baidu.com/amis/) |
[Documentation (Global)](https://baidu.github.io/amis/) |
[Visual Editor](https://aisuda.github.io/amis-editor-demo/) |
[amis-admin](https://github.com/aisuda/amis-admin) |
[AiSuDa](https://aisuda.baidu.com/)

</div>

<div align="center">
  Ruliu Group: 3395342 |
  Ruliu Group 2: 5511067 |
</div>

<div align="center">

![build](https://img.shields.io/github/actions/workflow/status/baidu/amis/gh-pages.yml)
![license](https://img.shields.io/github/license/baidu/amis.svg)
![version](https://img.shields.io/npm/v/amis)
![language](https://img.shields.io/github/languages/top/baidu/amis)
[![codecov](https://codecov.io/gh/baidu/amis/branch/master/graph/badge.svg?token=9LwimHGoE5)](https://codecov.io/gh/baidu/amis)
![last](https://img.shields.io/github/last-commit/baidu/amis.svg)

</div>

A low-code front-end framework that allows you to generate various backend pages using JSON configuration, greatly reducing development costs, and even eliminating the need for front-end expertise.

## Development Guide

The following is for those who want to contribute to the development of amis. For usage, refer to the documentation above.

> If GitHub downloads are slow, you can use the mirror on [gitee](https://gitee.com/baidu/amis).

Node.js versions 12/14/16 are recommended. Use npm 7+ because the workspaces feature is required.

```bash
# Install project dependencies. There may be errors with Node.js 12, but they don't affect normal use.
npm i --legacy-peer-deps

# Start the project. Once compilation is complete, access it at http://127.0.0.1:8888/examples/pages/simple.
npm start
```

If you're developing the editor, access it at `http://127.0.0.1:8888/packages/amis-editor/`.

### Testing

> Note: After modifying code locally, you must run npm run build to complete compilation before executing test cases (`npm test --workspaces`), as Jest doesn't support TypeScript directly.

```bash
# Install dependencies
npm i --legacy-peer-deps

# Build the project
npm run build

# Run all test cases
npm test --workspaces

# Run a specific test case
# <spec-name> is the name of the test case, e.g., inputImage
npm test --workspace amis -- -t <spec-name>

# Run a specific test file
./node_modules/.bin/jest packages/amis/__tests__/renderers/Form/buttonToolBar.test.tsx

# Run a specific example in a test file
./node_modules/.bin/jest packages/amis/__tests__/renderers/Form/buttonToolBar.test.tsx -t 'Renderer:button-toolbar'

# View test coverage
npm run coverage

# Update snapshots
npm run update-snapshot

# Update a single snapshot
# <spec-name> is the name of the test case, e.g., inputImage
npm run update-snapshot --workspace amis -- -t <spec-name>
```

### Release Version

```bash
# Publish to internal registry
npm run publish

# Publish to external environment
# First, set the version number with the following command
npm run version
npm run release
```

### How to Contribute

Please use a branch for development. First, create a branch:

    git checkout -b feat-xxx

After committing your changes, use `git push --set-upstream origin feat-xxx` to create a remote branch.

Then submit a PR using the system-generated link: https://github.com/xxx/amis/pull/new/feat-xxx.

Please write in TypeScript. All reasonable changes, new public renderers, test cases, or documentation submissions will be accepted.

## Contributors

<a href="https://github.com/baidu/amis/graphs/contributors"><img src="https://opencollective.com/amis/contributors.svg?width=890" /></a>

## Low-Code Platform

amis enables low-code front-end development. For a complete low-code platform, we recommend using [AiSuDa](https://aisuda.baidu.com/).
