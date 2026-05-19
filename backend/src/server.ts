import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import router from './routes/api.routes';
import sequelize from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', router);

sequelize.authenticate()
  .then(() => console.log('✅ Banco de dados conectado!'))
  .catch((err) => console.error('❌ Erro ao conectar ao banco:', err));

sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tabelas sincronizadas!'))
  .catch((err) => console.error('❌ Erro ao sincronizar tabelas:', err));

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});