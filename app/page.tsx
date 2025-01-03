import { AuthForm } from "@/components/auth-form";

export default async function Home({ searchParams }: { searchParams: Promise<{ mode: 'login' | 'signup' }> }) {
  const {mode = 'login'} = await searchParams;

  if (process.env.ENV === "development") {
    console.log('This is a development environment');
  }
  
  return <AuthForm mode={mode} />;
}
