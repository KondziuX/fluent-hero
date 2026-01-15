import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Fluent-Hero MVP</h1>
        <p className="text-muted-foreground">
          Weryfikacja instalacji shadcn/ui (Task A2)
        </p>
      </div>

      {/* Karta testowa */}
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Test Karty</CardTitle>
          <CardDescription>Komponenty UI zostały zainstalowane.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            {/* Dialog testowy */}
            <Dialog>
              <DialogTrigger asChild>
                <Button>Otwórz Dialog Testowy</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>To jest testowy dialog</DialogTitle>
                  <DialogDescription>
                    Jeśli to widzisz i konsola jest czysta, shadcn działa
                    poprawnie.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Input id="name" placeholder="Test inputa..." />
                  </div>
                  <Button type="submit">Zatwierdź (Fake)</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}