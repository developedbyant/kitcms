import mdbHooks from "svelteCMS/lib/hooks.server"
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

export const handle:Handle = sequence(mdbHooks)