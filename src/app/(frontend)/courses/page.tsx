import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Course, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import Link from 'next/link'

export default async function CoursesPage() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'courses',
    depth: 1,
    limit: 100,
    sort: '-publishedDate',
  })

  const courses = result.docs

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Music Courses</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Learn music with our comprehensive courses designed for all skill levels. 
          From beginner basics to advanced techniques.
        </p>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const courseImage = typeof course.courseImage === 'object' ? course.courseImage as MediaType : null
            const lessonCount = course.lessons?.length || 0
            const freeLessons = course.lessons?.filter(lesson => lesson.accessLevel === 'free').length || 0

            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Course Image */}
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  {courseImage?.url ? (
                    <Media
                      resource={courseImage}
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {lessonCount} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {course.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                      {course.instrument}
                    </span>
                  </div>

                  {/* Course Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.level === 'beginner' 
                        ? 'bg-green-100 text-green-800'
                        : course.level === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {course.level}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {course.instrument}
                    </span>
                    {freeLessons > 0 && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {freeLessons} free lesson{freeLessons !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Course Description */}
                  {course.meta?.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.meta.description}
                    </p>
                  )}

                  {/* Published Date */}
                  {course.publishedDate && (
                    <p className="text-xs text-gray-500">
                      Published {new Date(course.publishedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Course Footer */}
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">
                      View Course
                    </span>
                    <svg className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No courses available</h3>
          <p className="text-gray-600">Check back later for new courses!</p>
        </div>
      )}

      {/* Course Statistics */}
      {courses.length > 0 && (
        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{courses.length}</div>
              <div className="text-gray-600">Total Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {courses.reduce((total, course) => total + (course.lessons?.length || 0), 0)}
              </div>
              <div className="text-gray-600">Total Lessons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {courses.reduce((total, course) => 
                  total + (course.lessons?.filter(lesson => lesson.accessLevel === 'free').length || 0), 0
                )}
              </div>
              <div className="text-gray-600">Free Lessons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {[...new Set(courses.map(course => course.instrument))].length}
              </div>
              <div className="text-gray-600">Instruments</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: 'Music Courses - Learn Music Online',
    description: 'Discover our comprehensive music courses for all skill levels. Learn guitar, piano, drums, and more with expert instruction.',
    openGraph: {
      title: 'Music Courses - Learn Music Online',
      description: 'Discover our comprehensive music courses for all skill levels. Learn guitar, piano, drums, and more with expert instruction.',
      type: 'website',
    },
  }
}
