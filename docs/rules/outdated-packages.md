# Outdated Dependencies

It will throw an error or warning if it finds outdated dependencies.

## Syntax

```
"dependencies/outdated-packages": ["warn", {
  "criteria": "major", "exclude": []
}]
```

The rule `outdated-packages` receives two arguments: `criteria` and `exclude`.

### criteria

String - The outdated criteria. If says `major` will show only packages with major version updates, and so on.

Required

Possible values: 'major', 'minor' or 'patch'

### exclude

Array of string - Dependencies to exclude

Possible values: 'jquery', 'lodash'
