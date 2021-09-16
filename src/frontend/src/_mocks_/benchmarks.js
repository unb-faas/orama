import faker from 'faker';

const Benchmarks = [{
  id: 1,
  providers:["GCP","AWS"],
  usecases:["F2DB","F2OS"],
  concurrences:[10,100,250,500,1000],
  repetitions:10,
  date: new Date()
}
];

export default Benchmarks;
