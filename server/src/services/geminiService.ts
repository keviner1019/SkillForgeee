import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not configured');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface LearningPathStructure {
  title: string;
  description?: string;
  modules: {
    title: string;
    description?: string;
    order: number;
    nodes: {
      title: string;
      description: string;
      order: number;
      estimatedTime?: number;
    }[];
  }[];
}

export const generateLearningPath = async (
  topic: string,
  language: string = 'en'
): Promise<LearningPathStructure> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `As an expert learning architect and curriculum designer, create a comprehensive and structured learning path for the topic: "${topic}".

Please create a well-organized learning curriculum that breaks down the subject into logical modules and specific learning nodes. Each node should represent a concrete learning objective or skill that can be completed.

Respond with a JSON object in exactly this format:
{
  "title": "Learning ${topic}",
  "description": "A comprehensive learning path for mastering ${topic}",
  "modules": [
    {
      "title": "Module 1 Name",
      "description": "Brief description of what this module covers",
      "order": 1,
      "nodes": [
        {
          "title": "Specific Learning Node Title",
          "description": "Detailed description of what the learner will achieve in this node",
          "order": 1,
          "estimatedTime": 60
        }
      ]
    }
  ]
}

Requirements:
- Create 4-7 modules that progress logically from beginner to advanced
- Each module should have 3-6 specific learning nodes
- Nodes should be actionable and measurable learning objectives
- Include estimated time in minutes for each node (15-120 minutes)
- Descriptions should be clear and motivating
- Order the modules and nodes logically for progressive learning
- Focus on practical, hands-on learning where possible
- Consider prerequisite knowledge and build upon it

Language: Respond in ${language === 'en' ? 'English' : language}

Topic: ${topic}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Gemini response');
    }

    const learningPath = JSON.parse(jsonMatch[0]) as LearningPathStructure;

    // Validate the structure
    if (!learningPath.title || !learningPath.modules || !Array.isArray(learningPath.modules)) {
      throw new Error('Invalid learning path structure from Gemini');
    }

    return learningPath;
  } catch (error) {
    console.error('Error generating learning path with Gemini:', error);
    throw new Error('Failed to generate learning path');
  }
};

export const improveNodeDescription = async (
  nodeTitle: string,
  currentDescription: string,
  context: string = ''
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `As a learning expert, improve the following learning node description to make it more engaging, clear, and actionable.

Node Title: "${nodeTitle}"
Current Description: "${currentDescription}"
${context ? `Context: ${context}` : ''}

Please provide an improved description that:
- Is clear and specific about learning outcomes
- Is motivating and engaging for learners
- Includes practical steps or examples where appropriate
- Is concise but comprehensive (2-4 sentences)
- Uses active language

Respond only with the improved description, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error improving node description with Gemini:', error);
    return currentDescription; // Return original if improvement fails
  }
};

export const suggestRelatedTopics = async (topic: string): Promise<string[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Given the learning topic "${topic}", suggest 5-8 related topics that learners might be interested in exploring next. 

These should be:
- Complementary skills or knowledge areas
- Natural progressions or specializations
- Prerequisites that might be useful
- Adjacent fields or applications

Respond with a JSON array of topic names only, like:
["Topic 1", "Topic 2", "Topic 3"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return [];
    }

    return JSON.parse(jsonMatch[0]) as string[];
  } catch (error) {
    console.error('Error suggesting related topics with Gemini:', error);
    return [];
  }
}; 