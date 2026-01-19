import { useEffect, useState } from "react";
import { ActiveRentalCard } from "@/components/rentals/active";
import { fetchUsers } from "@/api/user";
import { User } from "@/types/user";
import axios from "axios";
import { DisplayLarge, HeadingMedium, BodyMedium } from "@/components/ui/typography";

export default function GameDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchUsers();
        setUser(users[0]);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching profile data:", error.message);
          alert(`Error: ${error.response?.data || error.message}`);
        } else {
          console.error("Unexpected error:", error);
          alert("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user data available.</div>;
  return (
    <div className="container mx-auto p-6 space-y-8">
      <header>
        <DisplayLarge>
          Hey {user.firstName}, Welcome back! Here's what's new while you were
          away.
        </DisplayLarge>
      </header>

      <section className="space-y-4 ">
        <div className="mb-6">
          <HeadingMedium className="text-lg font-semibold mb-4">Active Rentals</HeadingMedium>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.activeRentedGames && user.activeRentedGames.length > 0 ? (
              user.activeRentedGames.map((rental, index) => (
                <ActiveRentalCard
                  key={index}
                  id={rental.id}
                  name={rental.title || "Unknown Game"}
                  image={rental.imageUrl || "/placeholder-image.png"}
                  rentalDate={rental.startDate || new Date().toISOString()}
                  dueDate={rental.dueDate || new Date().toISOString()}
                />
              ))
            ) : (
              <BodyMedium className="text-muted-foreground">No active rentals yet.</BodyMedium>
            )}
          </div>
        </div>
      </section>

      <div className="mb-6">
        <HeadingMedium className="text-lg font-semibold mb-4">Overdue Rentals</HeadingMedium>
        <ul className="list-disc pl-6">
          {user.overdueRentedGames && user.overdueRentedGames.length > 0 ? (
            user.overdueRentedGames.map((rental, index) => (
              <li key={index}>
                <BodyMedium>
                  {rental.title || "Unknown Game"} - Due on{" "}
                  {rental.dueDate
                    ? new Date(rental.dueDate).toLocaleDateString()
                    : "Unknown Date"}
                </BodyMedium>
                <br />
                <img
                  src={rental.imageUrl}
                  alt={rental.title}
                  className="w-12 h-12"
                />
              </li>
            ))
          ) : (
            <BodyMedium>No overdue rentals.</BodyMedium>
          )}
        </ul>
      </div>
    </div>
  );
}
