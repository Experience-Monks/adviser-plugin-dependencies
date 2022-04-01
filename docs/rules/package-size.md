# Package size

Enables the ability to identify dependencies with a large file size when bundled for production.

## Syntax

```
"dependencies/package-size": ["warn", { "threshold": 20, "allowlist": ["react"] }]
```

The rule `package-size` receives two arguments: `threshold` and `allowlist`.

### threshold

Number - representing the package size limit in kilobytes that will trigger an error / warning when exceeded.

Optional

If no threshold is specified, Adviser will fallback to a default of 30 kb.

### allowlist

Array of string - Dependencies to exclude in the package size evaluation process.

Optional
