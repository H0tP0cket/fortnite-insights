import { NextResponse, NextRequest } from 'next/server';
import { load } from 'cheerio';
// @ts-ignore: no types for arima
import Arima from 'arima';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const mapCode = params.code;
  const origin = request.nextUrl.origin;

  const pageRes = await fetch(`https://fortnite.gg/island?code=${mapCode}`);
  if (!pageRes.ok) {
    return NextResponse.json({ error: 'Map not found' }, { status: 404 });
  }
  const html = await pageRes.text();
  const $ = load(html);
  const chartId = $('.timeline-chart').attr('data-id');
  if (!chartId) {
    return NextResponse.json({ error: 'Chart ID missing' }, { status: 500 });
  }

  const allHistRes = await fetch(
    `https://fortnite.gg/player-count-graph?range=all&id=${chartId}`
  );
  if (!allHistRes.ok) {
    return NextResponse.json({ error: 'History fetch failed' }, { status: 502 });
  }
  const allJson = await allHistRes.json();
  const { start, step, values } = allJson.data;

  const history = values.map((count: number, idx: number) => {
    const ts = (start + step * idx) * 1000;
    return {
      date: new Date(ts).toISOString().split('T')[0],
      players: count,
    };
  });

  const rawSeries = values;
  const arima = new Arima({
    auto: false,
    p: 1, d: 1, q: 1,
    P: 1, D: 1, Q: 1, 
    s: 30,            
    verbose: false,
    approximation: false,
    method: 0,
  }).train(rawSeries);

  const [predictions] = arima.predict(30);

  const maxHist = Math.max(...rawSeries);
  const minHist = Math.min(...rawSeries);
  const topBound = maxHist * 1.1;
  const botBound = Math.max(0, minHist * 0.9);

  const lastDate = new Date(history[history.length - 1].date);
  const forecast = predictions.map((pred: number, i: number) => {
    const d = new Date(lastDate);
    d.setDate(d.getDate() + i + 1);
    const bounded = Math.min(topBound, Math.max(botBound, pred));
    return {
      date: d.toISOString().split('T')[0],
      players: Math.round(bounded),
    };
  });

  return NextResponse.json({ history, forecast });
}
