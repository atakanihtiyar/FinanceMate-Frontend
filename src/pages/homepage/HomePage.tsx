import "./styles/HomePage.css"
import PlanetView from '../../components/planet_view/PlanetView';
import Text, { TextTemplates } from "../../components/html_basics/Text"
import { Button } from "@/components/ui/button"

const HomePage = () => {
    return (
        <div className="homepage">
            <div className="text-content">
                <div className="slogan">
                    <Text text="Cosmic Bonds," template={TextTemplates.HEADING} />
                    <Text text="Stellar Returns." template={TextTemplates.HEADING} />
                </div>
                <Button variant="default">Get Started</Button>
            </div>
            <PlanetView />
        </div>
    )
}

export default HomePage