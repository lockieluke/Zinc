export function isURL(input: string) {
  const pattern: RegExp = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;

  if (pattern.test(input)) {
    return true;
  }

  return pattern.test(`http://${input}`);
}

export function matchesPattern(pattern, url) {
  if (pattern === "<all_urls>") {
    return true;
  }

  const regexp = new RegExp(
    `^${pattern.replace(/\*/g, ".*").replace("/", "\\/")}$`
  );
  return url.match(regexp) != null;
}

export function getDomain(url: string) {
  let host = url;
  if (host.startsWith("http://") || host.startsWith("https://"))
    host = host.split("://")[1];

  if (url.includes("?")) host = host.split("?")[0];

  host = host.includes("://")
    ? `${host.split("://")[0]}://${host.split("/")[2]}`
    : host.split("/")[0];

  return host;
}

export function prefixHttp(url) {
  url = url.trim();
  return url.includes("://") ? url : `http://${url}`;
}

export function validURL(str: string): boolean {
  const pattern: RegExp = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}