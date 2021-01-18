import mongoose from 'mongoose';

import TrendAgainstCollection from '../../enums/db.enums.js';

const TrendsSchema = new mongoose.Schema({

  trendId: {
    type: String,
    index: true,
  },

  trendName: {
    type: String,
    unique: true,
  },

  trend: [{
    againstCollection: {
      type: String,
      enum: TrendAgainstCollection,
    },
    uniqueIdentifier: String,
  }],

}, { timestamp: true });

const TrendsCollection = mongoose.model('Trends', TrendsSchema);

export default TrendsCollection;
