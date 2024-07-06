import Planet from '../components/planet_view/Planet'
import { Button } from "@/components/ui/button"

const HomePage = () => {
    return (
        <div className='min-w-screen min-h-screen flex flex-col justify-center items-center flex-nowrap gap-8 lg:flex-row'>
            <div className="flex flex-wrap flex-col justify-center items-center">
                <h1 className="tracking-tight text-5xl text-center font-extrabold text-nowrap m-3 sm:text-7xl lg:text-6xl">
                    Cosmic Bonds, <br />
                    Stellar Returns.
                </h1>
                <Button variant="default" size="lg" className="m-3">Get Started</Button>
            </div>
            <Planet />
        </div>
    )
}

export default HomePage