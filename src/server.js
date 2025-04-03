import http from 'node:http'
import { jsonMidd } from './middleweres/jsonMidd.js'
import { routes } from './routes.js'


const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    await jsonMidd(req, res);

    const route = routes.find(route => {
        return route.method === method && route.path.test(url);
    });

    if (route) {
        const routeParams = req.url.match(route.path);
        req.params = { ...routeParams.groups }; // 🔹 Agora corretamente atribui req.params

        return route.handler(req, res);
    }

    res.writeHead(404).end();
});

server.listen(3333)