#!/usr/bin/env node

import { Command } from 'commander';
import { scanPackage } from '../src/scanner';

const program = new Command();
program
  .name('patchsecurityscanner')
  .description('Securely install npm packages by blocking vulnerable patch versions')
  .argument('<packageSpec>', 'Package name and version range (e.g. react@^18.2.0)')
  .action(async (pkg) => {
    await scanPackage(pkg);
  });
program
  .command('preinstall')
  .description('Scan package.json dependencies before install to prevent vulnerable patches')
  .action(async () => {
    const { runPreinstallScan } = await import('../src/preinstallScanner');
    await runPreinstallScan();
  });


program.parse(process.argv);
