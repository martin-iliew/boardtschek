import { ReactNode } from "react";
import clsx from "clsx";

interface TypographyProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

// Display Styles
const DisplayLarge = ({ children, className, id }: TypographyProps) => {
  return (
    <h1
      id={id}
      className={clsx(
        "font-body text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl",
        className
      )}
    >
      {children}
    </h1>
  );
};

const DisplayMedium = ({ children, className, id }: TypographyProps) => {
  return (
    <h1
      id={id}
      className={clsx(
        "font-body text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  );
};

const DisplaySmall = ({ children, className, id }: TypographyProps) => {
  return (
    <h1
      id={id}
      className={clsx(
        "font-body text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl",
        className
      )}
    >
      {children}
    </h1>
  );
};

// Heading Styles
const HeadingLarge = ({ children, className, id }: TypographyProps) => {
  return (
    <h2
      id={id}
      className={clsx(
        "font-heading text-2xl font-bold uppercase sm:text-3xl lg:text-4xl",
        className
      )}
    >
      {children}
    </h2>
  );
};

const HeadingMedium = ({ children, className, id }: TypographyProps) => {
  return (
    <h3
      id={id}
      className={clsx(
        "font-heading text-xl font-semibold uppercase sm:text-2xl lg:text-3xl",
        className
      )}
    >
      {children}
    </h3>
  );
};

const HeadingSmall = ({ children, className, id }: TypographyProps) => {
  return (
    <h4
      id={id}
      className={clsx(
        "font-heading text-lg font-semibold uppercase sm:text-xl lg:text-2xl",
        className
      )}
    >
      {children}
    </h4>
  );
};

// Body Styles
const BodyLarge = ({ children, className, id }: TypographyProps) => {
  return (
    <p id={id} className={clsx("font-body text-lg sm:text-xl", className)}>
      {children}
    </p>
  );
};

const BodyMedium = ({ children, className, id }: TypographyProps) => {
  return (
    <p id={id} className={clsx("font-body text-base sm:text-lg", className)}>
      {children}
    </p>
  );
};

const BodySmall = ({ children, className, id }: TypographyProps) => {
  return (
    <p id={id} className={clsx("font-body text-sm sm:text-base", className)}>
      {children}
    </p>
  );
};

// Label Styles
const LabelLarge = ({ children, className, id }: TypographyProps) => {
  return (
    <span
      id={id}
      className={clsx(
        "font-body text-sm font-medium uppercase tracking-wide sm:text-base",
        className
      )}
    >
      {children}
    </span>
  );
};

const LabelMedium = ({ children, className, id }: TypographyProps) => {
  return (
    <span
      id={id}
      className={clsx(
        "font-body text-xs font-medium uppercase tracking-wide sm:text-sm",
        className
      )}
    >
      {children}
    </span>
  );
};

const LabelSmall = ({ children, className, id }: TypographyProps) => {
  return (
    <span
      id={id}
      className={clsx(
        "font-body text-[10px] font-medium uppercase tracking-wide sm:text-xs",
        className
      )}
    >
      {children}
    </span>
  );
};

// Caption Styles
const CaptionLarge = ({ children, className, id }: TypographyProps) => {
  return (
    <span
      id={id}
      className={clsx("font-body text-xs text-muted-foreground", className)}
    >
      {children}
    </span>
  );
};

const CaptionSmall = ({ children, className, id }: TypographyProps) => {
  return (
    <span
      id={id}
      className={clsx("font-body text-[10px] text-muted-foreground", className)}
    >
      {children}
    </span>
  );
};

export {
  DisplayLarge,
  DisplayMedium,
  DisplaySmall,
  HeadingLarge,
  HeadingMedium,
  HeadingSmall,
  BodyLarge,
  BodyMedium,
  BodySmall,
  LabelLarge,
  LabelMedium,
  LabelSmall,
  CaptionLarge,
  CaptionSmall,
};
