"use client"

import { useEffect, useState } from 'react';
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
import Background from '@/components/AnimatedBackground';
import Animals from '@/components/Animals';
import cheetah from '@/public/assets/cheetah.png'

export default function Profile() {
  const imageUrl = "https://www.nicepng.com/png/full/27-277590_nyan-cat-png-images-what-is-nyan-cat.png";

  return (
    <>
      <ProfileCard />
      <Animals />
    </>
  )
}

function ProfileCard() {

  const fetchUserProfile = async() => {
    const userProfile = await fetch('/api/user/get-user-profile', {
      method: "POST"
    })
    const user = await userProfile.json();
    console.log(user, "USERRRR")
    setProfile({
      name: user.fullname || "John Doe",
      email: user.email || "example@email.com",
      pfp: user.avatar_url || cheetah,
      bio: "I love nature so much that nature loves me."
    });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    pfp: cheetah,
    bio: "",
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
      <Card className="w-10/12 sm:w-9/12 md:w-7/12 lg:w-5/12 bg-white">
        <CardHeader>
            <h1 className="text-2xl font-bold text-p">User Profile</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex">
              <div className="flex-col w-1/2 space-y-4">
                <div>
                  <label className="font-medium text-p">Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="text-s"
                  />
                </div>
                <div>
                  <label className="font-medium text-p">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="text-s"
                  />
                </div>
              </div>
              <div className="flex w-1/2 place-content-center place-items-center">
                <>
                  <img
                    src={profile.pfp}
                    className="w-24 h-24 rounded-full bg-s"
                  />
                </>
              </div>
            </div>
            <div>
              <label className="font-medium text-p">Bio</label>
              <Textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="text-s"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Button type="submit" onClick={handleSubmit} className="bg-p text-white">Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
