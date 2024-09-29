type Option = {
  keyField?: string;
  parentField?: string;
  childrenField?: string;
};

/**
 * 将数组转换为树形结构
 * @param nodes 节点数组，每个节点包含树形结构的数据
 * @param option 可选参数对象，用于自定义 id、parentId 和 children 的字段名
 * @returns 根节点数组，包含转换后的树形结构的根节点
 *
 * 该函数通过遍历节点数组，根据指定的 id 和 parentId 字段构建树形结构
 * 如果未指定可选参数，将使用默认的字段名
 */
export function arrayToTree(nodes: any[], option?: Option): any {
  // 根据可选参数确定 id、parentId 和 children 的字段名
  const id = option?.keyField || 'id';
  const parentId = option?.parentField || 'parentId';
  const children = option?.childrenField || 'children';
  // 创建一个从 id 到 node 的映射，以便快速查找节点
  const map = new Map<number, any>();
  // 用于存储根节点的数组
  const rootNodes: any[] = [];

  // 创建一个从 id 到 node 的映射
  nodes.forEach((node) => {
    map.set(node[id], node);
  });

  // 遍历所有节点，构建树形结构
  nodes.forEach((node) => {
    // 尝试获取当前节点的父节点
    const parent = node[parentId] ? map.get(node[parentId]) : null;
    if (parent) {
      // 如果父节点存在 children 字段，则将当前节点添加到父节点的 children 数组中
      if (!parent[children]) {
        parent[children] = [];
      }
      parent[children].push(node);
    } else {
      // 如果父节点不存在，则将当前节点作为根节点
      rootNodes.push(node);
    }
  });

  // 返回构建好的根节点数组
  return rootNodes;
}

/**
 * 获取树形结构中的所有父级节点的 id 集合
 * @param tree 树形结构的根节点数组
 * @param nodeId 要获取父级节点 id 集合的目标节点 ID，默认为 undefined，表示获取所有父级节点 id 集合
 * @param option 可选参数对象，用于自定义 id、parentId 和 children 的字段名
 * @returns 包含所有父级节点 id 的数组
 */
export function getTreeParentIds(
  tree: any[],
  nodeId?: string | number,
  option?: Option,
): any {
  // 根据可选参数确定 id、parentId 和 children 的字段名
  const id = option?.keyField || 'id';
  const parentId = option?.parentField || 'parentId';
  const children = option?.childrenField || 'children';

  const ids: string[] = [];

  // 递归函数，用于遍历树形结构并收集所有父级节点的 id
  function collectParentIds(nodes: any[], targetId?: string | number) {
    for (const node of nodes) {
      if (targetId === undefined || node[id] === targetId) {
        ids.push(node[parentId]);
        if (node[parentId] !== undefined) {
          collectParentIds(tree, node[parentId]);
        }
      }
      if (node[children] && node[children].length > 0) {
        collectParentIds(node[children], targetId);
      }
    }
  }

  collectParentIds(tree, nodeId);
  return ids;
}
