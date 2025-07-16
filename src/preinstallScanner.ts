import fs from 'fs';
import path from 'path';
import { checkVulnerabilities } from './osvChecker';
import { resolveVersion } from './resolver';
import chalk from 'chalk';
import ora from 'ora';

export async function runPreinstallScan() {
  const spinner = ora('Reading package.json...').start();

  const pkgPath = path.resolve(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) {
    spinner.fail('package.json not found.');
    process.exit(1);
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const deps = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
  };

  const results: { name: string; version: string; vulns: any[] }[] = [];

  for (const [name, range] of Object.entries(deps)) {
    spinner.text = `Resolving ${name}@${range}...`;
    try {
      const { version } = await resolveVersion(`${name}@${range}`);
      const vulns = await checkVulnerabilities(name, version);
      results.push({ name, version, vulns });
    } catch (err) {
      console.error(chalk.yellow(`⚠️ Could not resolve ${name}@${range}`));
    }
  }

  spinner.stop();

  const vulnerable = results.filter(r => r.vulns.length > 0);
  const safe = results.filter(r => r.vulns.length === 0);

  console.log(chalk.green(`✅ Safe packages:`));
  safe.forEach(r => console.log(`  - ${r.name}@${r.version}`));

  if (vulnerable.length > 0) {
    console.log(chalk.red(`\n❌ Vulnerable packages:`));
    vulnerable.forEach(r => {
      console.log(`  - ${r.name}@${r.version}`);
      r.vulns.forEach(v => {
        console.log(`    • ${v.id} - ${v.summary}`);
      });
    });

    console.log(
      chalk.red(
        `\n🛑 Installation blocked due to vulnerable packages. Run manually if you still wish to proceed.\n`
      )
    );
    process.exit(1);
  } else {
    console.log(chalk.green(`\n🎉 All resolved versions are secure.`));
  }
}
