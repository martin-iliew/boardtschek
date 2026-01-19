import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { HeadingMedium, BodySmall, LabelMedium } from "@/components/ui/typography";

interface RentalHistoryCardProps {
  id: number;
  name: string;
  image: string;
  rentalDate: string;
  returnDate: string;
}

export function RentalHistoryCard({
  id,
  name,
  image,
  rentalDate,
  returnDate,
}: RentalHistoryCardProps) {
  return (
    <Card key={id} className="overflow-hidden">
      <div className="relative">
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
      <CardFooter className="p-4 pt-0 flex flex-col gap-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <BodySmall>Rented: {new Date(rentalDate).toLocaleDateString()}</BodySmall>
          <BodySmall>Returned: {new Date(returnDate).toLocaleDateString()}</BodySmall>
        </div>
        <Button className="w-full" variant="outline">
          <LabelMedium>Rent Again</LabelMedium>
        </Button>
      </CardFooter>
    </Card>
  );
}
