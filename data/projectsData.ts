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
]

export default projectsData
