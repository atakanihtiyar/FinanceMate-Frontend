console.log("ENV MODE -> ", process.env.NODE_ENV)

const SERVER_URL = import.meta.env.VITE_SERVER_ON === "local" ? import.meta.env.VITE_SERVER_LOCAL_URL : import.meta.env.VITE_SERVER_REMOTE_URL
console.log("SERVER URL -> ", SERVER_URL)

export const checkAuth = async () => {

    const response = await fetch(`${SERVER_URL}/session/check`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })

    const data = await response.json()
    if (response.status === 201) {
        return data
    }
    else {
        console.log(data)
        return false
    }
}

export const login = async (email_address: String, password: String) => {
    const response = await fetch(`${SERVER_URL}/session/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_address, password })
    })

    const data = await response.json()
    if (response.status === 201) {
        return data
    }
    else {
        console.log(data)
        return false
    }
}

export const logout = async () => {
    const response = await fetch(`${SERVER_URL}/session/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    })

    const data = await response.json()
    if (response.status === 201) {
        return data
    }
    else {
        console.log(data)
        return false
    }
}

export const register = async (formData: unknown) => {
    const response = await fetch(`${SERVER_URL}/users`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
    })

    const data = await response.json()
    if (response.status === 201) {
        return data
    }
    else {
        console.log(data)
        return false
    }
}

export const getTradingData = async (account_number: Number) => {
    const response = await fetch(`${SERVER_URL}/trading/${account_number}/account`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const data = await response.json()
    if (response.status === 200) {
        return data
    }
    else {
        console.log(data)
        return false
    }
}

export const getPositions = async (account_number: Number) => {
    const response = await fetch(`${SERVER_URL}/trading/${account_number}/positions`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })

    const data = await response.json()
    if (response.status === 200) {
        return data
    }
    else {
        console.log(data)
        return false
    }
}

export const getOrders = async (account_number: Number) => {
    const response = await fetch(`${SERVER_URL}/trading/${account_number}/orders`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })

    const data = await response.json()
    if (response.status === 200) {
        return data
    }
    else {
        console.log(data)
        return false
    }
}

export const getAssetData = async (symbol_or_asset_id: String) => {
    const response = await fetch(`${SERVER_URL}/assets/${symbol_or_asset_id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })

    const data = await response.json()
    return { status: response.status, data }
}

interface Order {
    symbol: string,
    qty: string,
    side: "buy" | "sell",
    type: "market" | "limit" | "stop" | "stop_limit",
    time_in_force: "day",
    limit_price?: string,
    stop_price?: string,
}

export const postOrder = async (account_number: Number, order: Order) => {
    const response = await fetch(`${SERVER_URL}/trading/${account_number}/orders`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order)
    })

    const data = await response.json()
    return { status: response.status, data }
}

export type TimeFrameType = "5Min" | "15Min" | "30Min" | "1Hour" | "1Week" | "1Day" | "1Week"
export const getHistoricalBars = async (symbol_or_asset_id: String, timeFrame: TimeFrameType) => {
    const response = await fetch(`${SERVER_URL}/data/${symbol_or_asset_id}/bars?` + new URLSearchParams({ timeFrame }), {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })

    let data = await response.json()
    data.bars = data.bars.map((bar: { t: string, l: number, o: number, c: number, h: number }) => {
        return {
            date: new Date(bar.t),
            low: bar.l,
            open: bar.o,
            close: bar.c,
            high: bar.h,
        }
    })
    return { status: response.status, data }
}