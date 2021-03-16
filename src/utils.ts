import qs from 'querystring';
import path from 'path';
import type { ESLint } from 'eslint';

export interface Options {
  cache?: boolean;
  /** auto fix source code */
  fix?: boolean;
  /** a single file, or array of files, to include when linting. */
  include?: string | string[];
  /** a single file, or array of files, to exclude when linting. */
  exclude?: string | string[];
  /** custom error formatter or the name of a built-in formatter. */
  formatter?: string | ESLint.Formatter;
  /** Show `ESLint Start: ${filePath}` and `ESLint End: ${filePath}`
   * around the formatter's output.*/
  showWrap?: {
    enable: boolean;
    /** Show wrap message even if there is no error
     * (*help VSCode problemMatcher to clear problems in problem panel*) )
     */
    showWhenNoERR?: boolean;
    clear?: boolean;
  };
  /** If show err in vite, vite will stop lint other files.
   *  Set this to true, all files will be lint.
   */
  showErrAsWarn?: boolean;
}

export function normalizePath(id: string): string {
  return path.relative(process.cwd(), id).split(path.sep).join('/');
}

export function checkVueFile(id: string): boolean {
  if (!id.includes('?')) return false;

  const rawQuery = id.split('?', 2)[1];

  return qs.parse(rawQuery).vue !== null ? true : false;
}

export function isFormatter(object: Options['formatter']): object is ESLint.Formatter {
  switch (typeof object) {
    case 'object':
      return 'format' in object;
    case 'string':
    case 'undefined':
    default:
      return false;
  }
}
