const getTreeData = (nestedTreeData) => {
  return nestedTreeData.map((item) => ({
    ...item,
    hasChildren: nestedTreeData.filter((nested) => nested.parentId === item.id),
  }));
};

export default getTreeData;
