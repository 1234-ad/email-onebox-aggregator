import { Router } from 'express';
import * as emailController from '../controllers/email.controller';

const router = Router();

router.get('/', emailController.getEmails);
router.get('/search', emailController.searchEmails);
router.get('/:id', emailController.getEmailById);
router.post('/:id/categorize', emailController.categorizeEmail);

export default router;
