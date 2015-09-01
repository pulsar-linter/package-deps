'use babel'
const FS = require('fs')
const Path = require('path')
const Helpers = require('atom-linter')

window.__sb_package_deps = window.__sb_package_deps || []

export default class PackageDeps{
  static install(packageName) {
    if (!packageName) throw new Error('packageName is required')

    const packageDeps = atom.packages.getLoadedPackage(packageName).metadata['package-deps'] || []
    const packagesToInstall = []
    packageDeps.forEach(function(name) {
      if (__sb_package_deps.indexOf(name) === -1) {
        __sb_package_deps.push(name)
        if (!atom.packages.resolvePackagePath(name)) {
          packagesToInstall.push(name)
        } else if(!atom.packages.getActivePackage(name)) {
          atom.packages.enablePackage(name)
        }
      }
    })
    setImmediate(function() {
      const APMPath = Path.join(Path.dirname(process.execPath), 'resources', 'app', 'apm', 'bin', 'apm')
      PackageDeps.installPackage(packageName, packagesToInstall, APMPath)
    })
    return packagesToInstall.length === 0
  }
  static installPackage(packageName, packageNames, APMPath) {
    const promises = []
    const errors = []
    packageNames.forEach(function(name) {
      promises.push(Helpers.exec(APMPath, ['install', name]))
    })
    Promise.all(promises).then(function(outputs){
      outputs.forEach(function(output, index) {
        const name = packageNames[index]
        if (output.indexOf('✓') === -1) {
          console.log('error installing ' + name)
        } else {
          atom.packages.enablePackage(name)
          console.log('successfully installed ' + name)
        }
      })
      console.log('all dependencies done for ' + packageName)
    })
  }
}
