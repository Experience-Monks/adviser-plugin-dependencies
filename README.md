# adviser-plugin-dependencies

Plugin for adviser that contains rules related to dependencies in the package.json

## Installation

You'll first need to install [Adviser](http://adviser.io):

```
$ npm i adviser --save-dev
```

Next, install `adviser-plugin-dependencies`:

```
$ npm install adviser-plugin-dependencies --save-dev
```

**Note:** If you installed Adviser globally (using the `-g` flag) then you must also install `adviser-plugin-dependencies` globally.

## Usage

Add `dependencies` to the plugins section of your `.adviserrc` configuration file. You can omit the `adviser-plugin-` prefix:

```json
{
  "plugins": ["dependencies"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "dependencies/min-vulnerabilities-allow": ["error", { "level": "low", "skip": ["780"] }]
  }
}
```

## Supported Rules

- [min-vulnerabilities-allow](docs/rules/min-vulnerabilities-allow.md)
- [licenses-whitelist](docs/rules/licenses-whitelist.md)
