{({ data, loading }) => {
  if (loading) {
    return 'loading';
  }
  if (data) {
    return <div>
      {data.search.edges.map(({ node: { _id, name } }) => {
        return <div key={_id}>{name}</div>;
      })}
    </div>;
  }
  return null;
}}

fetchMore({
  updateQuery(prev, { fetchMoreResult }) {
    if (prev.search.edges.length === 0) {
      return {
        search: {
          ...fetchMoreResult.search,
          edges: fetchMoreResult.search.edges,
        },
      }
    }
    return {
      search: {
        ...fetchMoreResult.search,
        edges: prev.search.edges.concat(fetchMoreResult.search.edges),
      },
    };
  },
  variables: {
    after: data.search.pageInfo.endCursor,
  },
});