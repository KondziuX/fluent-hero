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
    <div className="w-full rounded-[24px] bg-gradient-to-r from-[#8B5CF6] to-[#2563EB] p-5 md:p-6 text-white flex items-center justify-between shadow-[0_8px_24px_rgba(15,23,42,0.08)] mb-6">
      <div className="space-y-2.5">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-base text-white/80 flex items-center gap-2">
          <MessageCircle className="size-5 shrink-0" />
          {description}
        </p>
      </div>
    </div>
  );
};
