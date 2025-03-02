import {Router} from 'express'
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/user.controller.js'
const usersRouter = Router()

usersRouter.get('/', getUsers)
usersRouter.get('/:uid', getUser)
usersRouter.post('/', createUser)
usersRouter.put('/:uid', updateUser)
usersRouter.delete('/:uid', deleteUser)

export default usersRouter