// Placeholder for resolvers - this would connect to a database in a real implementation

interface Seasoning {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  expirationDate?: string;
  notes?: string;
}

interface Template {
  id: string;
  name: string;
  seasoningIds: string[];
  description?: string;
}

// Mock data
const seasonings: Seasoning[] = [];
const templates: Template[] = [];

export const resolvers = {
  Query: {
    seasonings: () => seasonings,
    seasoning: (_: unknown, { id }: { id: string }) => seasonings.find(s => s.id === id),
    templates: () => templates,
    template: (_: unknown, { id }: { id: string }) => templates.find(t => t.id === id),
  },
  Mutation: {
    createSeasoning: (_: unknown, data: Omit<Seasoning, 'id'>) => {
      const newSeasoning = { id: String(Date.now()), ...data };
      seasonings.push(newSeasoning);
      return newSeasoning;
    },
    updateSeasoning: (_: unknown, { id, ...data }: Seasoning) => {
      const index = seasonings.findIndex(s => s.id === id);
      if (index === -1) throw new Error('Seasoning not found');
      
      seasonings[index] = { ...seasonings[index], ...data };
      return seasonings[index];
    },
    deleteSeasoning: (_: unknown, { id }: { id: string }) => {
      const index = seasonings.findIndex(s => s.id === id);
      if (index === -1) return false;
      
      seasonings.splice(index, 1);
      return true;
    },
    createTemplate: (_: unknown, data: Omit<Template, 'id'>) => {
      const newTemplate = { id: String(Date.now()), ...data };
      templates.push(newTemplate);
      return newTemplate;
    },
    updateTemplate: (_: unknown, { id, ...data }: Template) => {
      const index = templates.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Template not found');
      
      templates[index] = { ...templates[index], ...data };
      return templates[index];
    },
    deleteTemplate: (_: unknown, { id }: { id: string }) => {
      const index = templates.findIndex(t => t.id === id);
      if (index === -1) return false;
      
      templates.splice(index, 1);
      return true;
    },
  },
  Template: {
    seasonings: (template: Template) => {
      return template.seasoningIds.map(id => 
        seasonings.find(s => s.id === id)
      ).filter(Boolean);
    }
  }
};