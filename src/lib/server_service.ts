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

export type HistoricalBarsTimeFrameType = "5Min" | "15Min" | "30Min" | "1Hour" | "1Week" | "1Day" | "1Week"
export const getHistoricalBars = async (symbol_or_asset_id: String, timeFrame: HistoricalBarsTimeFrameType) => {
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

export type PortfolioHistoryTimeFrameType = "5Min" | "15Min" | "1H" | "1D"
export const getAccountPortfolioHistory = async (account_number: Number, timeframe: PortfolioHistoryTimeFrameType) => {
    const response = await fetch(`${SERVER_URL}/trading/${account_number}/portfolio_history?` + new URLSearchParams({ timeframe }), {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    })

    let data = await response.json()

    if (response.status === 200) {
        return data.timestamp.map((time: number, index: number) => {
            const date = new Date(time * 1000)
            const value = data.equity[index]
            return { date, value }
        })
    }
    else {
        console.log(data)
        return false
    }
}

export const getNews = async (symbol_or_asset_id: String) => {
    const response = await fetch(`${SERVER_URL}/data/${symbol_or_asset_id}/news`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    })

    let data = await response.json()

    if (response.status === 200) {
        return data
    }
    else {
        return false
    }
}

interface AchData {
    account_owner_name: string,
    bank_account_type: "CHECKING" | "SAVINGS",
    bank_account_number: string,
    bank_routing_number: string,
    nickname?: string,
}

export const getAchRelationships = async (account_number: Number) => {
    const response = await fetch(`${SERVER_URL}/users/${account_number}/ach`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    })

    let data = await response.json()
    if (response.status === 200) {
        return data
    }
    else {
        return false
    }
}

export const createAchRelationship = async (account_number: Number, achData: AchData) => {
    const response = await fetch(`${SERVER_URL}/users/${account_number}/ach`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(achData)
    })

    let data = await response.json()
    if (response.status === 200) {
        return data
    }
    else {
        return false
    }
}

export const deleteAchRelationship = async (account_number: Number, ach_relationship_id: string) => {
    const response = await fetch(`${SERVER_URL}/users/${account_number}/ach/${ach_relationship_id}`, {
        method: "DELETE",
        credentials: "include",
    })

    if (response.status === 204) {
        return true
    }
    else {
        return false
    }
}