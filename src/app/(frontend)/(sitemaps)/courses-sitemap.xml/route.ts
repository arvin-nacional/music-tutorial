import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getCoursesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'localhost:3000'

    const results = await payload.find({
      collection: 'courses',
      overrideAccess: false,
      draft: false,
      depth: 1, // Include lessons data
      limit: 1000,
      pagination: false,
      select: {
        slug: true,
        updatedAt: true,
        lessons: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap: Array<{ loc: string; lastmod: string }> = []

    // Add the main courses index page
    sitemap.push({
      loc: `${SITE_URL}/courses`,
      lastmod: dateFallback,
    })

    if (results.docs) {
      results.docs
        .filter((course) => Boolean(course?.slug))
        .forEach((course) => {
          // Add course overview page
          sitemap.push({
            loc: `${SITE_URL}/courses/${course.slug}`,
            lastmod: course.updatedAt || dateFallback,
          })

          // Add individual lesson pages
          if (course.lessons && Array.isArray(course.lessons)) {
            course.lessons.forEach((_, lessonIndex) => {
              sitemap.push({
                loc: `${SITE_URL}/courses/${course.slug}/lessons/${lessonIndex}`,
                lastmod: course.updatedAt || dateFallback,
              })
            })
          }
        })
    }

    return sitemap
  },
  ['courses-sitemap'],
  {
    tags: ['courses-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getCoursesSitemap()

  return getServerSideSitemap(sitemap)
}
