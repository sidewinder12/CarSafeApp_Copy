/**
 * Created by michaelwagler on 2015-03-07.
 *
 * this includes the correct configuration file depending on if we're in production or development mode.
 */

module.exports = require('./' + (process.env.NODE_ENV || 'development') + '.json');