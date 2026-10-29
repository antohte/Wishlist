import type { IncomingMessage, ServerResponse } from 'node:http'
import { serveApi } from '../server/adapter.ts'
export default function handler(req:IncomingMessage & {body?:unknown},res:ServerResponse){return serveApi(req,res)}
