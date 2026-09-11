import * as migration_20260911_094802_initial from './20260911_094802_initial';

export const migrations = [
  {
    up: migration_20260911_094802_initial.up,
    down: migration_20260911_094802_initial.down,
    name: '20260911_094802_initial'
  },
];
