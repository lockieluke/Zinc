import * as path from 'path';

export default function getAppRoot(): string {
  return path.join(require.main.path, '..');
}
