import type { LayoutServerLoad } from './$types';

export const load:LayoutServerLoad = async({ cookies })=> {
    const theme:"dark"|"light" = cookies.get("theme") as "dark"|"light" | undefined || "light"    
    return { theme:theme }
}