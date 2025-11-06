import { Router } from 'express';
import * as accountController from '../controllers/account.controller';

const router = Router();

router.get('/', accountController.getAccounts);
router.post('/sync', accountController.syncAccounts);

export default router;
