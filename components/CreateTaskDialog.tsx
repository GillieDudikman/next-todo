"use client"

import {Collection} from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {cn} from "@/lib/utils";
import {CollectionColors, CollectionColor} from "@/lib/constants";
import {Form, useForm} from "react-hook-form";
import {createTaskSchema, createTaskSchemaType} from "@/schema/createTask";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {Button} from "@/components/ui/button";
import {CalendarIcon, ReloadIcon} from "@radix-ui/react-icons";
import {format} from "date-fns";
import {createTask} from "@/actions/task";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";

interface Props{
    open: boolean;
    collection: Collection;
    setOpen: (open: boolean) => void
}

const CreateTaskDialog = ({ open, collection, setOpen }: Props) => {

    const form = useForm<createTaskSchemaType>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            collectionId: collection.id
        }
    })
    const openChangeWrapper = (value: boolean) => {
        setOpen(value)
        form.reset()
    }

    const router = useRouter();

    const onSubmit = async (data: createTaskSchemaType) => {
        try {
            await createTask(data);
            toast({
                title: "Success",
                description: "Task created"
            })
            openChangeWrapper(false);
            router.refresh();
        }catch(e){
            toast({
                title: "Error",
                description: "Cannot create task",
                variant: "destructive"
            })
        }
    }

    return(
        <Dialog open={open} onOpenChange={openChangeWrapper}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">
                        Add task to collection:
                        <span className={cn("p-[1px] bg-clip-text text-transparent", CollectionColors[collection.color as CollectionColor])}>
                            {collection.name}
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        Add task to collection.
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                            <FormField  name="content" control={form.control} render={({field}) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea rows={5} placeholder="Task content here..." {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField  name="expiresAt" control={form.control} render={({field}) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormDescription>When should this task expire?</FormDescription>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"} className={cn("justify-start text-left font-normal w-full", !field.value && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                                    {field.value && format(field.value, "PPP")}
                                                    {!field.value && (
                                                        <span>No expiration</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}
                        className={cn("w-full dark:text-white text-white",
                            CollectionColors[collection.color as CollectionColor])}>
                        Confirm
                        {form.formState.isSubmitting && (
                            <ReloadIcon className="animate-spin h-4 w-4 ml-2"/>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default CreateTaskDialog