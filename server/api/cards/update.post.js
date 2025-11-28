import mongoose from "mongoose";
import Card from "~~/server/models/card.model";
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
  // Obter o token do header Authorization
  const body = await readBody(event);

  try {
    const exists = await Card.exists({ value: body.value });
    if (!exists) {
      throw createError({
        statusCode: 400,
        message: "Carta não encontrada",
      });
    } else {
      const newCard = Card.findOneAndUpdate(
        {
          value: body.value,
        },
        {
          minimumValue: body.minimumValue,
          maximumValue: body.maximumValue,
          tooltip: body.tooltip,
          color: body.color,
        }
      );
      return newCard;
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
