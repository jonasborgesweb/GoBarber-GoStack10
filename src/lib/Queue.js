import Bee from 'bee-queue';

// Importando as Configuraçẽos do Redis
import redisConfig from '../config/redis';

// Importando os Jobs
import CancellationMail from '../app/jobs/cancellationMail';

// Criando Array com os Jobs
const jobs = [CancellationMail];

class Queue {
    constructor() {
        this.queues = [];
        this.init();
    }

    // Inicializando a Fila
    init() {
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle,
            };
        });
    }

    // Adicionando novo item na Fila
    add(queue, job) {
        return this.queues[queue].bee.createJob(job).save();
    }

    // Processando a Fila
    processQueue() {
        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key];

            bee.on('failed', this.handleFailure).process(handle);
        });
    }

    // Listando os Erros da Aplicação
    handleFailure(job, err) {
        console.log(`Queue ${job.queue.name}: FAILED`, err);
    }
}

export default new Queue();
