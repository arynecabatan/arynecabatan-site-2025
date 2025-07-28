"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { createSiteSetting } from "@/app/(admin)/action";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatValue } from "@/lib/utils";

// This array holds all your category options
const categories = [
    "Home",
  "SEO",
  "Social Links",
  "Portfolio",
  "Blog",
  "Other",

];

export function NewSettingDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("general");
  const router = useRouter();

  const onCategoryChange = useCallback((value) => {
    setCategory(value);
  }, []);

  const handleFormSubmit = async (formData) => {
    const result = await createSiteSetting(formData);
    if (result.success) {
      setIsOpen(false);
      router.refresh();
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={"w-fit"}>Add new key</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Site Setting</DialogTitle>
        </DialogHeader>
        <form action={handleFormSubmit} className="space-y-4">
          <input type="hidden" name="category" value={category} />
          <div className="grid gap-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              name="label"
              placeholder="e.g., Resume File Path"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="value">Value</Label>
            <Input id="value" name="value" placeholder="e.g., /My-Resume.pdf" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category} value={formatValue(category)}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create Setting</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
