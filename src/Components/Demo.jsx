import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "./ui/card";
import Footer from "./Footer";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export default function Demo() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="container flex flex-col mx-auto px-2 py-6 sm:px-6 lg:px-4">
        <div className="w-full">
          <Card>
            <CardHeader className="space-y-1 p-2 text-center">
              <CardTitle className="text-xl sm:text-2xl">TaskManager Demo Video</CardTitle>
            </CardHeader>
          </Card>
        </div>
        <iframe
          src="https://player.cloudinary.com/embed/?cloud_name=obinesto-cloudinary&public_id=vh5432ve9khj12ojks1t&profile=cld-default"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          className="min-h-[60vh] w-full mt-4 rounded-md"
        />
        <Button asChild size="lg" className="w-full sm:w-auto mt-4">
          <Link to="/">
            <ArrowLeft className="mr-2" /> Go Back
          </Link>
        </Button>
      </div>
      <Footer />
    </div>
  );
}
