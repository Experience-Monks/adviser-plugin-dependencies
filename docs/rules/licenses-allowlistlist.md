# Licenses Allowlist

It will throw an error or warning if it finds licenses that are not allowed

Use the adviser argument `--verbose` for extra information.

## Syntax

```
"dependencies/licenses-allowlist": ["warn", {
  allowlist: ["MIT"],
  excludePackage: ['yargs-parser@7.0.0'],
  includeNoProdPackages: true
}]
```

The rule `licenses-allowlist` may receive three arguments: `allowlist`, `includeNoProdPackages` and `excludePackage`.

### allowlist

Array of strings - Licenses to allowlist

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
