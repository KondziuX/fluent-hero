import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function GuidebookPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-950 p-6">
      <Card className="w-full max-w-[600px] dark:bg-slate-900 dark:border-slate-800">
        <CardHeader className="bg-green-500 dark:bg-slate-900 text-white dark:text-neutral-200 rounded-t-xl mb-6 border-b-2 border-transparent dark:border-slate-800">
          <CardTitle className="text-2xl text-center">
            📖 Przewodnik: Powitanie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg leading-relaxed text-slate-700 dark:text-neutral-200">
          <p>
            Witaj w kursie języka angielskiego! W tym rozdziale nauczysz się podstawowych zwrotów.
          </p>
          
          <h3 className="font-bold text-slate-900 dark:text-white mt-4">Słówka kluczowe:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Hello</strong> - Cześć (oficjalne/neutralne)</li>
            <li><strong>Hi</strong> - Cześć (koleżeńskie)</li>
            <li><strong>Goodbye</strong> - Do widzenia</li>
          </ul>

          <div className="pt-6">
             <Link href="/learn">
                <Button className="w-full" size="lg" variant="default">
                    Wróć do lekcji
                </Button>
             </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}