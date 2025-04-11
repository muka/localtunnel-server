#!./node_modules/.bin/tsx

import 'dotenv/config';

import { InvalidArgumentError, program } from 'commander';
import { AddressInfo } from 'net';
import pkg from '../package.json' with { type: "json" };
import createServer from '../src/index.js';
import { newLogger } from '../src/lib/logger.js';

const logger = newLogger('server')

type CliOpts = {
  secure: boolean
  port: number
  address: string,
  domain: string,
  maxSockets: number,
}

const runServer = (opts: CliOpts) => {

  const server = createServer({
    max_tcp_sockets: opts.maxSockets,
    secure: opts.secure,
    domain: opts.domain,
  });

  server.listen(opts.port, opts.address, () => {
    const addr = server.address() as AddressInfo
    logger.info(`server listening on port: ${addr.port}`);
  });

  process.on('SIGINT', () => {
    // for nodemon to reload https://github.com/remy/nodemon#gracefully-reloading-down-your-script
    process.kill(process.pid, "SIGTERM");
  });

  process.on('uncaughtException', (err) => {
    logger.error(err);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(reason);
  });

}

const main = async () => {

  const intParser = (value) => {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new InvalidArgumentError('Not a number.');
    }
    return parsedValue;
  }

  program
    .name('localtunnel-server')
    .description('localtunnel server')
    .version(pkg.version)
    .option('--secure', 'use this flag to indicate proxy over https', false)
    .option('--port, -p <number>', 'listen on this port for outside requests', intParser, 80)
    .option('--address, -a <string>', 'IP address to bind to', '0.0.0.0')
    .option('--domain, -d <string>', 'Specify the base domain name. This is optional if hosting localtunnel from a regular example.com domain. This is required if hosting a localtunnel server from a subdomain (i.e. lt.example.dom where clients will be client-app.lt.example.come)')
    .option('--max-sockets', 'maximum number of tcp sockets each client is allowed to establish at one time (the tunnels)', intParser, 10)
    .action(runServer)

  program.parse();
}

main().catch(e => logger.error(e))
