if (process.argv.length !== 4) {
  console.info('usage: createWebsite <package name> <package short name>')
  console.info('e.g.: createWebsite sample-package-name sample')
  return
}

const packageName = process.argv[process.argv.length - 2]
const packageShortName = process.argv[process.argv.length - 1]

console.info(`Creating website '${packageShortName}' in directory 'packages\\${packageName}'.`)

const path = require('path')

const rootDirectory = path.join(__dirname, '..')
const packageNameDirectory = path.join(rootDirectory, 'packages', packageName)
const exampleWebappDirectory = path.join(rootDirectory, 'packages', 'Example.Website')

const replaceInFiles = options => {
  const replace = require('replace-in-file')
  try {
    const changes = replace.sync(options)
    console.log('Modified files:', changes.join(', '))
  } catch (error) {
    console.error('Error occurred replacing token in files:', error)
  }
}

const replaceTokens = () => {
  const files = [
    `./packages/${packageName}/**`,
    `./packages/${packageName}/**/.*/*.*`,
    `./packages/${packageName}/**/.*/**`,
  ]
  console.log('replace tokens in ' + files)

  replaceInFiles({
    files,
    from: /{{__PACKAGE_SHORT_NAME__}}/g,
    to: packageShortName,
  })

  replaceInFiles({
    files,
    from: /{{__PACKAGE_SHORT_NAME__}}/g,
    to: packageShortName,
  })

  replaceInFiles({
    files,
    from: /{{__PACKAGE_NAME__}}/g,
    to: packageName,
  })
}

const copyDirectoryRecursive = (from, to) => {
  const fs = require('fs-extra')
  fs.copy(from, to, err => {
    if (err) {
      console.error('Could not copy ${from} to ${to}')
      console.error(err)
    } else {
      replaceTokens()
    }
  })
}

const rimraf = require('rimraf')
rimraf(packageNameDirectory, err => {
  if (err) {
    console.error(`Could not delete ${packageNameDirectory}.`)
    console.log(err)
    return
  }
  copyDirectoryRecursive(exampleWebappDirectory, packageNameDirectory)
})
