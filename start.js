require('fs').appendFile('log.txt', 'START: ' + (new Date()).toISOString() + '\r\n', () => {});
