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
  {
    title: '阿森知识库 ｜ My Bidirectional Knowledge Base',
    description:
      '使用 Obsidian 双链笔记知识库，涵盖计算机科学、数学、机器学习、软件工程、文史哲的个人笔记。Using Obsidian for bidirectional linked notes, covering personal notes in computer science, mathematics, machine learning, software engineering, and humanities.',
    imgSrc: '/static/images/project-garden.png',
    href: 'https://garden.assen.top',
  },
  {
    title: 'JSON Sampler | JSON 简短示例生成工具',
    description:
      '写技术文档时，是否因为 JSON 列表过长而困扰？JSON Sampler 可对 JSON 中的列表采样，生成一个简短的 JSON 示例。When writing technical documentation, do you struggle with long JSON lists? JSON Sampler can sample lists in JSON to generate a concise JSON example.',
    imgSrc: '/static/images/project-sampler.png',
    href: 'https://sampler.assen.top',
  },
]

export default projectsData
