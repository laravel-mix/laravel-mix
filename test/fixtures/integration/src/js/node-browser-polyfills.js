/** @param {string} message */
const log = message => console.log(`node-polyfill: ${message}`);

log(`Buffer ${typeof Buffer}`);
log(`process ${typeof process}`);
log(`process.env ${typeof process !== 'undefined' ? typeof process.env : 'undefined'}`);
log(`process.env.NODE_ENV ${typeof process.env.NODE_ENV} = ${process.env.NODE_ENV}`);
