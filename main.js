require('fs').appendFile('log.txt', ' MAIN: ' + (new Date()).toISOString() + '\r\n', () => {});
