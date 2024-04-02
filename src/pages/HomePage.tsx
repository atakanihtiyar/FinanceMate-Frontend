import Planet from '../components/planet_view/Planet';
import { Heading } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import PageWrapper from "@/components/utils/pageWrapper"
import { Navbar, Footer } from '@/components/parts/navigationMenus';

const HomePage = () => {

    return (
        <>
            <Navbar />
            <PageWrapper direction="col" justify="center" alignItems="center" wrap="no"
                className="tw-gap-8 lg:tw-flex-row xl:tw-gap-24">
                <div className="tw-flex tw-flex-wrap tw-flex-col tw-justify-center tw-items-center">
                    <Heading level='h1' className="md:tw-text-7xl lg:tw-text-6xl xl:tw-text-7xl" wrap="nowrap" align="center" variant="h1" size="_5xl">Cosmic Bonds,</Heading>
                    <Heading level='h1' className="md:tw-text-7xl lg:tw-text-6xl xl:tw-text-7xl" wrap="nowrap" align="center" variant="h1" size="_5xl">Stellar Returns.</Heading>
                    <Button variant="default">Get Started</Button>
                </div>
                <Planet size="_16rem" blur="_0_2rem" lgSize="_32rem" lgBlur="_0_4rem" />
            </PageWrapper>
            <Footer />
        </>
    )
}

export default HomePage