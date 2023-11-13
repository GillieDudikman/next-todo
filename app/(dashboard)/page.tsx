import {currentUser} from "@clerk/nextjs";
import {wait} from "@/lib/wait";
import {Suspense} from "react";
import {Skeleton} from "@/components/ui/skeleton";

export default async function Home() {
    return <>
        <Suspense fallback={<WelcomeMsgFallback/>}>
            <WelcomeMsg/>
        </Suspense>
    </>
}

async function WelcomeMsg(){
    const user = await currentUser();

    if(!user) return <div>error</div>
    return (
        <div className="flex w-full">
            <h1 className="text-4xl font-bold">Welcome, <br/> {user.firstName} {user.lastName}
                <Skeleton className="w-[150px] h-[36px]"/>
                <Skeleton className="w-[150px] h-[36px]"/>
            </h1>
        </div>
    )
}

function WelcomeMsgFallback() {
    return <div>Loading...</div>
}
