import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

// Check if user typed `npm run dev all` intending to run the full stack
if (args.some(a => a.toLowerCase() === 'all')) {
  console.log('\n[SmartFit] "all" argument detected! Launching all services (Backend, ML-Engine, Frontend)...\n');
  const isWin = process.platform === 'win32';
  const npmCmd = isWin ? 'npm.cmd' : 'npm';
  const child = spawn(npmCmd, ['run', 'dev:all'], {
    stdio: 'inherit',
    cwd: __dirname,
    shell: true
  });
  child.on('exit', (code) => process.exit(code || 0));
} else {
  const isWin = process.platform === 'win32';
  const npxCmd = isWin ? 'npx.cmd' : 'npx';
  const child = spawn(npxCmd, ['vite', ...args], {
    stdio: 'inherit',
    cwd: __dirname,
    shell: true
  });
  child.on('exit', (code) => process.exit(code || 0));
}
