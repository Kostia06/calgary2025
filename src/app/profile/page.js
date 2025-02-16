import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

export default function Profile() {
    return(
        <div className="bg-green-100 p-8">
            <header className="bg-green-500 text-white p-4">
                <h1 className="text-3xl font-bold">zemlia</h1>
            </header>
            <Sheet>
              <SheetTrigger>Open</SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Are you absolutely sure?</SheetTitle>
                  <SheetDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
        </div>
    )
}