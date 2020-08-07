import express from 'express';
import routes from './routes';
import cors from 'cors';


const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);


app.listen(3333);

/*
        MÉTODOS HTTP
GET: Buscar ou listar uma informação;
POST: Criar alguma informação;
PUT: Atualizar  uma informação existente;
DELETE: Deletar uma inf. existente

*/

/*
            PARAMETROS
Request Body: Corpo da requisição, dados para criar e atualizar um registro;
Route Parms: Identificar um recurso dentro da rota quero atualizar ou deletar;
Query Parms: Listagem, paginação;

*/
