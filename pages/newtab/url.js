function isURL(input) {
    const pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;

    if (pattern.test(input)) {
        return true;
    }
    return pattern.test(`http://${input}`);
};

function matchesPattern (pattern, url) {
    if (pattern === '<all_urls>') {
        return true;
    }

    const regexp = new RegExp(
        `^${pattern.replace(/\*/g, '.*').replace('/', '\\/')}$`,
    );
    return url.match(regexp) != null;
};

function getDomain(url) {
    let hostname = url;

    if (hostname.includes('http://') || hostname.includes('https://')) {
        hostname = hostname.split('://')[1];
    }

    if (hostname.includes('?')) {
        hostname = hostname.split('?')[0];
    }

    if (hostname.includes('://')) {
        hostname = `${hostname.split('://')[0]}://${hostname.split('/')[2]}`;
    } else {
        hostname = hostname.split('/')[0];
    }

    return hostname;
};

function prefixHttp(url) {
    url = url.trim();
    return url.includes('://') ? url : `http://${url}`;
};