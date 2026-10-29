import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { serveApi } from './server/adapter.ts'

export default defineConfig(({mode})=>{
  const env=loadEnv(mode,process.cwd(),'')
  for(const key of ['ADMIN_EMAIL','ADMIN_PASSWORD_HASH','SESSION_SECRET','STORAGE_MODE','DATA_DIR','BLOB_READ_WRITE_TOKEN'])if(env[key])process.env[key]=env[key]
  return {
    plugins: [react(), tailwindcss(),{
      name:'wishlist-api',
      configureServer(server){server.middlewares.use('/api/manage',(req,res)=>{req.url=`/api/manage${req.url??''}`;void serveApi(req,res)})},
      configurePreviewServer(server){server.middlewares.use('/api/manage',(req,res)=>{req.url=`/api/manage${req.url??''}`;void serveApi(req,res)})},
    }],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  }
})
