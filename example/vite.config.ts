import { defineConfig, mergeConfig, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import { Linter } from 'eslint';

export default ({ command, mode }) => {
  console.log(`command:${command}, mode:${mode}`);
  const baseConfig = defineConfig({
    plugins: [
      vue(),
      eslint({
        cache: false,
        fix: false,
        formatter: 'visualstudio',
        include: ['./*.ts', './*.vue'],
      }),
    ],
    clearScreen: true,
    build: {
      lib: {
        entry: 'main.ts',
        name: 'example',
        formats: ['es'],
      },
      minify: false,
    },
  });
  let cfg: UserConfig = {};
  if (command === 'serve') {
    cfg = defineConfig({
      // serve specific config
    });
  } else {
    cfg = defineConfig({
      // build specific config
    });
  }
  return mergeConfig(baseConfig, cfg);
};
