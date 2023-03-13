# Minimal vulnerability severity allowed in the dependencies

It will throw an error or warning with same severity than the setup in level and above.

Use the adviser argument `--verbose` for extra information.

## Syntax

```
"dependencies/min-vulnerabilities-allow": ["error", { 
    "level": "", 
    "skip": [], 
    "production": true 
    }],
```

The rule `min-vulnerabilities-allow` may receive three arguments: `level`, `skip` and `production`.

### level

String - Minimum severity accepted.

Required

Possible values: 'info', 'low', 'moderate', 'high', 'critical'

### skip

Array of strings - Vulnerabilities to skip.

Default Value: `[]`

Example: `"skip":["728", "123"]`

### production

Boolean - skip checking packages in devDependencies.

Default Value: `true`

Example: `"production":true`