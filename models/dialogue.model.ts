// import { Schema, model, Document } from 'mongoose';
//
// // Шаблон для шага диалога
// type DialogueStep = {
//     message: string;
//     options: { action: string; label: string }[];
// }
//
// // Шаблон для диалога
// type Dialogue = {
//     name: string;
//     steps: { [key: string]: DialogueStep };
// }
//
// // Схема для шага диалога
// const dialogueStepSchema = new Schema<DialogueStep>({
//     message: { type: String, required: true },
//     options: [
//         {
//             action: { type: String, required: true },
//             label: { type: String, required: true },
//         },
//     ],
// });
//
// // Схема для диалога
// const dialogueSchema = new Schema<Dialogue>({
//     name: { type: String, required: true },
//     steps: { type: Map, of: dialogueStepSchema, required: true },
// });
//
// // Модель
// // @ts-ignore
// export const DialogueModel = model<Dialogue & Document>('Dialogue', dialogueSchema);
