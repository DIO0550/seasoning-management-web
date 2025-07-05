import { NextResponse } from "next/server";

// Placeholder for OpenAPI implementation
export async function GET() {
  // This would return OpenAPI documentation in a real implementation
  return NextResponse.json({
    openapi: "3.0.0",
    info: {
      title: "Seasoning Management API",
      version: "0.1.0",
      description: "API for managing seasonings and templates",
    },
    paths: {
      // Placeholder paths will be added here
      "/api/seasoning": {
        get: {
          summary: "Get all seasonings",
          responses: {
            "200": {
              description: "List of seasonings",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Add a new seasoning",
          description:
            "Create a new seasoning with name, type, and optional image",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "type"],
                  properties: {
                    name: {
                      type: "string",
                      maxLength: 20,
                      pattern: "^[a-zA-Z0-9]+$",
                      description: "調味料名（半角英数字、最大20文字）",
                    },
                    type: {
                      type: "string",
                      enum: [
                        "salt",
                        "sugar",
                        "pepper",
                        "vinegar",
                        "soySauce",
                        "other",
                      ],
                      description: "調味料の種類",
                    },
                    image: {
                      type: "string",
                      format: "byte",
                      description:
                        "調味料の画像（Base64エンコード、JPEG/PNG、最大5MB）",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Seasoning created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        description: "生成された調味料ID",
                      },
                      name: {
                        type: "string",
                        description: "調味料名",
                      },
                      type: {
                        type: "string",
                        description: "調味料の種類",
                      },
                      image: {
                        type: "string",
                        description: "調味料の画像（Base64エンコード）",
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        description: "作成日時",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad Request - Validation Error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "エラーメッセージ",
                      },
                      details: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            description: "調味料名のバリデーションエラー",
                          },
                          type: {
                            type: "string",
                            description: "調味料の種類のバリデーションエラー",
                          },
                          image: {
                            type: "string",
                            description: "画像のバリデーションエラー",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Internal Server Error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "システムエラーが発生しました",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}
