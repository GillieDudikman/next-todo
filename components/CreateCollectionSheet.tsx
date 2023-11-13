import {open} from "fs";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {useForm} from "react-hook-form";
import {createCollectionSchema, createCollectionSchemaType} from "@/schema/createCollection";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CollectionColor, CollectionColors} from "@/lib/constants";
import {cn} from "@/lib/utils";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {createCollection} from "@/actions/collection";
import {toast} from "@/components/ui/use-toast";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useRouter} from "next/navigation";

interface Props {
    open: boolean;
    onOpenChange: (open:boolean) => void;
}

const CreateCollectionSheet = ({ open, onOpenChange }: Props) => {
    const form = useForm<createCollectionSchemaType>({
        resolver: zodResolver(createCollectionSchema),
        defaultValues: {},
    })

    const router = useRouter();
    const openChangeWrapper = (open:boolean) => {
        form.reset();
        onOpenChange(open)
    }

    const onSubmit = async (data: createCollectionSchemaType) => {
        try{
            await createCollection(data);
            openChangeWrapper(false);
            router.refresh();
            toast({
                title: "Success",
                description: "Collection created successfully",

            })
        }catch (e: any){
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive"
            })
        }
    }

    return(
        <Sheet open={open} onOpenChange={openChangeWrapper}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add new collection</SheetTitle>
                    <SheetDescription>Collections help you collect your tasks</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                        <FormField name="name" control={form.control} render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Personal" {...field}/>
                                </FormControl>
                                <FormDescription>Collection name</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="color" render={({field}) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                    <Select onValueChange={color => field.onChange(color)}>
                                        <SelectTrigger className={cn("w-full h-8 text-white",CollectionColors[field.value as CollectionColor])}>
                                            <SelectValue placeholder="Color" className="w-full h-8"/>
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            {Object.keys(CollectionColors).map(color => (
                                                <SelectItem className={cn(`w-full h-8 rounded-md my-1 text-white 
                                                focus:text-white focus:font-bold focus:ring-2 ring-neutral-600 
                                                focus:ring-inset dark:focus:ring-white focus:px-8`,
                                                    CollectionColors[color as CollectionColor])} value={color} key={color}>{color}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>Select a color for collection</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </form>
                </Form>
                <div color="flex flex-col gap-3 mt-4">
                    <Separator/>
                    <Button disabled={form.formState.isSubmitting} variant={"outline"} className={cn(form.watch("color") &&
                        CollectionColors[form.getValues("color") as CollectionColor])}
                            onClick={form.handleSubmit(onSubmit)}>
                        Confirm
                        {form.formState.isSubmitting && (
                         <ReloadIcon className="ml-2 h-4 w-4 animate-spin"/>
                        )}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
export default CreateCollectionSheet