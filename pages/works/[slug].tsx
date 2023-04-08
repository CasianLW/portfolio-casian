// import ContectComponent from '@/components/contact-components/formComponent'
import { Seo } from '@/cas-types'
import SeoComponent from '@/components/shared/seo-component'
import { getPageSeoBySlug } from '@/utils/page-seo-api'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useEffect } from 'react'
import { IWork } from '@/@types/work'
import { ParsedUrlQuery } from 'querystring'
import { log } from 'util'
import { IWorkInfo } from '../admin/works/[id]'

interface Props {
  seo: Seo
  work: IWorkInfo | null
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.URL}/api/works`, {
    method: 'GET',
  })
  const { works } = await res.json()

  const paths = works
    .filter((work: IWork) => work.published) // Only include published works
    .map((work: IWork) => ({
      params: {
        slug: work.slug,
      },
    }))

  return {
    paths,
    fallback: false,
  }
}

const getWorkDetails = async (workSlug: string): Promise<{ props: { seo: Seo; work: IWorkInfo | null } }> => {
  try {
    const response = await fetch(`${process.env.URL}/api/works/${workSlug}`, {
      method: 'GET',
    })
    const data = await response.json()

    if (response.ok) {
      const work = data.data
      return {
        props: {
          seo: {
            title: work?.seo?.title || '',
            description: work?.seo?.description || '',
          },
          work,
        },
      }
    }
    throw console.error()
  } catch (error: any) {
    console.log('pagesworks[slug].tsx: ', error)
    return {
      props: {
        seo: {
          title: 'Projets Fullstack developer & UX / UI DESIGNER',
          description: 'Bienvenue sur mon site',
        },
        work: null,
      },
    }
  }
}

interface Params extends ParsedUrlQuery {
  slug: string
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as Params
  return await getWorkDetails(slug)
}
const SingleWorkPage: NextPage<Props> = ({ seo, work }) => {
  if (work) {
    return (
      <>
        <SeoComponent seo={seo} />
        <header className="top-header lateral-space">
          <h1 className="main-title">Single Work Page</h1>
          <div>- {work.title}</div>
        </header>
      </>
    )
  }
  return (
    <>
      <SeoComponent seo={{ title: 'Work Not Found', description: 'Work Not Found' }} />
      <header className="top-header lateral-space">
        <h1 className="main-title">{seo.title}</h1>
      </header>
    </>
  )
}

export default SingleWorkPage