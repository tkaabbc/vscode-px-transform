// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/extension.ts',
  output: {
    dir: 'out',
    format: 'cjs',
    sourcemap: true,
    preserveModules: true, // 保留模块目录结构
  },
  plugins: [typescript()],
};
