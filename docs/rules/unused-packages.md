# Unused Dependencies

It will throw an error or warning if it finds unused dependencies.

## Syntax

```
"dependencies/unused-packages": ["warn", {
  "exclude": []
}]
```

The rule `unused-packages` receives one arguments: `exclude`.

### exclude

Array of string - Dependencies to exclude in case of false alert

Optional

Possible values: 'jquery', 'lodash'
