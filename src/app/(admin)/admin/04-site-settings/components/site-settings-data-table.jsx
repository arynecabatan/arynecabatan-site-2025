"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getFilteredRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { NewSettingDialog } from "./new-setting-dialog";

const SettingCard = ({ setting }) => {
  const [value, setValue] = useState(setting.value || "");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setIsSaving(true);
    await updateSiteSetting(setting.key, value);
    router.refresh();
    setIsSaving(false);
  };

  const handleDelete = async () => {
    await deleteSiteSetting(setting.key);
    router.refresh();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{setting.label}</CardTitle>
        <CardDescription>{setting.key}</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value..."
          disabled={isSaving}
        />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          onClick={handleUpdate}
          size="sm"
          variant="outline"
          className="flex-1"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save"}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the setting "{setting.label}".
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
      </CardFooter>
    </Card>
  );
};

export function SettingsDataTable({ columns, data, header }) {
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="gap-6 flex flex-col w-full sm:w-fit h-auto">
      <div className="flex gap-3 justify-between items-center">
        <h2 className="font-extrabold text-xl">{header}</h2>
        <div className="flex items-center">
          <Input
            placeholder={`Filter ${header} by label...`}
            value={table.getColumn("label")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("label")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Desktop View: Table */}
      <div className="hidden rounded-md border sm:block w-fit">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.columnDef.meta?.className}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No settings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View: Cards */}
      <div className="grid gap-4 sm:hidden ">
        {data.length > 0 ? (
          data.map((setting) => (
            <SettingCard key={setting.key} setting={setting} />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-12">
            No settings found.
          </p>
        )}
      </div>
    </div>
  );
}
