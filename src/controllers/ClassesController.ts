import {   Request, Response } from  'express';

import db from '../databases/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';


interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController {
   
   async index(request:Request, response:Response) {
       const filters = request.query;

       const subject = filters.subject as string;
       const week_day = filters.week_day as string;
       const time = filters.time as string;

       if (!filters.week_day || !filters.subject || !filters.time) {
           return response.status(400).json({
               error: 'Missing Filters To Search Classes'
           });
       }

       const timeInMinute = convertHourToMinutes(time)
       
       const classes = await db('classes') // listagem com os filtros
        .whereExists(function () {
            this.select('class_schedule.*')
                .from('class_schedule')
                .whereRaw('`class_schedule`.`class_id` = `classes`.`id`') // o "." indica que a coluna "class_id" esta na tabela "class_schedule" for igual ao class.id vindo classes(1ªlinha)
                .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                .whereRaw('`class_schedule`.`from` <= ??', [timeInMinute])// espera-se que o professor comece a tarabalhar antes ou pelo menos no msm horario que o usuário deseja estudar/ter aulas 
                .whereRaw('`class_schedule`.`to` > ??', [timeInMinute])// o usuário não deve marcar um horario superior ao de trabalho do professor
        
        })
        .where('classes.subject', '=', subject)
        .join('users', 'classes.user_id', '=', 'user_id')
        .select(['classes.*', 'users.*']);


       return response.json(classes);
  
    }

    async create (request:Request, response:Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        const trx = await db.transaction();
   
        try {
            const insertUsersIds = await trx('users').insert({ // retorna o Id dos users inseridos
                name,
                avatar,
                whatsapp,
                bio,
            });
        
            const user_id = insertUsersIds[0];
        
            const insertclassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id,
            });
        
            const class_id = insertclassesIds[0];
        
            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => ({
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to),       
                }
            ));
        
            await trx('class_schedule').insert(classSchedule);
        
        
            await trx.commit();
            
            return response.send();
        
        } catch (err) {
    
            await trx.rollback(); // caso apresente erros, as transações do BD são desfeitas aqui
    
            return response.status(400).json({
                'error': 'Unexpected error while creating new class'        
            })
        }
    }
}