# Not allowed packages

It will throw an error or warning if it finds not allowed packages among the dependencies. It will look by default in `dependencies`, `devDependencies` and `peerDependencies`.

## Syntax

```
"dependencies/not-allowed-packages": ["warn", {
  packages: ["jquery", "lodash"]
}]
```

The rule `not-allowed-packages` receives one arguments: `packages`.

### packages

Array of strings - not allowed packages

Required

Possible values: 'jquery', 'lodash'
