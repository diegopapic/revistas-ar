export default async function ArticuloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main>
      <h1>Artículo: {slug}</h1>
    </main>
  );
}
