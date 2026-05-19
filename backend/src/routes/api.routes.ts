import { Router, Request, Response } from 'express';
import User from '../modeles/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { constAuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * GET /api/health
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/hello
 */
router.get('/hello', (req: Request, res: Response) => {
  res.json({
    message: 'Hello from Express Backend!'
  });
});

/**
 * POST /api/register
 */
router.post('/register', async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;
  const user = await User.create({ nome, email, senha });
  res.status(201).json({ message: 'Usuário criado com sucesso!', id: user.id });
});

/**
 * POST /api/login
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user && await bcrypt.compare(senha, user.senha)) {
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.SECRET_KEY as string, { expiresIn: '30d' });
    return res.json({ auth: true, token });
  }

  res.status(401).json({ message: 'Credenciais inválidas' });
});

/**
 * GET /api/perfil (protegida)
 */
router.get('/perfil', constAuthMiddleware, (req: Request, res: Response) => {
  res.json({
    message: 'Acesso autorizado',
    userId: req.user?.id
  });
});

/**
 * PUT /api/user (protegida)
 */
router.put('/user', constAuthMiddleware, async (req: Request, res: Response) => {
  const { nome, email } = req.body;
  const userId = req.user?.id;

  await User.update({ nome, email }, { where: { id: userId } });
  res.json({ message: 'Dados atualizados com sucesso!' });
});

/**
 * DELETE /api/user (protegida)
 */
router.delete('/user', constAuthMiddleware, async (req: Request, res: Response) => {
  const userId = req.user?.id;

  await User.destroy({ where: { id: userId } });
  res.json({ message: 'Conta removida do sistema.' });
});

export default router;