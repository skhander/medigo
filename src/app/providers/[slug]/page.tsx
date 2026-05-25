import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { ProviderDetail } from "@/components/ProviderDetail";
import {
  getProviderBySlug,
  getProviders,
  getSimilarProviders,
} from "@/lib/providers";

interface ProviderPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const providers = await getProviders();
  return providers.map((provider) => ({ slug: provider.slug }));
}

export async function generateMetadata({ params }: ProviderPageProps) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    return { title: "Provider Not Found — MediGo" };
  }

  return {
    title: `${provider.name} — MediGo`,
    description: provider.description,
  };
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { slug } = await params;
  const allProviders = await getProviders();
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  const similarProviders = getSimilarProviders(provider, allProviders);

  return (
    <>
      <Header />
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <ProviderDetail
          provider={provider}
          similarProviders={similarProviders}
        />
      </main>
      <footer className="border-t border-border bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-medium text-ink">
            MediGo — care beyond borders
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            © {new Date().getFullYear()} MediGo. All providers independently
            listed.
          </p>
        </div>
      </footer>
    </>
  );
}
