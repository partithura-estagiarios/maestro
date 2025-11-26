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
  const body = await readBody(event);

  try {
    const exists = await Project.exists({ number: body.number });
    if (!exists) {
      const newProject = new Project({
        number: body.number,
        query: body.query,
        name: body.name,
        isActive: body.isActive,
      });
      const response = await newProject.save(); // Salvar a nova issue no banco
      return response;
    } else {
      throw createError({
        statusCode: 500,
        message: "Já existe um projeto com esse identificador",
      });
    }
  } catch (error) {
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
              $ne: body.number,
            },
          },
          {
            $set: { isActive: false },
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
  }
});
