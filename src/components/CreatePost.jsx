import ImageUploader from '@/components/ImageUploader';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';

import { BsCamera2 } from 'react-icons/bs';

export default function CreatePost() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-s w-14 h-14 flex items-center justify-center text-2xl rounded-full smooth-link *:stroke-[0.3] text-center hover:scale-110 hover:shadow-md hover:shadow-black bg-opacity-60">
                    <BsCamera2 />
                </div>
            </DialogTrigger>
            <DialogContent className="w-full h-4/5 bg-a flex flex-col items-center justify-evenly outline-none border-none">
                <DialogHeader>
                    <DialogTitle className="text-4xl text-s text-center">
                        Create Post
                    </DialogTitle>
                </DialogHeader>
                <ImageUploader />
            </DialogContent>
        </Dialog>
    );
}
