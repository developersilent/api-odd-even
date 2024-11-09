import { Hono } from 'hono'

const app = new Hono()

enum OddEven {
  ODD = "odd",
  EVEN = "even",
}

app.get("/", async (c) => {
  return c.json({ message: "/play make req and send raw json use the key 'number' and provide random number" })
})

interface Payload {
  number: number
}

app.post("/play", async (c) => {
  let data: Payload
  try {
    data = await c.req.json()
  } catch (error) {
    return c.json({ error: "Invalid JSON input" }, { status: 400 })
  }

  if (!data) {
    return c.json({ error: "Number not provided or invalid" }, { status: 400 })
  }

  const randomNumber = Math.floor(Math.random() * 100) + 1
  if (data.number <= 0) {
    return c.json({ error: "Negative number or 0 not allowed" }, { status: 400 })
  }
  if (randomNumber % 2 === 0) {
    return c.json({ result: OddEven.EVEN }, { status: 200 })
  } else {
    return c.json({ result: OddEven.ODD }, { status: 200 })
  }
})

export default app