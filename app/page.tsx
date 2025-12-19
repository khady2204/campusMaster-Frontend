import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/modeToggle";

export default function Home() {
  return (
    <div>
      <ModeToggle />
      <h1 className="">CampusMaster</h1>
      <p className="">Projet campusMaster</p>
      <Button variant="default" size="default"> 
        Cliquez ici 
      </Button>
      <br />
      <Input type="text" />
    </div>
  );
}
