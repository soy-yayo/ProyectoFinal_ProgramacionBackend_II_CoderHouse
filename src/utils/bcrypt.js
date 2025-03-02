import { hashSync, compareSync } from "bcrypt";
export const createHash = (password) => hashSync(password, 10)
export const validatePassword = (password, passwordBDD) => compareSync(password, passwordBDD)