export const buildPagination = (page, limit) => [
  { $skip: (page - 1) * limit },
  { $limit: limit },
];

export const buildAuthorLookup = () => [
  {
    $lookup: {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "authorData",
    },
  },
  { $unwind: { path: "$authorData", preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      author: {
        _id: "$authorData._id",
        fullName: "$authorData.fullName",
        personalPhoto: "$authorData.personalPhoto",
        role: "$authorData.role",
      },
    },
  },
  { $project: { authorData: 0 } },
];

export const buildCommentLookup = () => [
  {
    $lookup: {
      from: "comments",
      let: { postId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$post", "$$postId"] },
                { $eq: ["$isDeleted", false] },
              ],
            },
          },
        },
        { $count: "count" },
      ],
      as: "commentMetrics",
    },
  },
  {
    $addFields: {
      commentCount: { $arrayElemAt: ["$commentMetrics.count", 0] },
    },
  },
  { $project: { commentMetrics: 0 } },
];
