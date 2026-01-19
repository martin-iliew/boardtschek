import { StarRating } from "@/components/star-rating";
import { BodyMedium, CaptionSmall } from "@/components/ui/typography";

interface Comment {
  username: string;
  time: string;
  comment: string;
  score?: number;
}

interface CommentsCardProps {
  comments: Comment[];
}

const CommentsCard: React.FC<CommentsCardProps> = ({ comments }) => {
  return (
    <div className="space-y-4 mt-6">
      {comments.map((comment, index) => (
        <div key={index} className="border-b pb-4">
          <div className="flex items-center space-x-3">
            <BodyMedium className="font-semibold">{comment.username}</BodyMedium>
            <CaptionSmall className="text-sm text-gray-500">{comment.time}</CaptionSmall>
          </div>
          <BodyMedium className="mt-2 text-gray-700">{comment.comment}</BodyMedium>
          <div className="mt-2 flex space-x-1">
            {comment.score != null ? (
              <StarRating
                rating={comment.score}
                onChange={() => {}}
                size="md"
                readonly={true}
              />
            ) : (
              <CaptionSmall className="text-sm text-gray-500">No rating yet</CaptionSmall>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsCard;
