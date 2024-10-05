const databinding = {"data":[{"dimensions_0":{"id":"[Product_3e315003an].[Product_Catego_3o3x5e06y2].&[PC4]","label":"Alcohol","isNode":true,"isCollapsed":true},"measures_0":{"raw":173692344,"formatted":"173.69M"}},{"dimensions_0":{"id":"[Product_3e315003an].[Product_Catego_3o3x5e06y2].&[PC1]","label":"Carbonated Drinks","isNode":true,"isCollapsed":true},"measures_0":{"raw":145806660,"formatted":"145.81M"}},{"dimensions_0":{"id":"[Product_3e315003an].[Product_Catego_3o3x5e06y2].&[PC2]","label":"Juices","isNode":true,"isCollapsed":true},"measures_0":{"raw":286772400,"formatted":"286.77M"}},{"dimensions_0":{"id":"[Product_3e315003an].[Product_Catego_3o3x5e06y2].&[PC3]","label":"Others","isNode":true,"isCollapsed":true},"measures_0":{"raw":6651432,"formatted":"6.65M"}}],"metadata":{"feeds":{"measures":{"values":["measures_0"],"type":"mainStructureMember"},"dimensions":{"values":["dimensions_0"],"type":"dimension"}},"dimensions":{"dimensions_0":{"id":"Product_3e315003an","description":"Product"}},"mainStructureMembers":{"measures_0":{"id":"[Account_BestRunJ_sold].[parentId].&[Gross_Margin]","label":"Gross Margin"}}},"state":"success"}


var getScriptPromisify = (src) => {
    return new Promise((resolve) => {
      $.getScript(src, resolve)
    })
  }
  
var parseMetadata = metadata => {
    const { dimensions: dimensionsMap, mainStructureMembers: measuresMap } = metadata
    const dimensions = []
    for (const key in dimensionsMap) {
      const dimension = dimensionsMap[key]
      dimensions.push({ key, ...dimension })
    }
    const measures = []
    for (const key in measuresMap) {
      const measure = measuresMap[key]
      measures.push({ key, ...measure })
    }
    return { dimensions, measures, dimensionsMap, measuresMap }
  }
  
const dataBinding = databinding
      if (!dataBinding || dataBinding.state !== 'success') { return }

      const { data, metadata } = dataBinding
      const { dimensions, measures } = parseMetadata(metadata)
      // dimension
      const categoryData = []

      // measures
      const series = measures.map(measure => {
        return {
          id: measure.id,
          name: measure.label,
          data: [],
          key: measure.key,
          type: 'line',
          smooth: true
        }
      })
      
      data.forEach(row => {
        categoryData.push(dimensions.map(dimension => {
          return row[dimension.key].label
        }).join('/')) // dimension
        series.forEach(series => {
          series.data.push(row[series.key].raw)
        }) // measures
      })

console.group('data');
console.log(data);
console.groupEnd();
console.group('metadata');
console.log(metadata);
console.groupEnd();
console.group('dimensions');
console.log(dimensions);
console.groupEnd();
console.group('measures');
console.log(measures);
console.groupEnd();
console.group('series');
console.log(series);
console.groupEnd();
console.group('categoryData');
console.log(categoryData);
console.groupEnd();
console.group('series');
console.log(series);
console.groupEnd();

