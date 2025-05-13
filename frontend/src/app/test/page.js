import PostCard from '@/components/PostCard';

export default function TestPage() {
  const demo = {
    id: 1,
    authorName: 'Edah Ždralovč',
    authorAvatarUrl: '/illustrations/test-kartice.jpg',   // stavi bilo koju sličicu u public/avatars
    createdAt: '2025-05-13T10:05:00Z',
    body: 'Nudim materijale za OPA a bogme i instrukcije.Cijena 50 KM po satu ',
  };

  return (
    <main className="p-8 max-w-lg mx-auto">
      <PostCard post={demo} />
    </main>
  );
}
