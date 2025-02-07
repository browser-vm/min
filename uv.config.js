const uvConfig = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/dist/uv.handler.js',
    bundle: '/dist/uv.bundle.js',
    config: '/dist/uv.config.js',
    sw: '/dist/uv.sw.js',
};

export default uvConfig;