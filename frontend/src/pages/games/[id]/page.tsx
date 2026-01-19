import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { LeaveComment } from "@/components/LeaveComment";
import CommentsCard from "@/components/CommentsCard";
import { StarRating } from "@/components/star-rating";
import GameRentalDialog from "@/components/return-game/GameRentalDialog";
import apiClient from "@/api/auth/apiClient";
import { useParams } from "react-router-dom";
import { getUserDetails } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { ROUTE_BUILDERS } from "@/routes";
import { DisplayLarge, HeadingMedium, BodyMedium, LabelMedium } from "@/components/ui/typography";

interface Comment {
  username: string;
  time: string;
  comment: string;
  score: number;
}

interface GameDetails {
  id: string;
  title: string;
  difficulty: string;
  averageRating: number;
  description: string;
  imageUrl: string;
  ratings: Comment[];
}

interface NewComment {
  text: string;
  rating?: number;
}

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>();
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/Game/Details/${gameId}`);
        setGameDetails(response.data);
        setComments(response.data.ratings || []);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "An error occurred");
        } else {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  const handleAddComment = async (newComment: NewComment) => {
    if (!gameId) return;
    try {
      await apiClient.post(`/api/Game/${gameId}/rate`, {
        comment: newComment.text,
        score: newComment.rating,
      });
      
      const loggedUser = await getUserDetails();
      
      const newCommentWithDetails: Comment = {
          username: loggedUser?.firstName || "You",
          time: new Date().toLocaleDateString(),
          comment: newComment.text,
          score: newComment.rating || 0,
      };

      setComments((prevComments) => [newCommentWithDetails, ...prevComments]);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error(
          "Error adding comment:",
          err.response?.data?.message || err.message
        );
      } else {
        console.error("An unexpected error occurred while adding the comment.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="inner mx-auto flex flex-col mt-4 mb-6">
      <div className="container mx-auto flex flex-col md:flex-row gap-7">
        <Card className="flex-1 md:w-1/3">
          <CardContent className="p-4">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <img
                src={gameDetails?.imageUrl}
                alt={gameDetails?.title}
                className="h-full w-full object-cover rounded-md"
              />
            </AspectRatio>
          </CardContent>
        </Card>

        <div className="flex-1 flex flex-col gap-4">
          <DisplayLarge>{gameDetails?.title}</DisplayLarge>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
            <BodyMedium>Difficulty: </BodyMedium> 
            <BodyMedium>{gameDetails?.difficulty}</BodyMedium>
            </div>
            <div className="flex items-center gap-2">
            <BodyMedium className="text-muted-foreground">
              Average rating: 
            </BodyMedium>
             <StarRating
                rating={gameDetails?.averageRating || 0}
                readonly
                size="md"
              />
            </div>
          </div>
          
          <div>
            <HeadingMedium className="text-lg font-semibold mb-2">Description:</HeadingMedium>
            <BodyMedium>{gameDetails?.description}</BodyMedium>
          </div>

          <div className="flex gap-2 mt-4">
            <Button asChild variant="outline">
              <Link to={ROUTE_BUILDERS.editGame(gameId!)}>
                <LabelMedium>Edit Game</LabelMedium>
              </Link>
            </Button>
            <GameRentalDialog
              gameName={gameDetails?.title || ""}
              gameId={gameId!}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8">
        <LeaveComment onSubmit={handleAddComment} />
        <HeadingMedium className="text-xl font-bold mb-4 border-b-0 p-0 mt-8">
          Comments
        </HeadingMedium>
        <CommentsCard comments={comments} />
      </div>
    </div>
  );
}