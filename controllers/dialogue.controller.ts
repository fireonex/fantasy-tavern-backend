import { Request, Response } from 'express';

// Определение возможных шагов и веток диалога
//todo: вынести в бд
const dialogueSteps = {
    entry: {
        message: 'You have entered the tavern. There are many people around. What would you like to do?',
        options: [
            { action: 'talkToBarkeep', label: 'Talk to the barkeep' },
            { action: 'sitAtTable', label: 'Sit at a table' },
        ],
    },
    talkToBarkeep: {
        message: 'Barkeep: "Welcome, traveler! What can I get for you?"',
        options: [
            { action: 'orderAle', label: 'Order some ale' },
            { action: 'askForRumors', label: 'Ask about rumors' },
        ],
    },
    sitAtTable: {
        message: 'You sit at a table. Someone approaches and starts a conversation.',
        options: [
            { action: 'listenToStranger', label: 'Listen to the stranger' },
            { action: 'standUp', label: 'Stand up and leave' },
        ],
    },
    orderAle: {
        message: 'You ordered a mug of ale and enjoy its taste.',
        options: [],
    },
    askForRumors: {
        message: 'Barkeep: "There are rumors that strange creatures have been seen in the forests..."',
        options: [
            { action: 'investigateForest', label: 'Ask more about the forests' },
        ],
    },
    listenToStranger: {
        message: 'The stranger tells you a tale of lost treasure.',
        options: [
            { action: 'askMore', label: 'Ask for more details' },
        ],
    },
    standUp: {
        message: 'You stand up and leave the tavern.',
        options: [],
    },
    investigateForest: {
        message: 'You head into the forests to see what is happening there.',
        options: [],
    },
    askMore: {
        message: 'The stranger tells you more about the treasure, but asks for a reward for the information.',
        options: [
            { action: 'agreeToReward', label: 'Agree to pay for the information' },
            { action: 'refuseToPay', label: 'Refuse to pay' },
        ],
    },
    agreeToReward: {
        message: 'The stranger nods and gives you more details about the treasure location.',
        options: [
            { action: 'headToTreasure', label: 'Head to the treasure location' },
        ],
    },
    refuseToPay: {
        message: 'The stranger frowns and leaves in anger.',
        options: [
            { action: 'tryToApologize', label: 'Try to apologize' },
            { action: 'leaveTavern', label: 'Leave the tavern' },
        ],
    },
    tryToApologize: {
        message: 'The stranger seems to calm down a bit but still seems wary. He reluctantly agrees to share the treasure location.',
        options: [
            { action: 'headToTreasure', label: 'Head to the treasure location' },
        ],
    },
    leaveTavern: {
        message: 'You leave the tavern, feeling awkward about the encounter.',
        options: [],
    },
    headToTreasure: {
        message: 'You set off towards the treasure location. The journey ahead will be dangerous.',
        options: [
            { action: 'prepareForJourney', label: 'Prepare for the journey' },
        ],
    },
    prepareForJourney: {
        message: 'You gather your supplies and prepare yourself for the journey ahead.',
        options: [
            { action: 'startJourney', label: 'Start the journey' },
        ],
    },
    startJourney: {
        message: 'You begin your journey through the wilderness towards the treasure.',
        options: [],
    },
};


// Хранилище для состояний диалогов в памяти
const dialogueStateMemory: { [key: string]: { currentStep: string } } = {};

// Контроллер для обработки переходов между состояниями
export async function continueDialogue(req: Request, res: Response): Promise<void> {
    try {
        const { userId, characterId, action } = req.body;
        console.log('action: ', action);

        // Генерация ключа для хранения состояния в памяти
        const key = `${userId}-${characterId}`;

        // Получаем текущее состояние пользователя из памяти
        let dialogueState = dialogueStateMemory[key];
        console.log('dialogueState: ', dialogueState);

        // Если состояния еще нет, создаем начальное состояние
        if (!dialogueState) {
            dialogueState = { currentStep: 'entry' };
            dialogueStateMemory[key] = dialogueState;
        } else {
            // Получаем информацию о текущем шаге
            // @ts-ignore
            const currentStep = dialogueSteps[dialogueState.currentStep];

            // Если текущий шаг существует и имеет допустимые опции, обновляем шаг
            // @ts-ignore
            if (currentStep && currentStep.options.some(option => option.action === action)) {
                dialogueState.currentStep = action;
            } else {
                // Если действие не валидное, возвращаем ошибку
                res.status(400).json({ message: 'Invalid action' });
                return;
            }
        }

        // Получаем следующий шаг диалога
        // @ts-ignore
        const nextStep = dialogueSteps[dialogueState.currentStep];

        // Отправляем ответ с текущим сообщением и возможными вариантами
        res.status(200).json({
            message: nextStep.message,
            options: nextStep.options,
        });
    } catch (err) {
        console.error('Error during dialogue fetch:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
}

export function exitTavern(req: Request, res: Response): void {
    const { userId, characterId } = req.body;

    // Генерация ключа для хранения состояния в памяти
    const key = `${userId}-${characterId}`;

    // Удаляем состояние диалога из памяти
    delete dialogueStateMemory[key];

    // Ответ на завершение диалога
    res.status(200).json({ message: 'Вы покинули таверну. Диалог завершен.' });
}
