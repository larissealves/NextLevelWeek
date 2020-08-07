import {   Request, Response } from  'express';
import db from '../databases/connection';


export default class ConnectionsController {
    async index (request:Request, response:Response) {
        const totalConnections = await db('connections').count('* as total');

        const { total } = totalConnections[0]; //todo retorno é um arry, então como esse será  único, ppega a primeira pos.
    
        return response.json({ total });
    
    }

    async create(request:Request, response:Response) {
        const { user_id } = request.body;

        await db('connections').insert({
            user_id,
        })

        return response.status(201).send();
    }

}

