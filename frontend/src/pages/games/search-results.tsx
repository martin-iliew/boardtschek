import apiClient from "@/api/auth/apiClient";
import { GameCard } from "@/components/GameCard";
import SearchForm from "@/components/SearchForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DisplayLarge, HeadingLarge, BodyMedium } from "@/components/ui/typography";

interface Game {
  id: string;
  title: string;
  imageUrl: string;
  rating?: number;
  quantity?: number;
  nextAvailable?: string;
}

export default function SearchResults() {
  const { query } = useParams<{ query: string }>();
  const [games, setGames] = useState<Game[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);

      try {
        const response = await apiClient.get(`api/Game/Search?name=${query}`);
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchGames();
    }
  }, [query]);

  return (
    <main id="content" className="min-h-dvh" tabIndex={-1}>
      <section data-sublocation="Hero" aria-hidden="false">
        <div
          className="inner pb-12"
          style={{
            marginTop: "calc(100 / 2000 * 100vw)",
            marginBottom: "calc(50 / 2000 * 100vw)",
          }}
        >
          <DisplayLarge className="mb-5 text-5xl text-background-text font-semibold uppercase text-center">
            Search Results
          </DisplayLarge>
          <BodyMedium className="mb-10 text-lg text-background-subtext text-center">
            {query ? (
              <>
                Results for: <strong>{query}</strong>
              </>
            ) : (
              <>Showing all games</>
            )}
          </BodyMedium>
          <div className="flex flex-col justify-center sm:flex-row">
            <SearchForm size="large" />
          </div>
        </div>
      </section>

      <section
        className="section-ranks bg-foreground"
        aria-labelledby="search-results-heading"
      >
        <div
          className="inner"
          style={{
            paddingTop: "calc(100 / 2000 * 100vw)",
            paddingBottom: "calc(50 / 2000 * 100vw)",
          }}
        >
          <HeadingLarge
            id="search-results-heading"
            className="text-4xl font-bold mb-6 text-center text-foreground-text"
          >
            Search Results
          </HeadingLarge>

          {loading ? (
            <BodyMedium className="text-center text-lg text-foreground-subtext">
              Loading results...
            </BodyMedium>
          ) : games && games.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  title={game.title}
                  image={game.imageUrl}
                  rating={game.rating}
                  quantity={game.quantity}
                  nextAvailable={game.nextAvailable}
                />
              ))}
            </div>
          ) : (
            <BodyMedium className="text-center text-lg text-foreground-subtext">
              No games found for "{query}".
            </BodyMedium>
          )}
        </div>
      </section>
    </main>
  );
}
