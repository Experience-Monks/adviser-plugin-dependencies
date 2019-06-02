# Licenses Whitelist

It will throw an error or warning if it finds licenses that are not whitelisted

Use the adviser argument `--verbose` for extra information.

## Syntax

```
"dependencies/licenses-whitelist": ["warn", {
  whitelist: ["MIT"],
  excludePackage: ['yargs-parser@7.0.0'],
  includeNoProdPackages: true
}]
```

The rule `licenses-whitelist` may receive three arguments: `whitelist`, `includeNoProdPackages` and `excludePackage`.

### whitelist

Array of strings - Licenses to whitelist

Required

Possible values: 'MIT', 'BSD-3-Clause', 'ISC', 'Apache-2.0'

### excludePackage

Array of strings - Packages to exclude while fetching the licenses.

Default Value: `[]`

Example: `excludePackage: ['yargs-parser@7.0.0', 'which@1.3.1']`

### includeNoProdPackages

Boolean - Fetch also all the licenses of non production dependencies (development and peer dependencies)

Default Value: `false`

Example: `includeNoProdPackages: true`
