param([Parameter(ValueFromRemainingArguments=$true)][string[]]$CliArgs)
$env:PATH='C:\Users\Kurt\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;'+$env:PATH
& 'C:/Users/Kurt/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' 'C:/Program Files/nodejs/node_modules/npm/bin/npx-cli.js' --offline --yes --package @playwright/cli@0.1.19 playwright-cli -s=knockbound-items @CliArgs
exit $LASTEXITCODE
