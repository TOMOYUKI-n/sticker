// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
    transpileDependencies: [
        "vuetify"
    ],
    publicPath: "./",
    configureWebpack: {
        plugins: [new GenerateSW({
            cacheId: "n-sticker-v1",
            clientsClaim: false,
            skipWaiting: true,
            cleanupOutdatedCaches: true
        })]
    }
};
