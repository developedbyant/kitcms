import db from 'mdbCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ApiSettingUpdate } from "mdbCMS/types"

export const POST: RequestHandler = async (event) => {
    const inputData:ApiSettingUpdate['input'] = await event.request.json()
    const appCol = db.collection("_App")
    // update settings
    const dataToSet = {
        "data.assetsPerPage":inputData.assetsPerPage,
        "data.routesPerPage":inputData.routesPerPage,
        "data.objectsPerPage":inputData.objectsPerPage,
        "data.usersPerPage":inputData.usersPerPage,
    }
    const updateRes = await appCol.updateOne({ key:"app"},{$set:dataToSet})
    if(updateRes.acknowledged){
        // update locals
        event.locals.mdbCMS.appData.assetsPerPage = inputData.assetsPerPage
        event.locals.mdbCMS.appData.routesPerPage = inputData.routesPerPage
        event.locals.mdbCMS.appData.objectsPerPage = inputData.objectsPerPage
        // return response
        const response:ApiSettingUpdate['output'] = {
            error:false,
            message:"Settings updated",
            data:inputData
        }
        return json(response);
    }
    const response:ApiSettingUpdate['output'] = {
        error:true,
        message:"Something went wrong"
    }
    return json(response);
};