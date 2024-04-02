import Planet from '../components/planet_view/Planet';
import { Button } from "@/components/ui/button"
import { Navbar, Footer } from '@/components/parts/navigationMenus';

const HomePage = () => {

    return (
        <>
            <Navbar />
            <div className='tw-min-w-full tw-min-h-screen tw-flex tw-flex-col tw-justify-center tw-items-center tw-flex-nowrap tw-gap-8 lg:tw-flex-row xl:tw-gap-24'>
                <div className="tw-flex tw-flex-wrap tw-flex-col tw-justify-center tw-items-center">
                    <h1 className="txt tw-text-5xl tw-text-center tw-font-extrabold tw-text-nowrap tw-m-3 md:tw-text-7xl lg:tw-text-6xl xl:tw-text-7xl">Cosmic Bonds,</h1>
                    <h1 className="txt tw-text-5xl tw-text-center tw-font-extrabold tw-text-nowrap tw-m-3 md:tw-text-7xl lg:tw-text-6xl xl:tw-text-7xl">Stellar Returns.</h1>
                    <Button variant="default">Get Started</Button>
                </div>
                <Planet />
            </div>
            <Footer />
        </>
    )
}

export default HomePage