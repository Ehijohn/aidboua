const TerminalAfrica = require('terminal-africa');

// Initialize Terminal Africa with configuration
const terminal = new TerminalAfrica({
  secretKey: process.env.TERMINAL_AFRICA_SECRET_KEY,
  url: process.env.TERMINAL_AFRICA_URL,
});

module.exports = terminal;