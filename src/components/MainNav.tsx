import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        to="/"
        className="text-lg font-medium transition-colors hover:text-primary"
      >
        FitFlow
      </Link>
      <Link
        to="/calendar"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Calendar
      </Link>
      <Link
        to="/workout-library"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Workout Library
      </Link>
      <Link
        to="/strength"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Strength
      </Link>
      <Link
        to="/mobility"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Mobility
      </Link>
      <Link
        to="/cardio"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Cardio
      </Link>
      <Link
        to="/other"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Other
      </Link>
    </nav>
  );
} 