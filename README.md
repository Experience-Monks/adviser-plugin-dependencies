# adviser-plugin-dependencies

Plugin for adviser that contains rules related to dependencies in the package.json

## Installation

You'll first need to install [Adviser](https://www.npmjs.com/package/adviser):

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

If you don't have a `.adviserrc` you can create one running `$ adviser --init`

### Full example

```
{
  "plugins": ["dependencies"],
  "rules": {
    "dependencies/min-vulnerabilities-allow": ["error", { "level": "high", "skip": ["780"] }],
    "dependencies/licenses-whitelist": [
      "warn",
      { "whitelist": ["MIT", "ISC", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause"] }
    ],
    "dependencies/not-allowed-packages": ["error", { "packages": ["jquery", "lodash", "kill-port", "la-tata"] }],
    "dependencies/outdated-packages": ["warn", { "criteria": "major", "exclude": [] }]
  }
}
```

## Testing

If you would like to contribute and later on test your changes there are a couple ways explained below.

### Unit code

The package (`adviser-plugin-dependencies`) is setup to run tests under the folder `__tests__` with Jest. Save your tests there and they will run before push code and by travis once the PR is created.

### Integration tests

To run your rules with `adviser`, we recommend you to create an empty folder (We have one under `./examples/integration`) with:

- An example package.json with example packages (in case is related with security, make sure to include some of them that fail your test)
- An `adviser` configuration file. You can grab the example in this README or generate one using `$ adviser --init` (adviser must be installed globally or using `npx`)
- Link this repo to the example project.
  - Run `$ npm link` in the `adviser-plugin-dependencies` root
  - Run `$ npm link adviser-plugin-dependencies` in the example project root

## Supported Rules

- [min-vulnerabilities-allow](docs/rules/min-vulnerabilities-allow.md)
- [licenses-whitelist](docs/rules/licenses-whitelist.md)
- [not-allowed-packages](docs/rules/not-allowed-packages.md)
- [outdated-packages](docs/rules/outdated-packages.md)
- [suspicious-packages](docs/rules/suspicious-packages.md)
- [unused-packages](docs/rules/unused-packages.md)
