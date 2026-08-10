import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    runes: true
  },
  kit: {
    // Adapter สำหรับ Vercel
    adapter: adapter()
  }
};

export default config;

