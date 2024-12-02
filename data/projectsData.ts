interface Project {
  title: string,
  description: string,
  href?: string,
  imgSrc?: string,
}

const projectsData: Project[] = [
  {
    title: '正转裁判 —— 模仿逆转裁判的 AI 对话小游戏',
    description: `就像《逆转裁判》那样，AI 扮演证人，而你作为侦探，要找到证人言词中的矛盾，并用证据指出对方的矛盾，找到事情的真相`,
    imgSrc: '/static/images/project-lawyer.jpg',
    href: 'https://suspect.assen.top',
  },
  {
    title: '🎄 阿森的花园 —— 个人知识管理数据库',
    description: '利用双链笔记软件 Obsidian 制作的知识库网站，我会将关于计算机，世界观，数学和产品的笔记整理在里面。知识库中的内容不在乎有多完整，而在于它是不断进化的。',
    imgSrc: '/static/images/project-garden.png',
    href: 'https://garden.assen.top',
  },
]

export default projectsData
