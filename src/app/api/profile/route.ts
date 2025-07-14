// src/app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const supabase = supabaseServer();
  const { data: profile, error, status } = await supabase
    .from('profiles')
    .select('*')
    .single();

  if (error && status === 401) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }
  if (error && status === 406 /* “no rows” */) {
    // no profile yet
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const supabase = supabaseServer();
  const {
    data: { user },
    error: userErr
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const { display_name, bio } = await req.json();
  if (bio?.length > 200) {
    return NextResponse.json({ error: 'Bio too long' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, display_name, bio }, { onConflict: 'id' })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
