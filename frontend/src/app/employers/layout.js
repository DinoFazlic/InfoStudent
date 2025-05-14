export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';

const SECRET = process.env.SECRET_KEY;

export default async function EmployersLayout({ children }) {

  const cookieStore = await cookies();
  const token= cookieStore.get('access_token')?.value;

  if (!token) {
    redirect('/login');
  }

  let payload;
  try {
    const { payload: pl } = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET),
      { algorithms: ['HS256'] }
    );
    payload = pl;
  } catch {
    redirect('/login');
  }

  if (payload.role !== 'employer') {
    return redirect('/students/home');
  }


  return <>{children}</>;
}
