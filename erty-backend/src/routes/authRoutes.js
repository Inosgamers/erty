const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validator');

// Public routes
router.post('/register',
  authLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('phone').optional().isMobilePhone().withMessage('Telefone inválido')
  ],
  validate,
  authController.register
);

router.post('/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória')
  ],
  validate,
  authController.login
);

router.post('/refresh-token',
  [body('refreshToken').notEmpty().withMessage('Refresh token é obrigatório')],
  validate,
  authController.refreshToken
);

// Protected routes
router.use(protect);

router.post('/logout', authController.logout);
router.get('/me', authController.getMe);
router.patch('/profile',
  [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('phone').optional().isMobilePhone(),
    body('currency').optional().isIn(['AOA', 'USD', 'EUR', 'BRL']),
    body('language').optional().isIn(['pt', 'en', 'fr'])
  ],
  validate,
  authController.updateProfile
);

router.patch('/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),
    body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres')
  ],
  validate,
  authController.changePassword
);

router.delete('/account', authController.deleteAccount);

module.exports = router;
