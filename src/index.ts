import { Hono } from 'hono'

const app = new Hono()

// Track the number of wins for the user and the computer
let userWinCount = 0
let computerWinCount = 0

// Track the last round winner to check if the win count is continuous
let lastWinner: 'user' | 'computer' | null = null

enum OddEven {
    ODD = "odd",
    EVEN = "even",
}

app.get("/", async (c) => {
    return c.json({
        message: "Send a POST request to '/play' with a JSON payload containing the key 'number' and 'userIsWhat'. Provide a positive integer, and the server will respond with whether the sum of your number and a randomly generated number is odd or even."
    })
})

interface Payload {
    number: number,
    userIsWhat: "odd" | "even"
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

    if (data.userIsWhat !== "odd" && data.userIsWhat !== "even") {
        return c.json({ error: "Invalid input: 'userIsWhat'" })
    }

    // Generate a random number for the computer
    const randomNumber = Math.floor(Math.random() * 100) + 1

    // Check if the user and computer numbers are the same
    if (data.number === randomNumber) {
        // End the game if the numbers are the same
        userWinCount = 0
        computerWinCount = 0
        lastWinner = null
        return c.json({
            message: "Game over! You and the computer chose the same number. The game ends.",
            userWinCount: userWinCount,
            computerWinCount: computerWinCount
        })
    }

    // Calculate the sum of the user's number and the random number
    const sum = data.number + randomNumber
    const isEven = sum % 2 === 0

    // If the user is 'odd', then the computer is 'even', and vice versa
    const userIsOdd = data.userIsWhat === "odd"
    const computerIsEven = !userIsOdd

    // Determine the winner based on the sum
    let currentRoundWinner: 'user' | 'computer'

    // If the sum is even and the user is playing even, the user wins.
    if (isEven && !userIsOdd) {
        currentRoundWinner = 'user'
    }
    // If the sum is odd and the user is playing odd, the user wins.
    else if (!isEven && userIsOdd) {
        currentRoundWinner = 'user'
    }
    // If the sum is even and the user is playing odd, the computer wins.
    else if (isEven && userIsOdd) {
        currentRoundWinner = 'computer'
    }
    // If the sum is odd and the user is playing even, the computer wins.
    else {
        currentRoundWinner = 'computer'
    }

    // If the current round winner is not the same as the last winner, reset both win counts
    if (lastWinner && lastWinner !== currentRoundWinner) {
        userWinCount = 0
        computerWinCount = 0
    }

    // Update win counts based on the result
    if (currentRoundWinner === 'computer') {
        computerWinCount += 1
    } else {
        userWinCount += 1
    }

    // Store the current winner to check for continuous wins
    lastWinner = currentRoundWinner

    // Check if someone has won 3 rounds
    let message = "";
    if (userWinCount >= 3) {
        message = "Congratulations! You won the game! Restarting game...";
        userWinCount = 0
        computerWinCount = 0
        lastWinner = null
    } else if (computerWinCount >= 3) {
        message = "Computer wins the game! Restarting game...";
        userWinCount = 0
        computerWinCount = 0
        lastWinner = null
    }

    // Return the result for this round and the updated win counts
    return c.json({
        yourNumber: data.number,
        randomNumber: randomNumber,
        sum: sum,
        result: isEven ? OddEven.EVEN : OddEven.ODD,
        userWinCount: userWinCount,
        computerWinCount: computerWinCount,
        message: message || `Current score: User ${userWinCount} - Computer ${computerWinCount}`
    })
})

export default app
