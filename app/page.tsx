import { AuthForm } from "@/components/auth-form";

export default async function Home({ searchParams }: { searchParams: Promise<{ mode: 'login' | 'signup' }> }) {
  const {mode = 'login'} = await searchParams;
  return <AuthForm mode={mode} />;
}
