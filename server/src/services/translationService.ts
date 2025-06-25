// import { PrismaClient } from '@prisma/client';
// import { translate } from 'google-translate-api-x';

// const prisma = new PrismaClient();

// export interface TranslationResult {
//   id: string;
//   originalText: string;
//   translatedText: string;
//   sourceLang: string;
//   targetLang: string;
//   context: string;
// }

// export const translateText = async (
//   text: string,
//   targetLang: string,
//   userId: string,
//   pathId?: string,
//   nodeId?: string
// ): Promise<TranslationResult> => {
//   try {
//     // Check if translation already exists in cache
//     const existingTranslation = await prisma.translation.findFirst({
//       where: {
//         originalText: text,
//         targetLang: targetLang,
//         userId: userId,
//         ...(pathId && { pathId }),
//         ...(nodeId && { nodeId })
//       }
//     });

//     if (existingTranslation) {
//       return {
//         id: existingTranslation.id,
//         originalText: existingTranslation.originalText,
//         translatedText: existingTranslation.translatedText,
//         sourceLang: existingTranslation.sourceLang,
//         targetLang: existingTranslation.targetLang,
//         context: existingTranslation.context
//       };
//     }

//     // Perform translation using Google Translate API
//     const result = await translate(text, { to: targetLang });
    
//     const translatedText = result.text;
//     const sourceLang = result.from.language.iso;

//     // Store translation in database for caching
//     const translation = await prisma.translation.create({
//       data: {
//         originalText: text,
//         translatedText: translatedText,
//         sourceLang: sourceLang,
//         targetLang: targetLang,
//         context: nodeId ? 'node' : pathId ? 'path' : 'general',
//         userId: userId,
//         pathId: pathId,
//         nodeId: nodeId
//       }
//     });

//     return {
//       id: translation.id,
//       originalText: translation.originalText,
//       translatedText: translation.translatedText,
//       sourceLang: translation.sourceLang,
//       targetLang: translation.targetLang,
//       context: translation.context
//     };
//   } catch (error) {
//     console.error('Translation error:', error);
//     throw new Error('Translation failed');
//   }
// };

// export const getTranslationHistory = async (
//   userId: string,
//   pathId?: string,
//   nodeId?: string
// ) => {
//   return await prisma.translation.findMany({
//     where: {
//       userId: userId,
//       ...(pathId && { pathId }),
//       ...(nodeId && { nodeId })
//     },
//     orderBy: {
//       createdAt: 'desc'
//     },
//     take: 50 // Limit to last 50 translations
//   });
// };

// export const deleteTranslation = async (
//   translationId: string,
//   userId: string
// ) => {
//   return await prisma.translation.deleteMany({
//     where: {
//       id: translationId,
//       userId: userId
//     }
//   });
// }; 