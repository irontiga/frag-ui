# Frag UI 
<img src="http://www.browserstack.com/images/layout/browserstack-logo-600x315.png" width="140"/>

See .eslint.rc.json for linting rules. Lint with
```
npm run lint
```

Built with lit-element https://lit-element.polymer-project.org/

Layout helper classes from https://material.io/develop/web/components/layout-grid/

Components ideally from https://github.com/material-components/material-components-web-components
But some aren't...falls back on https://www.webcomponents.org/author/PolymerElements

Using redux for state management

Uses EpmlJS https://github.com/irontiga/epml which is a "v2" of https://irontiga.github.io/wimp-js/

If out of memory...
```
node --max-old-space-size=8192 node_modules/rollup/bin/rollup -c rollup.config.js --watch
```
If network timeouts of google-material-icons
```
yarn install --network-timeout 100000
```