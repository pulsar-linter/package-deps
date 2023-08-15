import type { PackageJson } from 'type-fest'

import { Dependency } from './types'
// TODO upstream these changes to @types/atom

interface PackageMetadata extends PackageJson {
  'package-deps'?: (string | Dependency | Dependency[])[]
}

// "package-deps": [ "linter" ]
// "package-deps": [ { "name": "linter" } ]
// "package-deps": [ { "name": "linter", "minimumVersion": "2.0.0" } ],
// "package-deps": [ [ { "name": "linter" }, { "name": "atom-ide-ui" } ] ]

declare module 'atom/src/package' {
  interface Package {
    metadata: PackageMetadata
  }
}

declare module 'atom/src/package-manager' {
  interface PackageManager {
    resolvePackagePath(name: string): string | null
  }
}
