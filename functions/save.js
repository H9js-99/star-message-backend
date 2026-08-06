export default async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, msg: "仅允许POST" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    })
  }
  const DATABASE_URL = env.DATABASE_URL
  if (!DATABASE_URL) {
    return new Response(JSON.stringify({ ok: false, msg: "缺少数据库环境变量" }), { status:500 })
  }
  const body = await request.json()
  const content = body.content?.trim()
  if (!content) {
    return new Response(JSON.stringify({ ok: false, msg: "留言不能为空" }), { headers:{"Content-Type":"application/json"} })
  }

  const sql = `INSERT INTO messages(content) VALUES($1)`
  const res = await fetch(`${DATABASE_URL}`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ query:sql, params:[content] })
  })
  const result = await res.json()
  if(result.error){
    return new Response(JSON.stringify({ok:false,err:result.error}),{status:500})
  }
  return new Response(JSON.stringify({ok:true}),{headers:{"Content-Type":"application/json"}})
}
