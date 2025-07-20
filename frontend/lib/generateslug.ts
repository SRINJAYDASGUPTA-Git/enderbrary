import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6)
export const generateSlug = () => nanoid()
