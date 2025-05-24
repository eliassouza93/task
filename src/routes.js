import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"
import fs from 'node:fs'

function exportTaskCSV(tasks) {
    const header = 'id,title,description\n'
    const rows = tasks.map(task => `${task.id},"${task.title}","${task.description}"`).join('\n')
    const csvContainer = header + rows

    fs.writeFileSync('./tasks.csv', csvContainer, 'utf-8')

}

function deleteTaskCSV(tasks) {
    const header = 'id,title,description\n'
    const rows = tasks.map(task => `${task.id},"${task.title}","${task.description}"`).join('\n')
    const csvContent = header + rows

    fs.writeFileSync('./tasks.csv', csvContent, 'utf-8')
}

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

            const allTasks = database.select('task')
            exportTaskCSV(allTasks)

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
        method: 'PATCH',
        path: buildRoutePath('/task/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const task = database.select('task').find(task => task.id === id);

            if (!task) {
                return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
            }

            database.update('task', id, { completed: true })

            const updatedTasks = database.select('task')
            exportTaskCSV(updatedTasks)

            return res.end(JSON.stringify({ message: 'Tarefa completa' }))
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

            const remainingTasks = database.select('task')
            deleteTaskCSV(remainingTasks)

            return res.writeHead(204).end()
        }
    }
]