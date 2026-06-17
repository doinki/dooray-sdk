#!/usr/bin/env node

import { runMain } from 'citty';

import main from './dist/index.js';

process.setSourceMapsEnabled(true);

runMain(main);
