"use client"

import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {useMemo, useState, useTransition} from "react";
import {Collection} from "@prisma/client"
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {CollectionColor, CollectionColors} from "@/lib/constants";
import {CaretDownIcon, CaretUpIcon, TrashIcon} from "@radix-ui/react-icons";
import {Progress} from "@/components/ui/progress";
import {Separator} from "@/components/ui/separator";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {deleteCollection} from "@/actions/collection";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {Task} from '@prisma/client';
import CreateTaskDialog from "@/components/CreateTaskDialog";
import TaskCard from "@/components/TaskCard";
import {Simulate} from "react-dom/test-utils";

interface Props {
    collection: Collection & {
        tasks: Task[]
    }
}
const CollectionCard = ({ collection }: Props) => {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();
    const [isLoading, startTransition] = useTransition()

    const [showCreateModal, setShowCreateModal] = useState(false)

    const removeCollection = async () => {
        try{
            await deleteCollection(collection.id);
            toast({
                title: "Success",
                description: "Collection deleted successfully"
            })
        }catch (e){
            toast({
                title: "Error",
                description: "Cannot delete collection",
                variant: "destructive"
            })

        }
    }
    const taskDone = useMemo(() => {
        return collection.tasks.filter(task => task.done).length
    }, [collection.tasks])

    const progress = collection.tasks.length === 0 ? 0 : ((taskDone / collection.tasks.length)*100);

    return(
        <>
            <CreateTaskDialog open={showCreateModal} setOpen={setShowCreateModal} collection={collection}/>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <Button variant={"ghost"} className={cn("flex w-full justify-between p-6",
                    isOpen && "rounded-b-none",
                    CollectionColors[collection.color as CollectionColor])}>
                    <span className="text-white font-bold">{collection.name}</span>
                    {!isOpen && <CaretDownIcon className="h-6 w-6"/>}
                    {isOpen && <CaretUpIcon className="h-6 w-6"/>}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex rounded-b-md flex-col dark:bg-neutral-900 shadow-lg">
                {collection.tasks.length === 0 && (
                    <Button variant={'ghost'} onClick={()=>setShowCreateModal(true)}
                            className="flex items-center justify-center gap-1 p-8 py-12 rounded-none">
                        <p>There are no tasks (yet):</p>
                        <span className={cn("text-sm bg-clip-text text-transparent", CollectionColors[collection.color as CollectionColor])}>
                            Create one
                        </span>
                    </Button>
                )}
                {collection.tasks.length > 0 && (
                    <>
                        <Progress className="rounded-none" value={progress}/>
                        <div className="p-4 gap-3 flex flex-col">
                            {collection.tasks.map((task) => (
                                <TaskCard key={task.id} task={task}/>
                            ))}
                        </div>
                    </>
                )}
                <Separator/>
                <footer className="h-[400px] px-4 p-[2px] text-xs text-neutral-500 flex justify-between
                items-center">
                    <p>Created at {collection.createdAt.toLocaleDateString("en-US")}</p>
                    {isLoading && <div>Deleting...</div>}
                    {!isLoading && (
                        <div>
                            <Button size={"icon"} variant={"ghost"} className="w-4 h-4"
                                    onClick={() => setShowCreateModal(true)}>
                                +
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size={"icon"} variant={"ghost"}><TrashIcon/></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogTitle>
                                        Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => startTransition(removeCollection)}>
                                            Proceed
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </footer>
            </CollapsibleContent>
        </Collapsible>
        </>
    )
}
export default CollectionCard