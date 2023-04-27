const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

/* With a JSON doc - query using JSON DOCS 
Person.
  find({
    occupation: /host/,
    'name.last': 'Ghost',
    age: { $gt: 17, $lt: 66 },
    likes: { $in: ['vaporizing', 'talking'] }
  }).
  limit(10).
  sort({ occupation: -1 }).
  select({ name: 1, occupation: 1 }).
  exec(callback);

  // find() - filters
  // limit() - limit
  // sort() - sorting
  // select() - which fields to return

// Using query builder
  Person.
    find({ occupation: /host/ }).
    where('name.last').equals('Ghost').
    where('age').gt(17).lt(66).
    where('likes').in(['vaporizing', 'talking']).
    limit(10).
    sort('-occupation').
    select('name occupation').
    exec(callback);
*/

// 09:16:38 - Heroku
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  // get all jobs createdBy specific user

  res.status(StatusCodes.OK).send({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  // get userId from req.user.userId
  // get jobId  from req.params.id

  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  // get job with the id of jobID and that is created by

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  // req.user.userId - is property created in auth middleware

  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw BadRequestError("Company or Position field is missing");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId }, // filter
    req.body, // data that we are sending
    { new: true, runValidators: true }
    // new: true - returns modified documend instead of the old one
    // runValidators: true - run validators inside schema
  );

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
