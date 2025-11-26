import mongoose from "mongoose";
import Project from "~~/server/models/project.model";
const config = useRuntimeConfig();

const {
  mongodbURL,
  mongodbPassword,
  mongodbUsername,
  mongodbDatabase,
  mongodbAuthSource,
} = config;

export default defineEventHandler(async (event) => {
  const connectionString = `mongodb://${mongodbUsername}:${mongodbPassword}@${mongodbURL}/${mongodbDatabase}?authSource=${mongodbAuthSource}`;
  await mongoose.connect(connectionString);
  try {
    const result = await Project.find();
    return result;
  } catch (error) {
    return `Não foi possível executar a operação: ${error.message}`;
  }
});
