import { useEffect, useState } from "react";
import { GameCard } from "@/components/GameCard";
import apiClient from "@/api/auth/apiClient";
import { DisplayLarge, HeadingLarge, HeadingMedium, BodyMedium } from "@/components/ui/typography";

interface Game {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
}

interface HomeGamesOverview {
  highestRatedGames: Game[];
  mostBorrowedGames: Game[];
}

export default function Home() {
  const [games, setGames] = useState<HomeGamesOverview | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await apiClient.get("/api/Home");

        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <main id="content" className="min-h-dvh font-body" tabIndex={-1}>
      <section className="" data-sublocation="Hero" aria-hidden="false">
        <div
          className="inner"
          style={{
            marginTop: "calc(100 / 2000 * 100vw)",
            marginBottom: "calc(100 / 2000 * 100vw)",
          }}
        >
          <DisplayLarge className="mb-5 text-5xl text-background-text font-semibold uppercase text-center">
            Welcome to Boardtschek
          </DisplayLarge>
          <div className="">
            <BodyMedium className="mb-10 text-lg text-background-subtext text-center ">
              Discover a world of fun and strategy with our exclusive collection{" "}
              <br />
              of board games, available for all Nemetschek employees.
            </BodyMedium>
            {/* <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to={ROUTES.RENT}>
                <Button className="mt-4" variant={"default"} size={"lg"}>
                  Start Renting Now
                </Button>
              </Link>
              <Link to={ROUTES.RENT}>
                <Button className="mt-4" variant={"outline"} size={"lg"}>
                  Browse Rentals
                </Button>
              </Link>
            </div> */}
          </div>
        </div>
      </section>

      {/* Top Games Section */}
      <section
        className="section-ranks bg-foreground"
        aria-labelledby="top-games-heading"
      >
        <div
          className="inner pl-36 pr-36"
          style={{
            paddingTop: "calc(100 / 2000 * 100vw)",
            paddingBottom: "calc(100 / 2000 * 100vw)",
          }}
        >
          <HeadingLarge
            id="top-games-heading"
            className="text-4xl font-bold mb-6 text-center text-foreground-text border-b-0 p-0"
          >
            🏆Top Games🏆
          </HeadingLarge>

          {/* Highest Rated Games */}
          <div className="mb-12">
            <HeadingMedium className="text-xl font-medium mb-4 text-foreground-subtext border-b-0 p-0">
              Highest Rated Games
            </HeadingMedium>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(games ? games.highestRatedGames : Array(3).fill(null)).map(
                (game, index) => (
                  <GameCard
                    key={game?.id || index}
                    title={game?.title || "Loading..."}
                    image={game?.imageUrl || "https://via.placeholder.com/150"}
                    id={game?.id || index}
                  />
                )
              )}
            </div>
          </div>

          {/* Most Borrowed Games */}
          <div className="">
            <HeadingMedium className="text-xl font-medium mb-4 text-foreground-subtext border-b-0 p-0">
              Most Borrowed Games
            </HeadingMedium>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(games ? games.mostBorrowedGames : Array(3).fill(null)).map(
                (game, index) => (
                  <GameCard
                    key={game?.id || index}
                    title={game?.title || "Loading..."}
                    image={game?.imageUrl || "https://via.placeholder.com/150"}
                    id={game?.id || index}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
