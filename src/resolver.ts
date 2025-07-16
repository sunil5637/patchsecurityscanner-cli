import pacote from 'pacote';
import semver from 'semver';
import npa from 'npm-package-arg';

export async function resolveVersion(pkgSpec: string): Promise<{name: string, version: string}> {
  const spec = npa(pkgSpec);
//   const { name, fetchSpec } = npa(pkgSpec);
if (!spec.name) throw new Error('Package name could not be parsed');
// const packument = await pacote.packument(name);

  const packument = await pacote.packument(spec.name);
  const versions = Object.keys(packument.versions);
  const resolved = semver.maxSatisfying(versions, spec.fetchSpec || 'latest');

  if (!resolved) throw new Error(`Could not resolve a version for ${pkgSpec}`);

  return { name: spec.name, version: resolved };
}
