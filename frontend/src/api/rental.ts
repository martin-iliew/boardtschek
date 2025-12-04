import * as z from "zod";
import apiClient from "@/api/auth/apiClient";

const rentalSchema = z.object({
  gameId: z.string().uuid(),
  startDate: z.string(),
  startTime: z.string(),
  endDate: z.string(),
  endTime: z.string(),
  quantity: z.number().min(1),
});

export type RentalFormData = z.infer<typeof rentalSchema>;

export async function rentGame(data: RentalFormData) {
  const result = rentalSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: "Invalid form data",
      errors: result.error.errors,
    };
  }

  const { gameId, ...requestBody } = result.data;

  const response = await apiClient.post(
    `/api/Rental/Rent/${gameId}`,
    requestBody
  );
  return response.data;
}
