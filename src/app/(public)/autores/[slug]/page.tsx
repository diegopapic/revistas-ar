export default async function AutorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main>
      <h1>Autor: {slug}</h1>
    </main>
  );
}
