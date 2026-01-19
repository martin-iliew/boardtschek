import React from "react";
import { Link } from "react-router-dom";
import logo from "/public/assets/logo.svg";
import { ROUTES } from "@/routes";
import { HeadingLarge } from "@/components/ui/typography";
import { Dice5 } from "lucide-react";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  color?: "light" | "dark";
}

const Logo: React.FC<LogoProps> = ({
  size = "medium",
  showText = true,
  color = "dark",
}) => {
  const sizes = {
    small: "h-6 text-sm",
    medium: "h-8 text-xl",
    large: "h-10 text-2xl",
  };
  const colors = {
    light: "text-foreground-text",
    dark: "text-background-text",
  };

  const [logoSize, textSize] = sizes[size].split(" ");
  const textColorClass = colors[color];

  return (
    <div className="flex items-center w-auto space-x-3">
      <Link to={ROUTES.HOME}>
        <img src={logo} alt="Logo" className={logoSize} />
      </Link>
      {showText && (
        <Link to={ROUTES.HOME}>
          <div className="flex items-center gap-2">
            <HeadingLarge className={`${textSize} ${textColorClass} font-bold border-b-0 p-0`}>
              Boardtschek
            </HeadingLarge>
          </div>
        </Link>
      )}
    </div>
  );
};
export default Logo;
