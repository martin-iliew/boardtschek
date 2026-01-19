import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import { HeadingSmall, LabelSmall, LabelMedium } from "@/components/ui/typography";

interface LeaveCommentProps {
  onSubmit: (comment: { text: string; rating?: number }) => void;
}

export const LeaveComment = ({ onSubmit }: LeaveCommentProps) => {
  const [text, setText] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);

  const handleSubmit = () => {
    if (!text.trim()) {
      alert("Please enter a comment.");
      return;
    }
    onSubmit({ text, rating });
    setText("");
    setRating(undefined);
  };

  return (
    <div className="mt-6 space-y-4">
      <HeadingSmall className="text-lg font-bold">Leave a Comment</HeadingSmall>
      <Textarea
        placeholder="Write your comment here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full max-h-[110px]"
      />
      <div className="flex items-center space-x-2">
        <LabelSmall className="text-sm font-semibold">Rating (optional):</LabelSmall>
        <StarRating rating={rating || 0} onChange={setRating} size="md" />
      </div>
      <Button onClick={handleSubmit} variant={"outline"}>
        <LabelMedium>Submit Comment</LabelMedium>
      </Button>
    </div>
  );
};
