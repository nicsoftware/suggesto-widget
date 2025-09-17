/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUGGESTO_BOARD_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
