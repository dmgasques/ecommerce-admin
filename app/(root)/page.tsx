import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <main>
      <UserButton afterSignOutUrl='/' />
      <Button>Click me</Button>
    </main>
  );
}
