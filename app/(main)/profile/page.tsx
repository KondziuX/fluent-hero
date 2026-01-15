import { UserButton } from '@clerk/nextjs';

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Twój Profil</h1>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}