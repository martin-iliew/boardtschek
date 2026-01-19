import * as React from "react";
import { addDays, format, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { LabelMedium, BodyMedium, HeadingLarge } from "@/components/ui/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { rentGame, RentalFormData } from "@/api/rental";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const formSchema = z
  .object({
    dateRange: z.object({
      from: z.date(),
      to: z.date(),
    }, { required_error: "Please select a rental period." }),
    startTime: z.string(),
    endTime: z.string(),
    quantity: z
      .string()
      .refine(
        (val) => parseInt(val) > 0 && parseInt(val) <= 5,
        "Quantity must be between 1 and 5."
      ),
  })
  .superRefine((data, ctx) => {
    if (data.dateRange.from < new Date(new Date().setHours(0, 0, 0, 0))) {
       ctx.addIssue({
        code: "custom",
        path: ["dateRange"],
        message: "Start date cannot be in the past.",
      });
    }

    if (
      isSameDay(data.dateRange.from, data.dateRange.to) &&
      parseInt(data.endTime) <= parseInt(data.startTime)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after start time on the same day.",
      });
    }
  });

type FormData = z.infer<typeof formSchema>;

interface GameRentalDialogProps {
  gameName?: string;

  gameId?: string;
}

export default function GameRentalDialog({ gameName, gameId: propGameId }: GameRentalDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { gameId: paramGameId } = useParams<{ gameId: string }>();
  const gameId = propGameId || paramGameId;

  const { control, handleSubmit, watch, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: {
        from: new Date(),
        to: addDays(new Date(), 1),
      },
      startTime: "12",
      endTime: "12",
      quantity: "1",
    },
  });

  const dateRange = watch("dateRange");
  const startTime = watch("startTime");

  const onSubmit = async (data: FormData) => {
    if (!gameId) {
      toast.error("Error", {
        description: "Game ID is missing or invalid.",
      });
      return;
    }

    const formattedStartTime = `${data.startTime}:00:00`;
    const formattedEndTime = `${data.endTime}:00:00`;
    const formattedStartDate = `${format(
      data.dateRange.from,
      "yyyy-MM-dd"
    )}T${data.startTime}:00:00`;
    const formattedEndDate = `${format(data.dateRange.to, "yyyy-MM-dd")}T${data.endTime}:00:00`;

    const formData: RentalFormData = {
      gameId,
      startDate: formattedStartDate,
      startTime: formattedStartTime,
      endDate: formattedEndDate,
      endTime: formattedEndTime,
      quantity: parseInt(data.quantity, 10),
    };

    try {
      const result = await rentGame(formData);
      if (result.success) {
        toast.success("Success!", {
          description: `Your rental for Game ID: ${gameId} has been successfully submitted!`,
        });
        setIsOpen(false);
        reset(); 
      } else {
        toast.error("Error:", {
          description: result.message,
        });
      }
    } catch (error) {
       toast.error("Error", {
        description: "An unexpected error occurred.",
      });
    }
  };

  const isEndTimeValid = (hour: string) => {
    if (dateRange?.from && dateRange?.to && isSameDay(dateRange.from, dateRange.to)) {
      return parseInt(hour) > parseInt(startTime);
    }
    return true;
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <LabelMedium>Rent a Game</LabelMedium>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle asChild>
            <HeadingLarge>Rent {gameName || "a Game"}</HeadingLarge>
          </DialogTitle>
          <DialogDescription asChild>
            <BodyMedium>
              Choose your rental dates, times, and quantity. Same-day rentals are
              allowed.
            </BodyMedium>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date-range" className="text-right">
                <LabelMedium>Period</LabelMedium>
              </Label>
              <Controller
                name="dateRange"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-range"
                          variant={"outline"}
                          className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                            fieldState.error && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y")} -{" "}
                                {format(field.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[60]" align="start">
                        <Calendar
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={field.value}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <LabelMedium className="text-red-500 mt-1">
                        {fieldState.error.message || fieldState.error.root?.message}
                      </LabelMedium>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-hour" className="text-right">
                <LabelMedium>Start Time</LabelMedium>
              </Label>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select hour" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-hour" className="text-right">
                <LabelMedium>End Time</LabelMedium>
              </Label>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select hour" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem
                          key={hour}
                          value={hour}
                          disabled={!isEndTimeValid(hour)}
                        >
                          {hour}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                <LabelMedium>Quantity</LabelMedium>
              </Label>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select quantity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              <LabelMedium>Rent Game</LabelMedium>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
