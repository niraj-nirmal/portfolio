import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('writing', ({ data }) => !data.draft && !data.placeholder);
  return rss({
    title: 'Niraj Nirmal — Writing',
    description: 'Articles on MLOps, model evaluation and responsible AI.',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/portfolio/writing/${post.id}/`,
      })),
  });
}
