import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const SECRET = process.env.REVALIDATE_SECRET ?? 'mocphim-revalidate-2026';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  if (body.secret !== SECRET) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const paths: string[] = Array.isArray(body.paths) ? body.paths : ['/'];

  for (const p of paths) {
    // Root layout revalidation covers all pages
    if (p === '/') {
      revalidatePath('/', 'layout');
    } else {
      // Specific page — invalidate both page and layout cache
      revalidatePath(p, 'page');
      revalidatePath(p, 'layout');
    }
  }

  return NextResponse.json({ success: true, revalidated: paths });
}
