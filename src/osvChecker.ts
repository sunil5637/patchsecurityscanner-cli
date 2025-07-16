import axios from 'axios';

export async function checkVulnerabilities(pkgName: string, version: string) {
  const response = await axios.post('https://api.osv.dev/v1/query', {
    package: { name: pkgName, ecosystem: 'npm' },
    version
  });

  return response.data.vulns || [];
}
