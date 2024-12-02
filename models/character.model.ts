import mongoose from 'mongoose';

const CharacterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },
    traits: {
        type: [String],
        enum: [
            'Brave', 'Honest', 'Kind', 'Loyal', 'Wise', 'Charismatic', 'Resilient', 'Generous', 'Courageous', 'Compassionate',
            'Curious', 'Independent', 'Ambitious', 'Reserved', 'Adventurous', 'Cautious', 'Observant', 'Determined', 'Diplomatic', 'Pragmatic',
            'Arrogant', 'Selfish', 'Greedy', 'Impulsive', 'Stubborn', 'Jealous', 'Vindictive', 'Cowardly', 'Deceitful', 'Lazy'
        ],
        validate: [(val: string[]) => val.length <= 3, 'You can select up to 3 traits'],
    },
    race: {
        type: String,
        enum: ['Human', 'High Elf', 'Wood Elf', 'Dwarf', 'Orc'],
        required: true,
    },
    socialClass: {
        type: String,
        enum: ['Peasant', 'Warrior', 'Healer', 'Merchant', 'Guard', 'Archer', 'Mage', 'Noble', 'Lord', 'Thief'],
        required: true,
    },
    backstory: {
        type: String,
        required: false,
        maxlength: [500, 'Backstory cannot exceed 500 symbols'],
    },
    photo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'characterPhotos',
        required: false,
    },

});

const Character = mongoose.model('Character', CharacterSchema);
export default Character;
