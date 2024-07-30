import express from 'express';

const todoRouter=express.Router();


todoRouter.post('/todos');
todoRouter.get('/todos');
todoRouter.put('/todos/:id');
todoRouter.delete('/todos/:id');

export default todoRouter;