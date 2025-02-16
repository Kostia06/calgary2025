import Image from "next/image";
import parrot from '../public/assets/parrot.png';
import sloth from '../public/assets/sloth.png';

export default function Animals() {
    const zIndex = -10;

    return(
        <div className="" style={{ position: 'fixed', width: '100%', height: '100%' }}>
            <Image
                src={parrot}
                alt="Parrot"
                objectFit="cover"
                className="fixed -z-50"
                style={{ scale: 0.9, top: '-45px', left: '-95px' }}
            />
            <Image
                src={sloth}
                alt="Sloth"
                objectFit="cover"
                className="fixed -z-10"
                style={{ scale: 0.9, top: '-45px', right: '-100px' }}
            />
        </div>
    );
}