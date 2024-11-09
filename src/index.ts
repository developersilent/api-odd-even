import { Hono } from 'hono'

const app = new Hono()

enum OddEven {
  ODD = "odd",
  EVEN = "even",
}

app.get("/", async (c) => {
  return c.json({
    message: "Send a POST request to '/play' with a JSON payload containing the key 'number'. Provide a positive integer, and the server will respond with whether the sum of your number and a randomly generated number is odd or even."
  })
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

  // Validate the number field
  if (typeof data.number !== 'number' || isNaN(data.number) || data.number <= 0 || !Number.isInteger(data.number)) {
    return c.json({ error: "Invalid input: 'number' must be a positive integer" }, { status: 400 })
  }

  const randomNumber = Math.floor(Math.random() * 100) + 1
  const sum = data.number + randomNumber
  const isEven = sum % 2 === 0

  return c.json({
    yourNumber: data.number,
    randomNumber: randomNumber,
    sum: sum,
    result: isEven ? OddEven.EVEN : OddEven.ODD
  })
})

export default app
