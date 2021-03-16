import { createLogger, Plugin } from 'vite';
import { ESLint } from 'eslint';
import { createFilter } from '@rollup/pluginutils';

import { checkVueFile, normalizePath, Options, isFormatter } from './utils';

const _eslint = new ESLint({});
type _ESLint = typeof _eslint;
type Constructor = new (options: ESLint.Options) => _ESLint;
let ESLintPnpify!: Constructor;

const isYarn2 = process.versions.pnp !== undefined;
if (isYarn2) {
  // do something with the PnP API ...
  /* eslint @typescript-eslint/no-var-requires:0 */
  const { createRequire, findPnpApi } = require('module');
  const targetModule = __dirname; // process.argv[1];
  const targetPnp = findPnpApi(targetModule);
  const targetRequire = createRequire(targetModule);
  const resolved = targetPnp.resolveRequest('eslint', targetModule);
  const _ESLintPnpify = targetRequire(resolved);
  if (Object.prototype.hasOwnProperty.call(_ESLintPnpify, 'ESLint')) {
    ESLintPnpify = _ESLintPnpify.ESLint;
  }
}

export default function eslintPlugin(options?: Options): Plugin {
  const defaultOptions: Options = {
    cache: true,
    fix: false,
    showWrap: {
      enable: true,
      showWhenNoERR: true,
      clear: false,
    },
    showErrAsWarn: true,
  };
  const opts = options ? { ...defaultOptions, ...options } : defaultOptions;

  let eslint: ESLint;
  if (isYarn2 === false) {
    eslint = new ESLint({
      cache: opts.cache,
      fix: opts.fix,
    });
  } else {
    eslint = new ESLintPnpify({
      cache: opts.cache,
      fix: opts.fix,
    });
  }

  const filter = createFilter(opts.include, opts.exclude || /node_modules/);
  let formatter: ESLint.Formatter;
  const logger = createLogger('info', true);

  return {
    name: 'vite:eslint',
    async transform(_, id) {
      const file = normalizePath(id);

      if (!filter(id) || (await eslint.isPathIgnored(file)) || checkVueFile(id)) {
        return null;
      }

      switch (typeof opts.formatter) {
        case 'string':
          formatter = await eslint.loadFormatter(opts.formatter);
          break;
        case 'function':
          ({ formatter } = opts);
          break;
        case 'object':
          if (isFormatter(opts.formatter)) {
            formatter = opts.formatter;
          }
          if (formatter === undefined) {
            throw new Error("opts.formatter's type should be ESLint.Formatter");
          }
          break;
        default:
          formatter = await eslint.loadFormatter('stylish');
      }

      const report = await eslint.lintFiles(file);
      const hasWarnings = report.some((item) => item.warningCount !== 0);
      const hasErrors = report.some((item) => item.errorCount !== 0);

      const filePath = report.length > 0 ? report[0].filePath : file;
      const start = `ESLint Start: ${filePath}`;
      const end = `ESLint End: ${filePath}`;
      const result = opts.showWrap?.enable
        ? [start, formatter.format(report), end].join('\n')
        : formatter.format(report);

      if (opts.fix && report) {
        ESLint.outputFixes(report);
      }

      if (opts.showWrap?.showWhenNoERR && !hasWarnings && !hasErrors) {
        logger.info(result, { clear: opts.showWrap.clear });
      }

      if (hasWarnings) {
        this.warn(result);
      }

      if (hasErrors) {
        if (opts.showErrAsWarn) {
          this.warn(result);
        } else {
          this.error(result);
        }
      }

      return null;
    },
  };
}
