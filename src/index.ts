import { Hono } from 'hono'

const app = new Hono()

let computerRole = ""

enum OddEven {
    ODD = "odd",
    EVEN = "even",
}

let oddSum = 0
let evenSum = 0
let sum = 0
app.get("/", async (c) => {
    return c.json({
        message: "Send a POST request to '/play' with a JSON payload containing the key 'number' and 'userIsWhat'. Provide a positive integer between 1 and 10, and the server will respond based on the total sum (odd or even)."
    })
})

interface Payload {
    number: number,
    userIsWhat: "odd" | "even"
}
let tempWin = 0
app.post("/play", async (c) => {
    let data: Payload
    try {
        data = await c.req.json()
    } catch (error) {
        return c.json({ error: "Invalid JSON input" }, { status: 400 })
    }

    // Validate the number field for user input between 1 and 10
    if (typeof data.number !== 'number' || isNaN(data.number) || data.number < 1 || data.number > 10 || !Number.isInteger(data.number)) {
        return c.json({ error: "Invalid input: 'number' must be an integer between 1 and 10" }, { status: 400 })
    }

    if (data.userIsWhat !== "odd" && data.userIsWhat !== "even") {
        return c.json({ error: "Invalid input: 'userIsWhat'" }, { status: 400 })
    }

    const randomNumber = Math.floor(Math.random() * 10) + 1
    if (data.userIsWhat === OddEven.ODD) {
        while (randomNumber !== data.number){
            oddSum += randomNumber + data.number
            computerRole = OddEven.EVEN
            tempWin++
            if (tempWin === 3) {
                tempWin = 0
                return c.json({
                    Backend: computerRole,
                    backendChose: randomNumber,
                    userChose: data.number,
                    userRole: data.userIsWhat,
                    oddSum: oddSum,
                    winCount: 3,
                    message: "You win, best of 3"
                }, { status: 200 })
            }
            return c.json({
                Backend: computerRole,
                backendChose: randomNumber,
                userChose: data.number,
                userRole: data.userIsWhat,
                oddSum: oddSum,
                tempWin: tempWin,
            }, { status: 200 })
        }
        tempWin = 0
    }

    if (data.userIsWhat === OddEven.EVEN) {
        while (randomNumber !== data.number){
            oddSum += randomNumber + data.number
            computerRole = OddEven.ODD
            tempWin++
            if (tempWin === 3) {
                tempWin = 0
                return c.json({
                    Backend: computerRole,
                    backendChose: randomNumber,
                    userChose: data.number,
                    userRole: data.userIsWhat,
                    oddSum: oddSum,
                    winCount: 3,
                    message: "You win, best of 3"
                }, { status: 200 })
            }
            return c.json({
                Backend: computerRole,
                backendChose: randomNumber,
                userChose: data.number,
                userRole: data.userIsWhat,
                oddSum: oddSum,
                tempWin: tempWin,
            }, { status: 200 })
        }
        tempWin = 0
    }
    return c.json(({
        Backend: computerRole,
        backendChose: randomNumber,
        userChose: data.number,
        userRole: data.userIsWhat,
        message: data.userIsWhat === OddEven.ODD ? "Now even turn" : "Now odd turn",
    }))
})

export default app