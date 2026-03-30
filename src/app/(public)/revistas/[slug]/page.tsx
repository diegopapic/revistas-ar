export default async function RevistaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main>
      <h1>Revista: {slug}</h1>
    </main>
  );
}
