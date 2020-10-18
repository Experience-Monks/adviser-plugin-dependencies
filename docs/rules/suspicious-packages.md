# Suspicious Packages

It will throw an error or warning if it finds any packages that don't meet the specified values for the indicators

Use the adviser argument `--verbose` for extra information.

## Syntax

```
"dependencies/suspicious-packages": ["warn", {"indicators":{},"whitelist": []}],
```

The rule `suspicious-packages` may receive two arguments: `indicators` and `whitelist`.

### indicators

Object: {[ string ]: number} - Threshold values for suspicious package indicators

Requires at least one attribute

Possible values:

- downloads (min)
- last-update (max - in months)
- maintainers (min)
- open-issue (max)
- stars (min)
- watchers (min)
- forks (min)

### whitelist

Array: string[] - Dependencies to exclude in the package size evaluation process.

Optional
