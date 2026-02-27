import { LuBookOpen, LuPlus, LuArchive, LuChartBar } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const ACTIONS = [
  {
    icon: <LuPlus size={20} />,
    title: "New Question",
    description: "Log a solved question",
    path: "/questions/new",
    color: "#22c55e",
  },
  {
    icon: <LuBookOpen size={20} />,
    title: "Browse All",
    description: "View & filter questions",
    path: "/questions",
    color: "#3b82f6",
  },
  {
    icon: <LuArchive size={20} />,
    title: "Backlog",
    description: "Save for later",
    path: "/backlog",
    color: "#f97316",
  },
  {
    icon: <LuChartBar size={20} />,
    title: "View Stats",
    description: "Charts & insights",
    path: "/stats",
    color: "#9333ea",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      {ACTIONS.map((action) => (
        <div
          key={action.title}
          className="flex items-center gap-4 glass-card rounded-xl p-4 cursor-pointer hover:border-purple-500/30 hover:bg-purple-500/5 transition-colors"
          onClick={() => navigate(action.path)}
        >
          <div
            className="w-10 h-10 rounded-lg bg-(--muted) flex items-center justify-center shrink-0"
            style={{ color: action.color }}
          >
            {action.icon}
          </div>
          <div>
            <p className="text-sm font-semibold">
              {action.title}
            </p>
            <p className="text-xs text-(--muted-foreground)">
              {action.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;
