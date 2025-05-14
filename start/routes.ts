/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const IniciosController = () => import('#controllers/inicios_controller')
import router from '@adonisjs/core/services/router'
const DashboardController = () => import('#controllers/dashboard_controller')

import { middleware } from '#start/kernel'
import UsuariosController from '#controllers/usuarios_controller'
const AuthController = () => import('#controllers/auth_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/dashboard', [DashboardController, 'index']).use(
  middleware.auth({
    guards: ['api'],
  })
)
router.group(() => {
  router.post('/crear', [UsuariosController, 'crear'])
    
  })
  .prefix('/usuarios')
  .middleware([middleware.auth({ guards: ['api'] })])

router.get('inicio', [IniciosController, 'index'])

router.post('/login', [AuthController, 'login'])
