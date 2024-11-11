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
        validate: [(val: string[]) => val.length <= 3, 'You can select up to 3 traits'],
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
});

const Character = mongoose.model('Character', CharacterSchema);
export default Character;