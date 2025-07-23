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
    lessonIndex?: string
  }>
}

export default async function LessonPage({ params }: Args) {
  const { slug, lessonIndex } = await params

  if (!slug || !lessonIndex) {
    notFound()
  }

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
    notFound()
  }

  const lessonIdx = parseInt(lessonIndex, 10)
  if (isNaN(lessonIdx) || lessonIdx < 0 || !course.lessons || lessonIdx >= course.lessons.length) {
    notFound()
  }

  const lesson = course.lessons[lessonIdx]
  if (!lesson) {
    notFound()
  }

  const lessonVideo = typeof lesson.video === 'object' ? lesson.video : null
  const isAccessible = lesson.accessLevel === 'free' // Add authentication logic here

  // Debug logging
  console.log('Lesson data:', {
    lessonTitle: lesson.title,
    lessonVideo: lessonVideo,
    videoUrl: lessonVideo?.url,
    isAccessible: isAccessible,
    accessLevel: lesson.accessLevel,
  })

  // Navigation
  const prevLesson = lessonIdx > 0 ? course.lessons[lessonIdx - 1] : null
  const nextLesson = lessonIdx < course.lessons.length - 1 ? course.lessons[lessonIdx + 1] : null

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
          <li>
            <Link href={`/courses/${course.slug}`} className="hover:text-blue-600">
              {course.title}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">
            Lesson {lessonIdx + 1}: {lesson.title}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content - Lesson Video and Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Lesson Video */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {!isAccessible ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-600 mb-4">This lesson requires premium access</p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            ) : lessonVideo?.url ? (
              <video controls className="w-full h-full object-cover">
                <source src={lessonVideo.url || undefined} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : lessonVideo ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p>Video available but no URL found</p>
                  <p className="text-sm mt-2">
                    Video ID: {typeof lessonVideo === 'string' ? lessonVideo : 'Object without URL'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p>No video available for this lesson</p>
                  <p className="text-sm mt-2">Access Level: {lesson.accessLevel}</p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {lesson.duration}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lesson.accessLevel === 'free'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {lesson.accessLevel === 'free' ? 'Free' : 'Premium'}
                  </span>
                  <span>
                    Lesson {lessonIdx + 1} of {course.lessons?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          {lesson.content && isAccessible && (
            <div className="prose max-w-none">
              <RichText data={lesson.content} enableGutter={false} />
            </div>
          )}

          {/* Downloadable Resources */}
          {lesson.resources && lesson.resources.length > 0 && isAccessible && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Downloadable Resources</h3>
              <div className="space-y-3">
                {lesson.resources.map((resource, index) => {
                  const resourceFile = typeof resource.file === 'object' ? resource.file : null
                  if (!resourceFile) return null

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white rounded border"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="font-medium">{resource.label || resourceFile.filename}</p>
                        <p className="text-sm text-gray-500">
                          {resourceFile.mimeType} •{' '}
                          {Math.round((resourceFile.filesize || 0) / 1024)} KB
                        </p>
                      </div>
                      <a
                        href={resourceFile.url || '#'}
                        download
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        Download
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t">
            <div>
              {prevLesson && (
                <Link
                  href={`/courses/${course.slug}/lessons/${lessonIdx - 1}`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Previous: {prevLesson.title}
                </Link>
              )}
            </div>
            <div>
              {nextLesson && (
                <Link
                  href={`/courses/${course.slug}/lessons/${lessonIdx + 1}`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  Next: {nextLesson.title}
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Course Lessons List */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Course Lessons</h3>
            <div className="space-y-2">
              {course.lessons?.map((courseLesson, index) => {
                const isCurrentLesson = index === lessonIdx
                const lessonAccessible = courseLesson.accessLevel === 'free'

                return (
                  <Link
                    key={index}
                    href={`/courses/${course.slug}/lessons/${index}`}
                    className={`block p-3 rounded-lg transition-colors ${
                      isCurrentLesson
                        ? 'bg-blue-100 border-l-4 border-blue-600'
                        : lessonAccessible
                          ? 'hover:bg-gray-50'
                          : 'opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p
                          className={`font-medium ${isCurrentLesson ? 'text-blue-900' : 'text-gray-900'}`}
                        >
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
                        {isCurrentLesson && (
                          <span className="text-blue-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
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
                <p className="text-sm text-gray-600">Course</p>
                <p className="font-medium">{course.title}</p>
              </div>
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
            </div>
            <Link
              href={`/courses/${course.slug}`}
              className="block w-full mt-4 bg-gray-100 text-gray-700 text-center py-2 rounded hover:bg-gray-200 transition-colors"
            >
              Back to Course
            </Link>
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
    limit: 1000,
    depth: 1,
  })

  const params: { slug: string; lessonIndex: string }[] = []

  courses.docs.forEach((course) => {
    if (course.lessons && Array.isArray(course.lessons) && course.slug) {
      course.lessons.forEach((_, index) => {
        params.push({
          slug: course.slug!,
          lessonIndex: index.toString(),
        })
      })
    }
  })

  return params
}

export async function generateMetadata({ params }: Args) {
  const { slug, lessonIndex } = await params

  if (!slug || !lessonIndex) {
    return {
      title: 'Lesson Not Found',
    }
  }

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
      title: 'Lesson Not Found',
    }
  }

  const lessonIdx = parseInt(lessonIndex, 10)
  if (isNaN(lessonIdx) || lessonIdx < 0 || !course.lessons || lessonIdx >= course.lessons.length) {
    return {
      title: 'Lesson Not Found',
    }
  }

  const lesson = course.lessons[lessonIdx]

  if (!lesson) {
    return {
      title: 'Lesson Not Found',
    }
  }

  return {
    title: `${lesson.title} - ${course.title}`,
    description: `Lesson ${lessonIdx + 1} of ${course.title}: ${lesson.title}. Duration: ${lesson.duration || 'N/A'}`,
    openGraph: {
      title: `${lesson.title} - ${course.title}`,
      description: `Lesson ${lessonIdx + 1} of ${course.title}: ${lesson.title}. Duration: ${lesson.duration || 'N/A'}`,
    },
  }
}
