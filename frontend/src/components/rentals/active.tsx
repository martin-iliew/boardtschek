import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { HeadingMedium, BodySmall, LabelSmall, LabelMedium } from "@/components/ui/typography";

interface ActiveRentalCardProps {
  id: string;
  name: string;
  image: string;
  rentalDate: string;
  dueDate: string;
}

export function ActiveRentalCard({
  id,
  name,
  image,
  rentalDate,
  dueDate,
}: ActiveRentalCardProps) {
  return (
    <Card key={id} className="overflow-hidden">
      <div className="relative">
        <Badge className="absolute left-2 top-2 z-10 bg-primary hover:bg-primary">
          <LabelSmall>Currently Active</LabelSmall>
        </Badge>
        <img
          src={image}
          alt={name}
          width={300}
          height={200}
          className="object-cover w-full h-[200px]"
        />
      </div>
      <CardContent className="p-4">
        <HeadingMedium className="text-xl font-semibold">{name}</HeadingMedium>
      </CardContent>
      <CardFooter className=" pt-0 flex flex-col">
        <div className="text-sm text-muted-foreground space-y-1 text-left">
          <BodySmall>Rented: {new Date(rentalDate).toLocaleDateString()}</BodySmall>
          <BodySmall>Due: {new Date(dueDate).toLocaleDateString()}</BodySmall>
        </div>
        <Button className="w-full">
          <LabelMedium>Return Game</LabelMedium>
        </Button>
      </CardFooter>
    </Card>
  );
}
