import imagePipeline from './scripts/vite-image-pipeline.mjs';

export default ({command}) => ({
  // Originals stay in public/. The build plugin copies only serving variants.
  publicDir: command === 'build' ? false : 'public',
  plugins: [imagePipeline()],
  build: {emptyOutDir: true},
});
