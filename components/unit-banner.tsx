import { MessageCircle } from "lucide-react";

type Props = {
  title: string;
  description: string;
};

export const UnitBanner = ({
  title,
  description,
}: Props) => {
  return (
    <div className="w-full rounded-xl bg-emerald-700 dark:bg-slate-900 p-5 text-white dark:text-neutral-200 flex items-center justify-between shadow-md mb-6 border-2 border-white/20 dark:border-slate-800">
      <div className="space-y-2.5">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-lg text-emerald-100 dark:text-slate-400 flex items-center gap-2">
          <MessageCircle className="size-5 shrink-0" />
          {description}
        </p>
      </div>
    </div>
  );
};
