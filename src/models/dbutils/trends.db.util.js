export default class TrendDbUtils {
  constructor(trendsCollection) {
    this.trendsCollection = trendsCollection;
  }

  async createOrUpdateTrend({ query, update, options }) {
    return this.trendsCollection.bulkWrite([
      {
        updateMany: {
          filter: query,
          update,
          ...options,
        },
      },
    ]);
  }

  async getTotalTrendRants(query) {
    return this.trendsCollection.findOne(query);
  }

  async getTrendsAggregation(pipeline) {
    return this.trendsCollection.aggregate(
      [
        pipeline.matchTrendName,
        pipeline.unwindTrends,
        pipeline.removeFields,
        pipeline.skipAlreadyViewed,
        pipeline.limitTrends,
      ],
    );
  }
}
