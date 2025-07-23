import type { Course, Media as MediaType } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import Link from 'next/link'

type CourseBlockProps = {
  id?: string
  introContent?: any
  limit?: number
  populateBy?: 'collection' | 'selection'
  selectedCourses?: Course[]
}

export const CourseBlock: React.FC<CourseBlockProps> = async (props) => {
  const { id, introContent, limit: limitFromProps, populateBy, selectedCourses } = props

  const limit = limitFromProps || 6

  let courses: Course[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const fetchedCourses = await payload.find({
      collection: 'courses',
      depth: 1,
      limit,
      sort: '-createdAt',
    })

    courses = fetchedCourses.docs
  } else {
    if (selectedCourses?.length) {
      const filteredSelectedCourses = selectedCourses
        .map((course: Course) => {
          if (typeof course === 'object') return course
          return null
        })
        .filter(Boolean) as Course[]

      courses = filteredSelectedCourses.filter(Boolean)
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const courseImage =
              typeof course.courseImage === 'object' ? (course.courseImage as MediaType) : null

            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Course Image */}
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  {courseImage ? (
                    <Media
                      resource={courseImage}
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-6">
                  {/* Course Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>

                  {/* Course Meta */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {course.level}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {course.instrument}
                    </span>
                  </div>

                  {/* Course Description */}
                  {course.content && (
                    <div className="text-gray-600 text-sm line-clamp-3 mb-4">
                      <RichText data={course.content} enableGutter={false} />
                    </div>
                  )}

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {course.lessons?.length || 0} lessons
                      </span>
                      {course.publishedDate && (
                        <span className="text-xs">
                          {new Date(course.publishedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                      Learn More
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* No courses message */}
        {courses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-500">Check back later for new courses.</p>
          </div>
        )}
      </div>
    </div>
  )
}
