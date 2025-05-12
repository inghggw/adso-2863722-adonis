import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '../models/user.js'
import hash from '@adonisjs/core/services/hash'

export default class UsuariosController {
  /**
   * Listar usuarios (paginados y sin contraseña)
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('perPage', 10)

      const usuarios = await Usuario.query().paginate(page, perPage)

      // Convertimos a JSON para trabajar con el objeto paginado
      const usuariosJson = usuarios.toJSON()

      // Limpiamos las contraseñas
      usuariosJson.data = usuariosJson.data.map(({ password, ...rest }) => rest)

      return response.ok(usuariosJson)
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      return response.internalServerError({
        message: 'No se pudo obtener la lista de usuarios',
      })
    }
  }

  /**
   * Mostrar un usuario por su ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const usuario = await Usuario.findOrFail(params.id)
      const { password, ...safeUsuario } = usuario.toJSON()
      return response.ok(safeUsuario)
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      return response.notFound({
        message: 'Usuario no encontrado',
      })
    }
  }

  /**
   * Crear un nuevo usuario
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['nombre', 'apellido', 'correo', 'celular', 'password', 'role'])

      if (data.password && data.password.trim() !== '') {
        data.password = await hash.make(data.password)
      } else {
        return response.badRequest({ message: 'La contraseña es obligatoria' })
      }

      const usuario = await Usuario.create(data)
      const { password, ...safeUsuario } = usuario.toJSON()
      return response.created(safeUsuario)
    } catch (error) {
      console.error('Error al crear usuario:', error)
      return response.badRequest({
        message: 'Error al crear el usuario',
        errors: error.messages || error.message,
      })
    }
  }

  /**
   * Actualizar un usuario existente
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const usuario = await Usuario.findOrFail(params.id)

      const data = request.only(['firstName', 'lastName', 'email', 'phone', 'password', 'role'])

      if (data.password && data.password.trim() !== '') {
        data.password = await hash.make(data.password)
      } else {
        delete data.password
      }

      usuario.merge(data)
      await usuario.save()

      const { password, ...safeUsuario } = usuario.toJSON()
      return response.ok(safeUsuario)
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      return response.badRequest({
        message: 'Error al actualizar usuario',
        errors: error.messages || error.message,
      })
    }
  }

  /**
   * Eliminar un usuario
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const usuario = await Usuario.findOrFail(params.id)
      await usuario.delete()

      return response.ok({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      return response.badRequest({ message: 'No se pudo eliminar el usuario' })
    }
  }
}
