import { useLocation } from "react-router-dom"

const AssetPage = () => {
    const location = useLocation()
    const assetData = location.state.assetData

    console.log(assetData)
    return (
        <>
            <div>
                assetData
            </div>
        </>
    )
}

export default AssetPage