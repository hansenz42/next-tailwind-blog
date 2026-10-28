interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Miremo 米墨笔记 ｜ AI Notetaking Tool',
    description:
      '轻松记录，AI 整理，知识图谱索引，高效管理知识。Easy notetaking, AI organization, knowledge graph indexing, efficient knowledge management.',
    imgSrc: '/static/images/miremo.png',
    href: 'https://www.miremoapp.com',
  },
]

export default projectsData
