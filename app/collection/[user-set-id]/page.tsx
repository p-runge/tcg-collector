import { EditUserSetPageContent } from "./_components/content";

// Server component to fetch params and pass them to the client component
export default async function EditUserSetPage({
  params,
}: {
  params: Promise<{ ["user-set-id"]: string }>;
}) {
  const { ["user-set-id"]: userSetId } = await params;
  if (!userSetId) {
    return null;
  }

  return <EditUserSetPageContent userSetId={userSetId} />;
}

// Client component
