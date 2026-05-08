import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AXON Medical API",
      version: "2.0.0",
      description: "Medical platform API documentation",
    },
    servers: [
      {
        url: `${process.env.APP_URL}/api/v2`,
        description: "Current server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
