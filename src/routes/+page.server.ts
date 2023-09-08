import Fetcher from "svelteCMS/lib/fetcher.server";

export const load = async(event) => {
    const fetcher = new Fetcher()
    // const tags = await fetcher.tags({},{ title:true,slug:true})
    return { tags:[] }
}