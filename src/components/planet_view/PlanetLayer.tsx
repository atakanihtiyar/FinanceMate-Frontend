import { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const layerVariants = cva(
    ``,
    {
        variants: {
            context: {
                none: "",
                container: "container",
                fullOctave: "fullOctave",
                halfOctave: "halfOctave",
                quarterOctave: "quarterOctave",
                octaves: "octaves",
                light: "light",
                noise: "noise",
                color: "color",
                reflection: "reflection",
            },
            position: {
                none: "",
                static: "tw-static",
                absolute: "tw-absolute",
                relative: "tw-relative",
            },
            size: {
                none: "",
                full: "tw-w-full tw-h-full",
                double: "tw-w-[200%] tw-h-[200%]",
            },
            left: {
                none: "",
                _0: "tw-left-0",
                _100: "tw-left-[100%]"
            },
            bottom: {
                none: "",
                _0: "tw-bottom-0",
                _100: "tw-bottom-[100%]"
            },
            bg: {
                none: "",
                texture: "tw-bg-[url('/images/planet/texture.jpg')]",
                noise: "tw-bg-[url('/images/planet/noise.jpg')]",
                light: "tw-bg-[url('/images/planet/lighting.jpg')]",
                mask: "tw-bg-[url('/images/planet/mask.jpg')]",
                color: "tw-bg-[#C8385A]",
            },
            bgSize: {
                none: "",
                _6_25: "tw-bg-6.25%",
                _12_5: "tw-bg-12.5%",
                _25: "tw-bg-25%",
                _50: "tw-bg-50%",
                _100: "tw-bg-100%",
            },
            bgRepeat: {
                none: "",
                repeat: "tw-bg-repeat",
                norepeat: "tw-bg-norepeat",
            },
            rounded: {
                none: "",
                _0: "tw-rounded-[0%]",
                _50: "tw-rounded-[50%]",
            },
            opacity: {
                none: "",
                _0: "tw-opacity-[0%]",
                _10: "tw-opacity-[10%]",
                _12_5: "tw-opacity-[12.5%]",
                _25: "tw-opacity-[25%]",
                _50: "tw-opacity-[50%]",
                _100: "tw-opacity-[100%]",
            },
            blendMode: {
                none: "",
                normal: "tw-mix-blend-normal",
                softLight: "tw-mix-blend-soft-light",
                hardLight: "tw-mix-blend-hard-light",
                exclusion: "tw-mix-blend-exclusion",
                color: "tw-mix-blend-color",
            },
            overflow: {
                none: "",
                hidden: "tw-overflow-hidden",
            },
        },
        defaultVariants: {
            context: "none",
            position: "none",
            size: "none",
            left: "none",
            bottom: "none",
            bg: "none",
            bgSize: "none",
            bgRepeat: "none",
            rounded: "none",
            opacity: "none",
            blendMode: "none",
            overflow: "none",
        },
    }
)
type LayerProps = VariantProps<typeof layerVariants> & ComponentProps<"div">;

const PlanetLayer = ({ context, position, size, left, bottom, bg, bgSize, bgRepeat, rounded, opacity, blendMode, overflow, className, ...props }: LayerProps) => {
    return (
        <div {...props} className={cn(layerVariants({ context, position, size, left, bottom, bg, bgSize, bgRepeat, rounded, opacity, blendMode, overflow }), className ? className : "")} />
    )
}

export default PlanetLayer