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
  const body = await readBody(event);

  try {
    const exists = await Card.exists({ value: body.value });
    if (!exists) {
      const newCard = new Card({
        value: body.value,
        minimumValue: body.minimumValue,
        maximumValue: body.maximumValue,
        color: body.color,
      });
      const response = await newCard.save(); // Salvar a nova issue no banco
      return response;
    } else {
      throw createError({
        statusCode: 500,
        message: "Já existe uma carta com esse valor",
      });
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});
