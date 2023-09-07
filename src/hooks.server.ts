import mdbHooks from "mdbCMS/lib/hooks.server"
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

export const handle:Handle = sequence(mdbHooks)

// export const handle = async({event,resolve}) => {
//     return resolve(event)
// }