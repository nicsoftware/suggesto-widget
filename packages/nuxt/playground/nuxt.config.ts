export default defineNuxtConfig({
  modules: ['../src/module'],
  suggesto: {
    boardId: process.env.SUGGESTO_BOARD_ID || 'demo-board-id',
    baseUrl: 'https://suggesto.io'
  },
  devtools: { enabled: true }
});
