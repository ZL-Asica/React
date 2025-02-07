import { readFileSync, writeFileSync } from 'node:fs'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'))
const jsrJsonPath = './jsr.json'
const jsrJson = JSON.parse(readFileSync(jsrJsonPath, 'utf8'))

let hasChanges = false

if (jsrJson.version !== packageJson.version) {
  jsrJson.version = packageJson.version
  console.log(`Updated jsr.json version to ${packageJson.version}`)
  hasChanges = true
}

if (
  JSON.stringify(jsrJson.peerDependencies)
  !== JSON.stringify(packageJson.peerDependencies)
) {
  jsrJson.peerDependencies = packageJson.peerDependencies
  console.log('Updated jsr.json peerDependencies to match package.json')
  hasChanges = true
}

if (hasChanges) {
  writeFileSync(jsrJsonPath, JSON.stringify(jsrJson, null, 2), 'utf8')
  console.log('jsr.json updated successfully.')
}
else {
  console.log('jsr.json is already up-to-date.')
}
