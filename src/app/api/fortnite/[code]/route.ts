import { NextResponse, NextRequest } from 'next/server';
import { load } from 'cheerio';

export async function GET(request: NextRequest) {
  const parts = new URL(request.url).pathname.split('/');
  const mapCode = parts.at(-1);


  const pageUrl = `https://fortnite.gg/island?code=${mapCode}`;
  const pageRes = await fetch(pageUrl);
  if (!pageRes.ok) {
    return NextResponse.json(
      { error: `Failed to fetch island page (${pageRes.status})` },
      { status: 502 }
    );
  }
  const html = await pageRes.text();


  const $ = load(html);
  const dataId = $('div.timeline-chart').attr('data-id');
  if (!dataId) {
    return NextResponse.json(
      { error: 'Could not find data-id in island HTML' },
      { status: 404 }
    );
  }


  const versionsUrl = `https://fortnite.gg/player-count-graph?range=1d&id=${dataId}&versions`;
  const versionsRes = await fetch(versionsUrl);
  if (!versionsRes.ok) {
    return NextResponse.json(
      { error: `Failed to fetch versions (${versionsRes.status})` },
      { status: versionsRes.status }
    );
  }
  const versions: string[] = await versionsRes.json();

  const bestRange = versions
    .sort((a, b) => parseInt(b) - parseInt(a))[0];


  const statsUrl = `https://fortnite.gg/player-count-graph?range=${bestRange}&id=${dataId}`;
  const statsRes = await fetch(statsUrl);
  if (!statsRes.ok) {
    return NextResponse.json(
      { error: `Failed to fetch stats (${statsRes.status})` },
      { status: statsRes.status }
    );
  }
  const raw: any = await statsRes.json();

  const { start, step, values } = raw.data;
  const history = values.map((count: number, i: number) => {
    const ts = (start + step * i) * 1000;
    const date = new Date(ts).toISOString().split('T')[0];
    return { date, players: count };
  });
  const current = history.length ? history[history.length - 1].players : 0;

  return NextResponse.json({ current, history });
}
