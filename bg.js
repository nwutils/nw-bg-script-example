require('fs').appendFile('log.txt', '   BG: ' + (new Date()).toISOString() + '\r\n', () => {});
