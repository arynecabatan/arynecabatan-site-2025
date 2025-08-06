import { Input } from "@/components/ui/input";
import { guestLogin } from "../action";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function SignIn(props) {
  const searchParams = await props.searchParams;

  return (
    <main className="max-w-[1080px] w-full flex flex-col gap-6 items-center justify-center flex-1">
      <form className="w-full max-w-[320px]">
        <Card>
          <CardHeader>
            <CardTitle>🔒 Prynts</CardTitle>
            <CardDescription>
              Please enter the password to access the designs.
            </CardDescription>
            {searchParams?.error && (
              <p className="text-xs text-destructive">{searchParams.error}</p>
            )}
          </CardHeader>
          <CardContent>
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
            <Button formAction={guestLogin} className="w-full">
              Log in
            </Button>
          </CardFooter>
        </Card>
      </form>
      <Button variant="link">
        <Link href="mailto:ryn161923@gmail.com">Request a password</Link>
      </Button>
    </main>
  );
}