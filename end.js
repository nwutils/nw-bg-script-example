require('fs').appendFile('log.txt', '  END: ' + (new Date()).toISOString() + '\r\n', () => {});
