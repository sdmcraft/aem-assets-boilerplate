# AEM Asset Selector for Franklin Authoring
Integration between AEM Asset Selector and AEM Franklin to make AEM assets available in Franklin site authoring.

# High level flow
![High Level Flow](/resources/using-asset-selector-with-franklin.jpeg)

## Environments
- Preview: https://main--aem-assets-boilerplate--hlxsites.hlx.page/
- Live: https://main--aem-assets-boilerplate--hlxsites.hlx.page/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-assets-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
1. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
1. Start Franklin Proxy: `hlx up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
