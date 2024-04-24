import Planet from '../components/planet_view/Planet';
import { Button } from "@/components/ui/button"
import { Navbar, Footer } from '@/components/parts/navigationMenus';

const HomePage = () => {
    return (
        <>
            <Navbar />
            <div className='tw-min-w-screen tw-min-h-screen tw-flex tw-flex-col tw-justify-center tw-items-center tw-flex-nowrap tw-gap-8 lg:tw-flex-row'>
                <div className="tw-flex tw-flex-wrap tw-flex-col tw-justify-center tw-items-center">
                    <h1 className="tw-tracking-tight tw-text-7xl tw-text-center tw-font-extrabold tw-text-nowrap tw-m-3 lg:tw-text-6xl">Cosmic Bonds, <br /> Stellar Returns.</h1>
                    <Button variant="default">Get Started</Button>
                </div>
                <Planet />
            </div>
            <Footer />
        </>
    )
}

export default HomePage