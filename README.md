# Odd-Even Game API

This is a simple API that allows users to play an Odd-Even game. You provide a positive integer as input, and the API generates a random number, calculates the sum, and tells you whether the sum is odd or even.

## Features
- **Play Odd-Even Game**: Post a number to the `/play` endpoint, and the API will generate a random number, sum the two, and tell you if the result is odd or even.
- **Get API Information**: A simple `GET` request to the `/` endpoint provides basic instructions on how to interact with the API.

## Endpoints

### 1. `GET /`
**Description**:  
Returns basic instructions on how to interact with the API.

**Request**:
```http
GET / HTTP/1.1
for localhost Host: <http://loacalhost:3000/>


POST /play HTTP/1.1
for localhost Host: <http://loacalhost:3000/play>
Content-Type: application/json
    
    {
        "number": 5,
        "playAs": "odd" // or "even"
    }
    ```