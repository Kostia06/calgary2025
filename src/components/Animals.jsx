import Image from "next/image";
import parrot from '../public/assets/parrot.png';
import sloth from '../public/assets/sloth.png';

export default function Animals() {
    return (
        <>
            <Image
                src={parrot}
                alt="Parrot"
                objectFit="cover"
                className="fixed -z-10 scale-90 -top-11 -left-24"
            />
            <Image
                src={sloth}
                alt="Sloth"
                objectFit="cover"
                className="fixed z-20 scale-90 -top-11 -right-28"
            />
        </>
    );
}