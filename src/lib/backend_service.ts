

export const checkAuth = async () => {
    const response = await fetch("http://localhost:5050/session/check", {
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
    const response = await fetch("http://localhost:5050/session/login", {
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
    const response = await fetch("http://localhost:5050/session/logout", {
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
    const response = await fetch("http://localhost:5050/users", {
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
    const response = await fetch(`http://localhost:5050/trading/${account_number}/account`, {
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
    const response = await fetch(`http://localhost:5050/trading/${account_number}/positions`, {
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
    const response = await fetch(`http://localhost:5050/trading/${account_number}/orders`, {
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
    const response = await fetch(`http://localhost:5050/assets/${symbol_or_asset_id}`, {
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