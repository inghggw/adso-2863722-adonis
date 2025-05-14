import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsuariosController { 
    async crear ({request, response}: HttpContext){
        const guardarData = request.only(['nombre', 'apellido', 'correo', 'celular', 'password'])
        const userModel = await User.create(guardarData)
        return response.created(userModel)
    }
} 