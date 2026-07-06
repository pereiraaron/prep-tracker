import { toast } from "@components/ui/sonner";

const STREAK_MILESTONES = [7, 14, 30, 50, 100];

export interface CelebrateSolveParams {
  wasFirstQuestion?: boolean;
  previousStreak?: number;
  currentStreak?: number;
}

export const celebrateSolve = ({
  wasFirstQuestion,
  previousStreak = 0,
  currentStreak = 0,
}: CelebrateSolveParams) => {
  if (wasFirstQuestion) {
    toast.success("First question logged! 🎯", { duration: 4500 });
    return;
  }

  if (currentStreak > previousStreak && STREAK_MILESTONES.includes(currentStreak)) {
    toast.success(`${currentStreak}-day streak! Keep it going 🔥`, { duration: 5000 });
    return;
  }

  toast.success("Nice work — question saved! 🎉");
};
