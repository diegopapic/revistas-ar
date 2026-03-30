export default async function SeccionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main>
      <h1>Sección: {slug}</h1>
    </main>
  );
}
