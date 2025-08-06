import { login } from "../action";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return redirect("/admin");
  }

  return (
    <main className="max-w-[1080px] w-full flex flex-col gap-6 items-center justify-center flex-1">
      <form className="w-full max-w-[320px]">
        <Card>
          <CardHeader>
            <CardTitle>🔒 Admin Panel</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Label className="w-full">
              <Input
                name="email"
                type="email"
                placeholder="Enter email"
                className="textfield"
                required
              />
            </Label>

            <Label className="w-full">
              <Input
                name="password"
                type="password"
                placeholder="Enter password"
                className="textfield"
                required
              />
            </Label>
          </CardContent>
          <CardFooter>
            <CardAction className="w-full">
              <Button formAction={login} className="w-full">Log in</Button>
            </CardAction>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
