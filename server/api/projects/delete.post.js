import mongoose from "mongoose";
import Project from "~~/server/models/project.model";
const config = useRuntimeConfig();

const { mongodbURL, mongodbPassword, mongodbUsername, mongodbDatabase, mongodbAuthSource} = config;

export default defineEventHandler(async (event) => {
  const connectionString = `mongodb://${mongodbUsername}:${mongodbPassword}@${mongodbURL}/${mongodbDatabase}?authSource=${mongodbAuthSource}`;
  await mongoose.connect(connectionString);

  const body = await readBody(event);
  const {number} = body;
  try {
    const response = await Project.findOneAndDelete({number:number});
    return response;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
