const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    description: {
        type: String,
        required: [true, 'Enter the description...'],
        lowercase: true,
    },
    completed: {
        type: Boolean,
        required: [true, "completed or not completed?"],
        lowercase: true,
    },
    deadline: {
        type: Date,
        required: [true, "Enter date"],
    }
});
const Task = mongoose.model('task', taskSchema);
module.exports = Task;