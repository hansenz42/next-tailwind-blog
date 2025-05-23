interface Project {
  title: string,
  description: string,
  href?: string,
  imgSrc?: string,
}

const projectsData: Project[] = [
  // {
  //   title: '正转裁判 —— 模仿逆转裁判的 AI 对话小游戏',
  //   description: `就像《逆转裁判》那样，AI 扮演证人，而你作为侦探，要找到证人言词中的矛盾，并用证据指出对方的矛盾，找到事情的真相`,
  //   imgSrc: '/static/images/project-lawyer.jpg',
  //   href: 'https://suspect.assen.top',
  // },
  {
    title: '个人知识库',
    description:
      '使用 Obsidian 双链笔记知识库，涵盖计算机科学、数学、机器学习、软件工程、文史哲的个人笔记。',
    imgSrc: '/static/images/project-garden.png',
    href: 'https://garden.assen.top',
  },
  {
    title: 'MindGraph | 小红书分享图生成器',
    description: '使用一段文字，生成可以小红书风格的图片，DeepSeek + HTML + Canvas 生成并渲染',
    imgSrc: '/static/images/project-mindgraph.png',
    href: 'https://mindgraph.assen.top',
  },
]

export default projectsData
