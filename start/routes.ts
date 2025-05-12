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

router
  .group(() => {
    router.get('', async (ctx) => {
      // Usamos import() con tipado explícito para el controlador
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      const controller = new UsuariosController()
      return controller.index(ctx) // Llamamos al método index de la instancia del controlador
    })

    router.get('/:id', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      const controller = new UsuariosController()
      return controller.show(ctx) // Llamamos al método show de la instancia del controlador
    })
  })
  .prefix('/users') // Agregamos el prefijo '/users' para las rutas del grupo
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

router
  .group(() => {
    router.get('', async (ctx) => {
      // Usamos import() con tipado explícito para el controlador
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      const controller = new UsuariosController()
      return controller.index(ctx) // Llamamos al método index de la instancia del controlador
    })

    router.get('/:id', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      const controller = new UsuariosController()
      return controller.show(ctx) // Llamamos al método show de la instancia del controlador
    })

    router.post('', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      const controller = new UsuariosController()
      return controller.store(ctx) // Llamamos al método store de la instancia del controlador
    })

    router.put('/:id', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      const controller = new UsuariosController()
      return controller.update(ctx) // Llamamos al método update de la instancia del controlador
    })

    router.delete('/:id', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      const controller = new UsuariosController()
      return controller.destroy(ctx) // Llamamos al método destroy de la instancia del controlador
    })
  })
  .prefix('/usuarios')
  .middleware([middleware.auth({ guards: ['api'] })])

router.get('inicio', [IniciosController, 'index'])

router.post('/login', [AuthController, 'login'])
