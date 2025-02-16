"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export default function Profile() {
    const [profile, setProfile] = useState({
        name: "First Last",
        email: "example@email.ex",
        bio: "I love nature so much that nature loves me."
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save the profile state
        console.log('Profile saved:', profile);
    };
    return (
        <div className="w-screen h-screen flex justify-center items-center pb-20">
            <Card className="bg-white">
                <CardHeader>
                    <h1 className="text-2xl font-bold text-p">User Profile</h1>
                </CardHeader>
                <CardContent className="">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="">
                            <label className="font-medium text-p">Name</label>
                            <Input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                className="text-s"
                            />
                        </div>
                        <div className="">
                            <label className="font-medium text-p">Email</label>
                            <Input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                className="text-s"
                            />
                        </div>
                        <div className="">
                            <label className="font-medium text-p">Bio</label>
                            <Textarea
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                className="text-s"
                            />
                        </div>
                        <CardFooter className="space-y-4 justify-center">
                            <Button type="submit" className="bg-p text-white">
                                Save
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}