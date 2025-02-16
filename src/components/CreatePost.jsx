import ImageUploader from '@/app/components/Posts';
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
            <DialogTrigger
                asChild
                className="fixed bottom-20 right-0 sm:m-5 m-3"
            >
                <div className="bg-s sm:p-4 sm:text-3xl p-3 text-2xl rounded-full smooth-link *:stroke-[0.3] text-center hover:scale-110 hover:shadow-md hover:shadow-black">
                    <BsCamera2 />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] flex items-center justify-center">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">Create Post</DialogTitle>
                    <ImageUploader />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
