import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Course, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from 'next/link'
type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Course({ params }: Args) {
  const { slug = '' } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'courses',
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const [course] = result.docs

  if (!course) {
    return notFound()
  }

  const courseImage =
    typeof course.courseImage === 'object' ? (course.courseImage as MediaType) : null
  const courseVideo =
    typeof course.courseVideo === 'object' ? (course.courseVideo as MediaType) : null

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/courses" className="hover:text-blue-600">
              Courses
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">
            {course.title}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content - Course Details */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col gap-8">
            {/* Course Image/Video */}
            <div className="w-full">
              {courseVideo ? (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    controls
                    className="w-full h-full object-cover"
                    poster={courseImage?.url || undefined}
                  >
                    <source src={courseVideo.url || undefined} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : courseImage ? (
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <Media resource={courseImage} imgClassName="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No preview available</span>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {course.level}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {course.instrument}
                </span>
                {course.publishedDate && (
                  <span className="text-sm text-gray-600">
                    Published: {new Date(course.publishedDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Lessons</h3>
                  <p className="text-2xl font-bold text-blue-600">{course.lessons?.length || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">Level</h3>
                  <p className="text-lg font-semibold capitalize">{course.level}</p>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Start Learning
              </button>
            </div>
            {/* Course Content */}
            {course.content && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <div className="prose max-w-none">
                  <RichText data={course.content} enableGutter={false} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 w-[1/3]">
          {/* Course Lessons */}
          {course.lessons && course.lessons.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Course Lessons</h2>
              <div className="space-y-4">
                {course.lessons.map((lesson, index) => {
                  const lessonVideo =
                    typeof lesson.video === 'object' ? (lesson.video as MediaType) : null
                  const isAccessible = lesson.accessLevel === 'free' // You can add user authentication logic here

                  return (
                    <Link
                      key={index}
                      href={isAccessible ? `/courses/${course.slug}/lessons/${index}` : '#'}
                      className={`block border rounded-lg p-4 ${
                        isAccessible ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Lesson Thumbnail */}
                        <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {lessonVideo?.url ? (
                            <video className="w-full h-full object-cover">
                              <source src={lessonVideo.url} type="video/mp4" />
                            </video>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Lesson Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-500">
                              Lesson {index + 1}
                            </span>
                            {lesson.accessLevel === 'free' && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                Free
                              </span>
                            )}
                            {!isAccessible && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                Premium
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{lesson.title}</h3>
                          {lesson.duration && (
                            <p className="text-sm text-gray-600">{lesson.duration}</p>
                          )}
                        </div>

                        {/* Play Button */}
                        <div className="flex-shrink-0">
                          {isAccessible ? (
                            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          ) : (
                            <button className="bg-gray-300 text-gray-500 p-2 rounded-full cursor-not-allowed">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Related Courses */}
          {course.relatedCourses &&
            typeof course.relatedCourses === 'object' &&
            course.relatedCourses !== null && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Related Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(() => {
                    const relatedCourse = course.relatedCourses as Course
                    const relatedImage =
                      typeof relatedCourse.courseImage === 'object'
                        ? (relatedCourse.courseImage as MediaType)
                        : null
                    return (
                      <Link
                        key={relatedCourse.id}
                        href={`/courses/${relatedCourse.slug}`}
                        className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                          {relatedImage ? (
                            <Media
                              resource={relatedImage}
                              imgClassName="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{relatedCourse.title}</h3>
                          <div className="flex gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {relatedCourse.level}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                              {relatedCourse.instrument}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })()}
                </div>
              </div>
            )}
        </div>

        {/* Sidebar - Course Lessons List */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Course Lessons</h3>
            <div className="space-y-2">
              {course.lessons?.map((courseLesson, index) => {
                const lessonAccessible = courseLesson.accessLevel === 'free'

                return (
                  <Link
                    key={index}
                    href={`/courses/${course.slug}/lessons/${index}`}
                    className={`block p-3 rounded-lg transition-colors ${
                      lessonAccessible
                        ? 'hover:bg-gray-50'
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {index + 1}. {courseLesson.title}
                        </p>
                        <p className="text-sm text-gray-500">{courseLesson.duration}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {courseLesson.accessLevel === 'free' ? (
                          <span className="text-green-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        ) : (
                          <span className="text-yellow-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Course Info */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Course Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="font-medium capitalize">{course.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Instrument</p>
                <p className="font-medium">{course.instrument}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Lessons</p>
                <p className="font-medium">{course.lessons?.length || 0}</p>
              </div>
              {course.publishedDate && (
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="font-medium">{new Date(course.publishedDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const courses = await payload.find({
    collection: 'courses',
    depth: 0,
    limit: 1000,
    pagination: false,
    overrideAccess: false,
    select: {
      slug: true,
    },
  })

  const params = courses.docs
    .filter((course) => Boolean(course?.slug))
    .map(({ slug }) => ({ slug }))

  return params
}

export async function generateMetadata({ params }: Args) {
  const { slug = '' } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'courses',
    depth: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const [course] = result.docs

  if (!course) {
    return {
      title: 'Course Not Found',
    }
  }

  const courseImage = course.courseImage as MediaType

  return {
    title: course.meta?.title || course.title,
    description: course.meta?.description,
    openGraph: {
      title: course.meta?.title || course.title,
      description: course.meta?.description,
      images: courseImage?.url ? [courseImage.url] : [],
      type: 'article',
    },
  }
}
