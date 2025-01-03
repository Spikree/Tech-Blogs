"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
};

export default function Home() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(
    null
  );

  useEffect(() => {
    const setUpProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    setUpProviders();
  }, []);

  return (
    <div className="flex justify-center align-middle items-center h-screen">
      <Card className="p-5 max-w-max">
        <div className="flex flex-col gap-4">
          <Input placeholder="email" />
          <Input placeholder="password"/>
          <Button>signIn</Button>
          <hr />
          {
            providers && 
            Object.values(providers).map((provider) => (
              <Button key={provider.id} onClick={() => {signIn(provider.id,{callbackUrl: '/home'})}}>signIn with {provider.name}</Button>
            ))
          }
        </div>
      </Card>
    </div>
  );
}
