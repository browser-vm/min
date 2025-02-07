self.__uv$config = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: function(url) {
        return btoa(url);
    },
    decodeUrl: function(encodedUrl) {
        return atob(encodedUrl);
    },
    handler: '/dist/uv.handler.js',
    bundle: '/dist/uv.bundle.js',
    config: '/dist/uv.config.js',
    sw: '/dist/uv.sw.js',
};