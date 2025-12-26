import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/modeToggle";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    redirect("/auth/login")
    // <div>
    //   <ModeToggle />
    //   <h1 className="">CampusMaster</h1>
    //   <p className="">Projet campusMaster</p>
    //   <Button variant="default" size="default"> 
    //     Cliquez ici 
    //   </Button>
    //   <br />
    //   <Input type="text" />
    // </div>
  );
}
