import { login } from "../action";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return redirect('/admin');
  }

  return (
    <main className="max-w-[1080px] w-full flex flex-col gap-6 items-center justify-center flex-1">
      <h1 className="text-2xl">🔒</h1>
      <form className="flex flex-col justify-center items-center gap-2 w-full max-w-[320px]">
        <label className="w-full">
          <Input 
            name="email"
            type="email"
            placeholder="Enter email"
            className="textfield"
            required
          />
        </label>

        <label className="w-full">
          <Input 
            name="password"
            type="password"
            placeholder="Enter password"
            className="textfield"
            required
          />
        </label>

        <Button formAction={login}>
          Log in
        </Button>
      </form>
    </main>
  );
}
