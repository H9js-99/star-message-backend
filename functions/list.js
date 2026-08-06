export default async function onRequest({env}) {
  const DATABASE_URL = env.DATABASE_URL
  const sql = `SELECT id,content,created_at FROM messages ORDER BY created_at DESC LIMIT 50`
  const resp = await fetch(DATABASE_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({query:sql})
  })
  const data = await resp.json()
  return new Response(JSON.stringify(data.rows ?? []),{
    headers:{"Content-Type":"application/json"}
  })
}
