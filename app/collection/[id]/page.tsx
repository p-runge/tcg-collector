import { EditCollectionPageContent } from "./_components/content";

// Server component to fetch params and pass them to the client component
export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: collectionId } = await params;
  if (!collectionId) {
    return null;
  }

  return <EditCollectionPageContent collectionId={collectionId} />;
}

// Client component
