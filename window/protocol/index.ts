import * as path from 'path';

export default function main(url: string): string {
  const rawURL: string = url.replace('zinc://', '');
  switch (rawURL) {
    case 'newtab':
      return (
        'file:///' +
        path.join(__dirname, '..', '..', '..', 'pages', 'newtab', 'index.html')
      );

    default:
      break;
  }
}
