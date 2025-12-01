import mongoose from "mongoose";
import EffortModule from "~~/server/models/effortModule.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);

  const body = await readBody(event);
  const {value} = body;
  try {
    const response = await EffortModule.findOneAndDelete({value:value});
    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
