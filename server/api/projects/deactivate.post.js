import mongoose from "mongoose";
import Project from "~~/server/models/project.model";
const config = useRuntimeConfig();

const { mongodbURL, mongodbPassword, mongodbUsername, mongodbDatabase, mongodbAuthSource} = config;

export default defineEventHandler(async (event) => {
  const connectionString = `mongodb://${mongodbUsername}:${mongodbPassword}@${mongodbURL}/${mongodbDatabase}?authSource=${mongodbAuthSource}`;
  await mongoose.connect(connectionString);

  const body = await readBody(event);
  try {
    const exists = await Project.exists({ number: body.number });
    if (!exists) {
      throw createError({
        statusCode: 400,
        message: "Projeto não encontrado",
      });
    } else {
      const newProject = Project.updateMany(
        {
          number: {
            $ne: body.number
          },
        },
        {
          $set: { isActive:false }
        }
      );
      return newProject;
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
