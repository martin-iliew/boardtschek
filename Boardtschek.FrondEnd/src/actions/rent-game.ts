import * as z from "zod";
import apiClient from "@/api/axios";
const rentalSchema = z.object({
  gameId: z.string().uuid(), 
  startDate: z.string(), 
  startTime: z.string(),
  endDate: z.string(), 
  endTime: z.string(), 
  quantity: z.number().min(1), 
});

export type RentalFormData = z.infer<typeof rentalSchema>;
function extractGameIdFromUrl(): string | null {
  const url = new URL(window.location.href);
  const gameId = url.pathname.split("/").pop(); 
  return gameId?.match(/^[0-9a-fA-F-]{36}$/) ? gameId : null; 
}

export async function rentGame(data: Omit<RentalFormData, "gameId">) {
  const gameId = extractGameIdFromUrl();
  if (!gameId) {
    return {
      success: false,
      message: "Unable to determine gameId from URL.",
    };
  }
  const rentalData = { ...data, gameId };
  const result = rentalSchema.safeParse(rentalData);

  if (!result.success) {
    return {
      success: false,
      message: "Invalid form data",
      errors: result.error.errors, 
    };
  }
  // eslint-disable-next-line no-debugger
  debugger;
  const response = await apiClient.post(`/api/Rental/Rent/${gameId}`, result.data);
  return response.data;  
}


