import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/task'),
        handler: (req, res) => {
            const tasks = database.select('task')

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/task:id'),
        handler: (req, res) => {
            const tasks = database.select('task')

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/task'),
        handler: (req, res) => {
            const { title, description } = req.body
            const newTask = {
                id: randomUUID(),
                title,
                description,
            }

            database.insert('task', newTask)
            return res.writeHead(201).end(JSON.stringify(newTask))
        }
    },

    {
        method: 'PUT',
        path: buildRoutePath('/task'),
        handler: (req, res) => {
            const tasks = database.select('task')

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/task/:id'),
        handler: (req, res) => {
            const { id } = req.params;
    
            const task = database.select('task').find(task => task.id === id);
    
            if (!task) {
                return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
            }
    
            database.delete('task', id)
    
            return res.writeHead(204).end();
        }
    }
]