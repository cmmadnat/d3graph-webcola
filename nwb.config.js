module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactNwbTest',
      externals: {
        react: 'React',
      },
    },
  },
  webpack: {
    extra: {

      entry: {
        demo: ['./demo/src/index.tsx'],
      },
      // entry: './src/index',
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
      module: {
        rules: [{ test: /\.tsx$/, loader: 'ts-loader' }],
      },
    },
  },
}
