import { Dependency, DependencyResolved } from '../types'

export async function getDependencies(packageName: string): Promise<(Dependency | Dependency[])[]> {
  const packageModule = atom.packages.getLoadedPackage(packageName)
  if (packageModule == null) {
    return [];
  }

  const packageDependencies = packageModule.metadata['package-deps']
  if (packageDependencies == null || Array.isArray(packageDependencies) === false) {
    return [];
  }

  return packageDependencies.map((dependency) => {
    if (typeof dependency === 'string') {
      return { name: dependency };
    }

    return dependency;
  })
}

export async function resolveDependencyPath(packageName: string): Promise<string | null> {
  return atom.packages.resolvePackagePath(packageName)
}

export async function getInstalledDependencyVersion(dependency: DependencyResolved): Promise<string | null> {
  const packageModule = atom.packages.getLoadedPackage(dependency.name)

  return packageModule == null ? null : packageModule.metadata.version ?? null
}
