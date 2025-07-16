import { resolveVersion } from './resolver';
import { checkVulnerabilities } from './osvChecker';
import chalk from 'chalk';
import ora from 'ora';

export async function scanPackage(pkgSpec: string) {
  const spinner = ora(`Checking ${pkgSpec}...`).start();
  try {
    const { name, version } = await resolveVersion(pkgSpec);
    spinner.text = `Resolved ${name}@${version}, checking for CVEs...`;

    const vulns = await checkVulnerabilities(name, version);
    spinner.stop();

    if (vulns.length > 0) {
      console.log(chalk.red(`❌ ${name}@${version} has ${vulns.length} known vulnerabilities:`));
      vulns.forEach((v: any) => {
        console.log(v)
        console.log(`- ${v.aliases} ${v.id}: ${v.summary} : ${v.details}}`);
      });
      process.exit(1);
    } else {
      console.log(chalk.green(`✅ ${name}@${version} is safe.`));
    }
  } catch (err: any) {
    spinner.stop();
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}
