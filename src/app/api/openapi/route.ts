import { NextResponse } from 'next/server';

// Placeholder for OpenAPI implementation
export async function GET() {
  // This would return OpenAPI documentation in a real implementation
  return NextResponse.json({
    openapi: '3.0.0',
    info: {
      title: 'Seasoning Management API',
      version: '0.1.0',
      description: 'API for managing seasonings and templates'
    },
    paths: {
      // Placeholder paths will be added here
      '/api/seasoning': {
        get: {
          summary: 'Get all seasonings',
          responses: {
            '200': {
              description: 'List of seasonings',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
}