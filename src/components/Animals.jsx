import Image from "next/image";
import parrot from '../public/assets/parrot.png';
import sloth from '../public/assets/sloth.png';

export default function Animals() {
    return (
        <>
            <Image
                src={parrot}
                alt="Parrot"
                layout="fixed"
                width={500}
                height={500}
                className="fixed -z-10 -top-11 -left-28"
            />
            <Image
                src={sloth}
                alt="Sloth"
                layout="fixed"
                width={500}
                height={500}
                className="fixed z-20 scale-90 -top-11 -right-32"
            />
        </>
    );
}