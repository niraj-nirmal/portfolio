// Fetches GitHub + LeetCode profile data at build time.
// On any failure the committed JSON in src/data/ is kept as a fallback,
// so a flaky API can never break a deploy.
import { writeFile, readFile } from 'node:fs/promises';

const GH_USER = 'niraj-nirmal';
const LC_USER = 'NirajNirmal';
const UA = { 'User-Agent': 'portfolio-build' };

async function save(path, data) {
  await writeFile(path, JSON.stringify(data, null, 2) + '\n');
  console.log(`wrote ${path}`);
}

async function fetchGithub() {
  const headers = { ...UA, Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const repoRes = await fetch(`https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=10`, { headers });
  if (!repoRes.ok) throw new Error(`repos ${repoRes.status}`);
  const repos = (await repoRes.json())
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name,
      url: r.html_url,
      description: r.description,
      stars: r.stargazers_count,
      language: r.language,
    }))
    .slice(0, 5);

  // Public contributions calendar (no auth needed).
  const calRes = await fetch(`https://github.com/users/${GH_USER}/contributions`, { headers: UA });
  if (!calRes.ok) throw new Error(`contributions ${calRes.status}`);
  const html = await calRes.text();
  const days = [...html.matchAll(/data-date="([\d-]+)"[^>]*data-level="(\d)"/g)]
    .map((m) => ({ date: m[1], level: Number(m[2]) }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in the last year/);

  await save('src/data/github.json', {
    user: GH_USER,
    fetchedAt: new Date().toISOString(),
    totalContributions: totalMatch ? Number(totalMatch[1].replace(/,/g, '')) : null,
    // last ~26 weeks keeps the heatmap compact
    calendar: days.slice(-182),
    repos,
  });
}

async function fetchLeetcode() {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com', ...UA },
    body: JSON.stringify({
      query: `{ matchedUser(username: "${LC_USER}") {
        username
        profile { ranking }
        submitStatsGlobal { acSubmissionNum { difficulty count } }
      } allQuestionsCount { difficulty count } }`,
    }),
  });
  if (!res.ok) throw new Error(`leetcode ${res.status}`);
  const { data } = await res.json();
  if (!data?.matchedUser) throw new Error('leetcode: no user');
  const counts = Object.fromEntries(
    data.matchedUser.submitStatsGlobal.acSubmissionNum.map((x) => [x.difficulty.toLowerCase(), x.count])
  );
  const totals = Object.fromEntries(
    (data.allQuestionsCount ?? []).map((x) => [x.difficulty.toLowerCase(), x.count])
  );
  await save('src/data/leetcode.json', {
    user: LC_USER,
    fetchedAt: new Date().toISOString(),
    ranking: data.matchedUser.profile?.ranking ?? null,
    solved: { all: counts.all ?? 0, easy: counts.easy ?? 0, medium: counts.medium ?? 0, hard: counts.hard ?? 0 },
    totals: { all: totals.all ?? null },
  });
}

for (const [name, fn] of [['github', fetchGithub], ['leetcode', fetchLeetcode]]) {
  try {
    await fn();
  } catch (err) {
    console.warn(`${name}: fetch failed (${err.message}); keeping committed fallback data`);
    try {
      await readFile(`src/data/${name}.json`);
    } catch {
      console.error(`${name}: no fallback data present either`);
      process.exitCode = 1;
    }
  }
}
