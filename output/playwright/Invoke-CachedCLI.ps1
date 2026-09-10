param([Parameter(ValueFromRemainingArguments=$true)][string[]]$CliArgs)
$env:PATH='C:\Users\Kurt\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;'+$env:PATH
& 'C:/Users/Kurt/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' 'C:/Users/Kurt/AppData/Local/npm-cache/_npx/e3bd8e8586e44e42/node_modules/@playwright/cli/playwright-cli.js' -s=knockbound-items @CliArgs
exit $LASTEXITCODE
