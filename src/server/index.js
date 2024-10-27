const exitHook = require('async-exit-hook');
const RammerheadProxy = require('../classes/RammerheadProxy');
const addStaticDirToProxy = require('../util/addStaticDirToProxy');
const RammerheadSessionFileCache = require('../classes/RammerheadSessionFileCache');
const config = require('../config');
const setupRoutes = require('./setupRoutes');
const setupPipeline = require('./setupPipeline');
const RammerheadLogging = require('../classes/RammerheadLogging');

const createRammerhead = (options) => {
    const logger = new RammerheadLogging({
        logLevel: config.logLevel,
        generatePrefix: (level) => config.generatePrefix(level)
    });

    let ipGet = null;

    //maybe fixed?
    if (options.reverseProxy !== true) {
        ipGet = config.getIP;
    } else {
        ipGet = config.getIP;
    }

    const proxyServer = new RammerheadProxy({
        logger,
        loggerGetIP: ipGet,
        bindingAddress: config.bindingAddress,
        port: options.reverseProxy !== true ? config.port : 443,
        crossDomainPort: options.reverseProxy !== true ? null : 4431,
        dontListen: true,
        ssl: config.ssl,
        getServerInfo: options.reverseProxy !== true ? config.getServerInfo : config.getServerInfoProxy,
        disableLocalStorageSync: config.disableLocalStorageSync,
        diskJsCachePath: config.diskJsCachePath,
        jsCacheSize: config.jsCacheSize
    });

    if (config.publicDir) addStaticDirToProxy(proxyServer, config.publicDir);

    const fileCacheOptions = { logger, ...config.fileCacheSessionConfig };
    const sessionStore = new RammerheadSessionFileCache(fileCacheOptions);
    sessionStore.attachToProxy(proxyServer);

    setupPipeline(proxyServer, sessionStore);
    setupRoutes(proxyServer, sessionStore, logger);

    // nicely close proxy server and save sessions to store before we exit
    exitHook(() => {
        proxyServer.close();
    });

    return proxyServer.server1;
};

// if you want to just extend the functionality of this proxy server, you can
// easily do so using this. mainly used for debugging
module.exports = createRammerhead;
