import "./styles/HomePage.css"
import PlanetView from '../../components/planet_view/PlanetView';
import { TextHeader } from "@/components/ui/textHeader"
import { Button } from "@/components/ui/button"

const HomePage = () => {
    return (
        <div className="homepage">
            <div className="text-content">
                <div className="slogan">
                    <TextHeader variant="h1" size="lg">Cosmic Bonds,</TextHeader>
                    <TextHeader variant="h1" size="lg">Stellar Returns.</TextHeader>
                </div>
                <Button variant="default">Get Started</Button>
            </div>
            <PlanetView />
        </div>
    )
}

export default HomePage