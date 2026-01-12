import mongoose from "mongoose";
import Organization from "~~/server/models/organization.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
    await mongoose.connect(env.MONGODB_CONNECTION_STRING);
    const body = await readBody(event);
    try {
        const newOrganization = new Organization({
            number: body.number,
            name: body.name,
        });
        const response = await newOrganization.save();
        return response;
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Não foi possível executar a operação: ${error.message}`,
        });
    }
});
