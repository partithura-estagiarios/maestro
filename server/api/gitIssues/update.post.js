import { Octokit } from "octokit";
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const organizationName = config.organizationName;
  const field_id = 185093514; //Field ID do campo dificuldade consolidada

  // Verifica se organizationName está definido
  if (!organizationName) {
    throw createError({
      statusCode: 500,
      message: "organizationName não está configurado no runtimeConfig.",
    });
  }

  // Extrai o token do header
  const authHeader = getHeader(event, "authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Token de autorização ausente ou inválido.",
    });
  }
  const token = authHeader.substring(7); // Remove "Bearer "

  // Extrai o corpo da requisição
  const body = await readBody(event);
  const { projectNumber, issueNumber, dificuldade } = body;

  if (typeof projectNumber !== "number" || typeof dificuldade !== "number") {
    throw createError({
      statusCode: 400,
      message: "projectNumber e dificuldade devem ser números.",
    });
  }


  try {

    const octokit = new Octokit({
        auth: token,
    });

    const item = await octokit.request("GET /orgs/{org}/projectsV2/{project_number}/items",{
        org:organizationName,
        project_number:projectNumber,
        q:`#${issueNumber}`
    })
    const itemId = item.data[0]?.id
    
    const response = await octokit.request("PATCH /orgs/{org}/projectsV2/{project_number}/items/{item_id}",{
        org:organizationName,
        project_number: projectNumber,
        item_id:itemId,
        fields:[
            {
                id:field_id, //field dificuldade consolidada
                value:dificuldade
            }
        ]
      })


    if (response.errors) {
      throw createError({
        statusCode: 500,
        message: `Erro na atualização do campo: ${response.errors
          .map((e) => e.message)
          .join("; ")}`,
      });
    }

    return {
      success: true,
      message: "Campo atualizado com sucesso.",
      value: dificuldade,
      response
    };
  } catch (error) {
    console.error("Erro ao atualizar campo no projeto do GitHub:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro interno ao processar a requisição.",
    });
  }
});
