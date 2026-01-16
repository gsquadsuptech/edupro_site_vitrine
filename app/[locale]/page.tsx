import { HomeView } from "@/components/pages/home/home-view";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    // const resolvedParams = await params;
    // const locale = resolvedParams.locale;

    return <HomeView />;
}
