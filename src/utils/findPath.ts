import { edge } from '@/utils/types/findPath'
export const getPath = (
  source: edge['source'],
  target: edge['target'],
  edges: edge[]
) => {
  const pathArrAll: edge[][] = []
  const makePath = (source: edge['source'], pathArr: edge[] = []) => {
    edges.map((item) => {
      if (item.source == source) {
        const getArr: edge[] = [...pathArr, item]
        pathArrAll.push(getArr)
        makePath(item.target, getArr)
      }
    })
  }
  makePath(source)
  const getTarget = (target: edge['target']) => {
    const targetPath: edge[][] = []
    pathArrAll.map((item) => {
      if (item[item.length - 1].target == target) {
        targetPath.push(item)
      }
    })
    return targetPath
  }
  return getTarget(target)
}
