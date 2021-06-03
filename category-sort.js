module.exports = function sortCategoriesForInsert(categories) {
  const indexedByParentId = {};
  const parents = [];

    // index children by their parent id
  categories.forEach(cat => {
    if (!cat.parent_id) {
      // this is a parent
      parents.push(cat);
      return;
    }

    if (!indexedByParentId[cat.parent_id]) {
      indexedByParentId[cat.parent_id] = [];
    }

    indexedByParentId[cat.parent_id].push(cat);
  });
  
  // to recursively get children for the given id
  const getChildren = (id) => {
    const foundChildren = [];
    (indexedByParentId[id] || []).forEach(cat => {
      foundChildren.push(cat, ...getChildren(cat.id));
    });
    return foundChildren;
  }

  // add children to parents
  return parents
    .reduce((acc, curr) => ([...acc, curr, ...getChildren(curr.id)]), []);
}