export default class TrendDbUtils {
  constructor(trendingCollection) {
    this.trendingCollection = trendingCollection;
  }

  async createOrUpdateTrend({ query, update, options }) {
    return this.trendingCollection.findOneAndUpdate(
      query,
      update,
      options,
    );
  }

  async getTotalTrendRants(query) {
    return this.trendingCollection.findOne(query);
  }

  async getTrendsAggregation(pipeline) {
    return this.trendingCollection.aggregate(
      [
        pipeline.matchTrendName,
        pipeline.unwindTrends,
        pipeline.skipAlreadyViewed,
        pipeline.limitTrends,
      ],
    );
  }
}
