function isURL(input) {
  const pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;

  if (pattern.test(input)) {
    return true;
  }

  return pattern.test(`http://${input}`);
}

function matchesPattern(pattern, url) {
  if (pattern === '<all_urls>') {
    return true;
  }

  const regexp = new RegExp(
    `^${pattern.replace(/\*/g, '.*').replace('/', '\\/')}$`,
  );
  return url.match(regexp) != null;
}

function getDomain(url) {
  let host = url;
  if (host.startsWith('http://') || host.startsWith('https://'))
    host = host.split('://')[1];

  if (url.includes('?')) host = host.split('?')[0];

  host = host.includes('://')
    ? `${host.split('://')[0]}://${host.split('/')[2]}`
    : host.split('/')[0];

  return host;
}

function prefixHttp(url) {
  url = url.trim();
  return url.includes('://') ? url : `http://${url}`;
}
