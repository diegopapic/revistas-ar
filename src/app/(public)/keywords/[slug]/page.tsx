export default async function KeywordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main>
      <h1>Keyword: {slug}</h1>
    </main>
  );
}
