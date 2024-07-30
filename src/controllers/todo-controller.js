import Todo from '../models/Todo.js';
import { createSendResponse, sendResponse, getSecretStringandExpiresIn } from '../utils/user-utils.js';
import captureIp from '../middlewares/captureIp.js';

// Create a new to-do item
export const createTodo = async (req, res, next) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        const userId = req.user._id;

        const todo = new Todo({
            userId,
            title,
            description,
            status,
            priority,
            dueDate
        });

        await todo.save();
        
        const { secret, expiresIn, cookieExpires, cookieName } = getSecretStringandExpiresIn(req.path);
        createSendResponse(req.user, 201, res, secret, expiresIn, cookieExpires, cookieName, 'To-Do item created successfully', todo);
    } catch (err) {
        return sendResponse(res, 500, 'Error', err.message, null);
    }
};

// Get all to-do items for the logged-in user
export const getTodos = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const todos = await Todo.find({ userId });

        if (!todos.length) {
            return sendResponse(res, 404, 'Error', 'No to-do items found', null);
        }
        
        const { secret, expiresIn, cookieExpires, cookieName } = getSecretStringandExpiresIn(req.path);
        createSendResponse(req.user, 200, res, secret, expiresIn, cookieExpires, cookieName, 'To-Do items fetched successfully', todos);
    } catch (err) {
        return sendResponse(res, 500, 'Error', err.message, null);
    }
};

// Update a to-do item by ID
export const updateTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate } = req.body;

        const todo = await Todo.findByIdAndUpdate(
            id,
            { title, description, status, priority, dueDate },
            { new: true }
        );

        if (!todo) {
            return sendResponse(res, 404, 'Error', 'To-Do item not found', null);
        }
        
        const { secret, expiresIn, cookieExpires, cookieName } = getSecretStringandExpiresIn(req.path);
        createSendResponse(req.user, 200, res, secret, expiresIn, cookieExpires, cookieName, 'To-Do item updated successfully', todo);
    } catch (err) {
        return sendResponse(res, 500, 'Error', err.message, null);
    }
};

// Delete a to-do item by ID
export const deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByIdAndDelete(id);

        if (!todo) {
            return sendResponse(res, 404, 'Error', 'To-Do item not found', null);
        }
        
        const { secret, expiresIn, cookieExpires, cookieName } = getSecretStringandExpiresIn(req.path);
        createSendResponse(req.user, 200, res, secret, expiresIn, cookieExpires, cookieName, 'To-Do item deleted successfully', null);
    } catch (err) {
        return sendResponse(res, 500, 'Error', err.message, null);
    }
};

const todoController = { createTodo, getTodos, updateTodo, deleteTodo };

export default todoController;
