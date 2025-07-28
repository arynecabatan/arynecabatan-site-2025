"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Save, Loader2 } from "lucide-react"; 
import { deleteSiteSetting, updateSiteSetting } from "@/app/(admin)/action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// This will render the editable value and its save button
const EditableValueCell = ({ setting }) => {
  const [value, setValue] = useState(setting.value || "");
  const [isSaving, setIsSaving] = useState(false); // Add saving state
  const router = useRouter();

  const handleUpdate = async () => {
    setIsSaving(true);
    await updateSiteSetting(setting.key, value);
    router.refresh();
    setIsSaving(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isSaving}
      />
      <Button
        variant="outline"
        size="icon"
        onClick={handleUpdate}
        disabled={isSaving}
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export const columns = [
  {
    accessorKey: "label",
    header: "Title",
    meta: {
      className: "w-[150px]",
    },
    cell: ({ row }) => {
      const setting = row.original;
      return (
            <div className="w-fit text-left">
              <p className="font-medium">{setting.label}</p>
              <p className="text-xs text-muted-foreground">{setting.key}</p>
            </div>
      );
    },
  },

  {
    accessorKey: "value",
    header: "Value",
    meta: {
      className: "w-[400px]",
    },
    cell: ({ row }) => <EditableValueCell setting={row.original} />,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const setting = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        await deleteSiteSetting(setting.key);
        router.refresh();
      };

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the setting with key "{setting.key}
                ". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
