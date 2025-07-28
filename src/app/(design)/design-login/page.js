import { Input } from "@/components/ui/input";
import { guestLogin } from "../action";
import { Button } from "@/components/ui/button";

export default async function SignIn(props) {
  const searchParams = await props.searchParams;

  return (
    <main className="max-w-[1080px] w-full flex flex-col gap-6 items-center justify-center flex-1">
      <h1 className="text-2xl">🔒</h1>

      <form className="flex flex-col justify-center items-center gap-2 w-full max-w-[320px]">
        <label className="w-full">
          <Input
            name="password"
            type="password"
            placeholder="Enter password"
            className="textfield"
            required
          />
        </label>

        <Button formAction={guestLogin}>Log in</Button>
        {searchParams?.error && (
          <p className="mt-4 p-2 bg-red-900/50 text-red-300 text-center text-sm rounded-md">
            {searchParams.error}
          </p>
        )}
      </form>
    </main>
  );
}
